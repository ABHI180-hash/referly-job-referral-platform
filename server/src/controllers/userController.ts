import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { SeekerProfile } from '../models/SeekerProfile';
import { ReferrerProfile } from '../models/ReferrerProfile';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    const { search, role, status } = req.query;

    const filter: any = {};
    if (role && role !== 'all') filter.role = role;
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    sendSuccess(res, 200, 'Users retrieved successfully.', users, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      sendError(res, 404, 'User not found.');
      return;
    }

    let profile = null;
    if (user.role === 'seeker') {
      profile = await SeekerProfile.findOne({ user: user._id });
    } else if (user.role === 'referrer') {
      profile = await ReferrerProfile.findOne({ user: user._id });
    }

    sendSuccess(res, 200, 'User details retrieved.', { user, profile });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.body;
    if (!['active', 'suspended'].includes(status)) {
      sendError(res, 400, "Status must be either 'active' or 'suspended'.");
      return;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!user) {
      sendError(res, 404, 'User not found.');
      return;
    }

    sendSuccess(res, 200, `User account ${status === 'active' ? 'reactivated' : 'suspended'}.`, user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      sendError(res, 404, 'User not found.');
      return;
    }

    // Clean up profiles
    await SeekerProfile.deleteOne({ user: user._id });
    await ReferrerProfile.deleteOne({ user: user._id });

    sendSuccess(res, 200, 'User account and associated profiles removed.');
  } catch (error) {
    next(error);
  }
};
