import { Request, Response, NextFunction } from 'express';
import { SeekerProfile } from '../models/SeekerProfile';
import { ReferrerProfile } from '../models/ReferrerProfile';
import { User } from '../models/User';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export const getMyProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;

    if (role === 'seeker') {
      const profile = await SeekerProfile.findOne({ user: userId }).populate(
        'user',
        'name email avatar status'
      );
      sendSuccess(res, 200, 'Seeker profile retrieved.', profile);
    } else if (role === 'referrer') {
      const profile = await ReferrerProfile.findOne({ user: userId }).populate(
        'user',
        'name email avatar status'
      );
      sendSuccess(res, 200, 'Referrer profile retrieved.', profile);
    } else {
      const user = await User.findById(userId);
      sendSuccess(res, 200, 'Admin profile retrieved.', { user });
    }
  } catch (error) {
    next(error);
  }
};

export const updateMyProfile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role;
    const { name, avatar, ...profileUpdates } = req.body;

    // Update User model fields if provided
    if (name || avatar) {
      const userUpdates: any = {};
      if (name) userUpdates.name = name;
      if (avatar) userUpdates.avatar = avatar;
      await User.findByIdAndUpdate(userId, userUpdates);
    }

    let updatedProfile = null;
    if (role === 'seeker') {
      updatedProfile = await SeekerProfile.findOneAndUpdate(
        { user: userId },
        { $set: profileUpdates },
        { new: true, upsert: true }
      ).populate('user', 'name email avatar status');
    } else if (role === 'referrer') {
      updatedProfile = await ReferrerProfile.findOneAndUpdate(
        { user: userId },
        { $set: profileUpdates },
        { new: true, upsert: true }
      ).populate('user', 'name email avatar status');
    }

    sendSuccess(res, 200, 'Profile updated successfully.', updatedProfile);
  } catch (error) {
    next(error);
  }
};

export const getPublicReferrers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 12;
    const skip = (page - 1) * limit;

    const { search, company, availability, sortBy = 'successRate' } = req.query;

    const filter: any = { profileVisibility: true };

    if (company && company !== 'all') {
      filter.company = { $regex: company, $options: 'i' };
    }

    if (availability && availability !== 'all') {
      filter.availability = availability;
    }

    if (search) {
      filter.$or = [
        { company: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search as string, 'i')] } },
      ];
    }

    let sortOption: any = { successRate: -1 };
    if (sortBy === 'totalReferrals') sortOption = { totalReferrals: -1 };

    const total = await ReferrerProfile.countDocuments(filter);
    const referrers = await ReferrerProfile.find(filter)
      .populate('user', 'name email avatar status')
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    // Format for frontend consumption
    const formatted = referrers.map((ref: any) => ({
      id: ref._id,
      userId: ref.user?._id,
      name: ref.user?.name || 'Verified Referrer',
      avatar: ref.user?.avatar,
      company: ref.company,
      companyLogo:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=120',
      position: ref.position,
      department: ref.department || 'Engineering',
      experienceYears: ref.experienceYears,
      skills: ref.skills,
      bio: ref.bio,
      availability: ref.availability,
      totalReferrals: ref.totalReferrals,
      successRate: ref.successRate,
      linkedinUrl: ref.linkedinUrl,
      featured: ref.featured,
    }));

    sendSuccess(res, 200, 'Referrers directory retrieved.', formatted, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const getReferrerById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const referrer = await ReferrerProfile.findById(req.params.id).populate(
      'user',
      'name email avatar status'
    );

    if (!referrer) {
      sendError(res, 404, 'Referrer profile not found.');
      return;
    }

    sendSuccess(res, 200, 'Referrer profile retrieved.', referrer);
  } catch (error) {
    next(error);
  }
};
