import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, UserRole } from '../types';
import { verifyAccessToken } from '../utils/token';
import { sendError } from '../utils/response';
import { User } from '../models/User';

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check Authorization header: Bearer <token>
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      sendError(res, 401, 'Authentication token missing. Please sign in to proceed.');
      return;
    }

    try {
      const decoded = verifyAccessToken(token);

      // Verify that user still exists and is not suspended
      const user = await User.findById(decoded.userId).select('status role email');
      if (!user) {
        sendError(res, 401, 'User account associated with this token no longer exists.');
        return;
      }

      if (user.status === 'suspended') {
        sendError(res, 403, 'Your account has been suspended by the platform administrator.');
        return;
      }

      req.user = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role as UserRole,
      };

      next();
    } catch (err: any) {
      sendError(res, 401, 'Invalid or expired authentication session. Please log in again.');
      return;
    }
  } catch (error: any) {
    next(error);
  }
};
