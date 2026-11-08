import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { User, IUser } from '../models/User';
import { SeekerProfile } from '../models/SeekerProfile';
import { ReferrerProfile } from '../models/ReferrerProfile';
import { Subscription } from '../models/Subscription';
import { generateTokens, verifyRefreshToken } from '../utils/token';
import { sendSuccess, sendError } from '../utils/response';
import { sendEmail } from '../utils/email';
import { AuthenticatedRequest, UserRole } from '../types';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, role = 'seeker', company, position } = req.body;
    const name = req.body.name || req.body.fullName;

    if (!name) {
      sendError(res, 400, 'Full name is required.');
      return;
    }

    // Security rule: Admin accounts cannot be self-registered
    if (role === 'admin') {
      sendError(res, 403, 'Administrative accounts cannot be self-registered.');
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      sendError(res, 409, 'An account with this email address already exists.');
      return;
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role as UserRole,
    });

    // Create corresponding profile
    if (role === 'seeker') {
      await SeekerProfile.create({
        user: user._id,
        headline: 'Job Seeker',
        location: 'Bengaluru, India',
        profileCompletion: 60,
      });
    } else if (role === 'referrer') {
      await ReferrerProfile.create({
        user: user._id,
        company: company || 'Tech Employer',
        position: position || 'Software Engineer',
        availability: 'Available',
      });
    }

    // Initialize free subscription
    await Subscription.create({
      user: user._id,
      plan: 'free',
      status: 'active',
    });

    const tokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Update refresh token on user
    user.refreshToken = tokens.refreshToken;
    user.lastLogin = new Date();
    await user.save();

    // Set HTTP-only cookie for refresh token
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendSuccess(res, 201, 'Account successfully registered.', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token: tokens.accessToken,
      tokens,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      sendError(res, 400, 'Please provide both email address and password.');
      return;
    }

    // Find user with password included
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
      '+password +refreshToken'
    );

    if (!user) {
      sendError(res, 401, 'Invalid credentials provided.');
      return;
    }

    if (user.status === 'suspended') {
      sendError(res, 403, 'This account has been suspended by the platform administrator.');
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      sendError(res, 401, 'Invalid credentials provided.');
      return;
    }

    const tokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    user.refreshToken = tokens.refreshToken;
    user.lastLogin = new Date();
    await user.save();

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendSuccess(res, 200, 'Successfully authenticated.', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token: tokens.accessToken,
      tokens,
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!token) {
      sendError(res, 401, 'Refresh token not found.');
      return;
    }

    try {
      const decoded = verifyRefreshToken(token);
      const user = await User.findById(decoded.userId).select('+refreshToken');

      if (!user || user.status === 'suspended') {
        sendError(res, 401, 'Invalid or expired session.');
        return;
      }

      // Generate new tokens
      const tokens = generateTokens({
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      });

      user.refreshToken = tokens.refreshToken;
      await user.save();

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      sendSuccess(res, 200, 'Token refreshed successfully.', { tokens });
    } catch (err) {
      sendError(res, 401, 'Invalid or expired refresh token.');
      return;
    }
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user) {
      sendError(res, 404, 'User account not found.');
      return;
    }

    let profile: any = null;
    if (user.role === 'seeker') {
      profile = await SeekerProfile.findOne({ user: user._id });
    } else if (user.role === 'referrer') {
      profile = await ReferrerProfile.findOne({ user: user._id });
    }

    const subscription = await Subscription.findOne({ user: user._id });

    sendSuccess(res, 200, 'Current profile retrieved.', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        status: user.status,
      },
      profile,
      subscription: subscription?.plan || 'free',
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (req.user?.userId) {
      await User.findByIdAndUpdate(req.user.userId, { refreshToken: null });
    }
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    sendSuccess(res, 200, 'Successfully logged out.');
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      sendError(res, 400, 'Please provide an email address.');
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Don't leak account existence
      sendSuccess(res, 200, 'If this email is registered, you will receive reset instructions.');
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000); // 30 mins
    await user.save();

    await sendEmail({
      to: user.email,
      subject: 'Referly — Password Reset Request',
      html: `
        <h2>Referly Password Reset</h2>
        <p>You requested a password reset. Use the token below to reset your credentials:</p>
        <p><strong>${resetToken}</strong></p>
        <p>This token expires in 30 minutes.</p>
      `,
    });

    sendSuccess(res, 200, 'If this email is registered, you will receive reset instructions.');
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      sendError(res, 400, 'Reset token and new password are required.');
      return;
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() },
    });

    if (!user) {
      sendError(res, 400, 'Invalid or expired password reset token.');
      return;
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendSuccess(res, 200, 'Password has been successfully updated. Please sign in with your new password.');
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      sendError(res, 400, 'Please provide both current and new password.');
      return;
    }

    const user = await User.findById(req.user?.userId).select('+password');
    if (!user) {
      sendError(res, 404, 'User not found.');
      return;
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      sendError(res, 400, 'Current password does not match records.');
      return;
    }

    user.password = newPassword;
    await user.save();

    sendSuccess(res, 200, 'Password successfully updated.');
  } catch (error) {
    next(error);
  }
};
