import { Request, Response, NextFunction } from 'express';
import { ReferralRequest } from '../models/ReferralRequest';
import { Job } from '../models/Job';
import { User } from '../models/User';
import { SeekerProfile } from '../models/SeekerProfile';
import { ReferrerProfile } from '../models/ReferrerProfile';
import { Subscription } from '../models/Subscription';
import { SubscriptionPlan } from '../models/SubscriptionPlan';
import { Notification } from '../models/Notification';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';
import { getIO } from '../sockets/socketHandler';

export const createReferralRequest = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const seekerId = req.user?.userId;
    const { jobId, referrerId } = req.body;
    const note = req.body.note || req.body.customNote;

    if (!jobId || !referrerId || !note) {
      sendError(res, 400, 'Job ID, Referrer ID, and personal note are required.');
      return;
    }

    // 1. Verify Job and Referrer exist
    const job = await Job.findById(jobId);
    if (!job) {
      sendError(res, 404, 'Target job opening not found.');
      return;
    }

    const referrerUser = await User.findById(referrerId);
    if (!referrerUser || referrerUser.role !== 'referrer') {
      sendError(res, 404, 'Target referrer not found or is not a verified employee.');
      return;
    }

    // 2. Prevent duplicate active referral requests
    const existingActive = await ReferralRequest.findOne({
      seeker: seekerId,
      referrer: referrerId,
      job: jobId,
      status: { $in: ['Pending', 'Accepted'] },
    });

    if (existingActive) {
      sendError(
        res,
        400,
        'You already have an active or accepted referral request for this position with this employee.'
      );
      return;
    }

    // 3. Enforce Subscription Quota
    const subscription = await Subscription.findOne({ user: seekerId });
    const currentPlanId = subscription?.plan || 'free';
    const planConfig = await SubscriptionPlan.findOne({ planId: currentPlanId });
    const maxReferrals = planConfig?.limits?.referralsPerMonth ?? (currentPlanId === 'free' ? 2 : 15);

    if (subscription && subscription.referralsUsedThisMonth >= maxReferrals) {
      sendError(
        res,
        403,
        `You have reached your monthly referral limit (${maxReferrals} requests) for the ${currentPlanId.toUpperCase()} tier. Please upgrade to Referly Pro to continue requesting referrals.`
      );
      return;
    }

    // 4. Retrieve candidate resume
    const seekerProfile = await SeekerProfile.findOne({ user: seekerId });
    const finalResumeUrl = req.body.resumeUrl || seekerProfile?.resumeUrl || '#';
    const finalResumeName = req.body.resumeName || seekerProfile?.resumeName || 'Candidate_Resume.pdf';

    // 5. Create the Referral Request
    const referralRequest = await ReferralRequest.create({
      seeker: seekerId,
      referrer: referrerId,
      job: jobId,
      note,
      resumeUrl: finalResumeUrl,
      resumeName: finalResumeName,
      status: 'Pending',
      statusHistory: [
        {
          status: 'Pending',
          changedAt: new Date(),
          comment: 'Referral request dispatched to employee.',
        },
      ],
    });

    // 6. Increment subscription counter
    if (subscription) {
      subscription.referralsUsedThisMonth += 1;
      await subscription.save();
    }

    // 7. Create in-app notification for the Referrer
    const candidateUser = await User.findById(seekerId);
    const notification = await Notification.create({
      recipient: referrerId,
      category: 'referral',
      title: 'New Referral Request Received',
      message: `${candidateUser?.name || 'A candidate'} requested an internal referral for ${job.title}.`,
      relatedEntityId: referralRequest._id,
      relatedEntityType: 'ReferralRequest',
      actionUrl: '/referrer-dashboard/requests',
    });

    // 8. Emit real-time WebSocket event via Socket.IO
    try {
      const io = getIO();
      if (io) {
        io.to(referrerId.toString()).emit('new_notification', notification);
        io.to(referrerId.toString()).emit('new_referral_request', referralRequest);
      }
    } catch (socketErr) {
      // Non-blocking socket error
    }

    sendSuccess(
      res,
      201,
      'Referral request submitted successfully to the corporate referrer.',
      referralRequest
    );
  } catch (error) {
    next(error);
  }
};

export const getMySentRequests = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const seekerId = req.user?.userId;

    const requests = await ReferralRequest.find({ seeker: seekerId })
      .populate('job', 'title company companyLogo location workMode salary')
      .populate('referrer', 'name email avatar')
      .sort({ createdAt: -1 });

    sendSuccess(res, 200, 'Sent referral requests retrieved.', requests);
  } catch (error) {
    next(error);
  }
};

export const getIncomingRequests = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const referrerId = req.user?.userId;

    const requests = await ReferralRequest.find({ referrer: referrerId })
      .populate('job', 'title company location department workMode')
      .populate('seeker', 'name email avatar')
      .sort({ createdAt: -1 });

    sendSuccess(res, 200, 'Incoming referral requests retrieved.', requests);
  } catch (error) {
    next(error);
  }
};

export const updateRequestStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rawStatus = req.body.status || '';
    const status = (rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1).toLowerCase()) as any;
    const responseMessage = req.body.responseMessage || req.body.feedbackNotes;
    const referrerId = req.user?.userId;
    const role = req.user?.role;

    if (!['Accepted', 'Rejected', 'Completed'].includes(status)) {
      sendError(res, 400, "Invalid status. Must be 'Accepted', 'Rejected', or 'Completed'.");
      return;
    }

    const request = await ReferralRequest.findById(req.params.id)
      .populate('job', 'title company')
      .populate('referrer', 'name');

    if (!request) {
      sendError(res, 404, 'Referral request not found.');
      return;
    }

    // Role check: Only the assigned referrer or platform admin can accept/reject
    if (request.referrer._id.toString() !== referrerId && role !== 'admin') {
      sendError(res, 403, 'You are not authorized to update this referral request.');
      return;
    }

    request.status = status;
    if (responseMessage) request.referrerResponse = responseMessage;

    request.statusHistory.push({
      status,
      changedAt: new Date(),
      comment: responseMessage || `Request ${status.toLowerCase()} by referrer.`,
    });

    await request.save();

    // If accepted, update referrer's total referrals count
    if (status === 'Accepted') {
      await ReferrerProfile.findOneAndUpdate(
        { user: referrerId },
        { $inc: { totalReferrals: 1 } }
      );
    }

    // Notify Seeker
    const notif = await Notification.create({
      recipient: request.seeker,
      category: 'referral',
      title: `Referral Request ${status}`,
      message: `${(request.referrer as any).name} ${status.toLowerCase()} your referral request for ${(request.job as any).title}.`,
      relatedEntityId: request._id,
      relatedEntityType: 'ReferralRequest',
      actionUrl: '/dashboard/referral-requests',
    });

    // Real-time Socket.IO emission
    try {
      const io = getIO();
      if (io) {
        io.to(request.seeker.toString()).emit('new_notification', notif);
        io.to(request.seeker.toString()).emit('referral_status_updated', request);
      }
    } catch (socketErr) {}

    sendSuccess(res, 200, `Referral request ${status.toLowerCase()} successfully.`, request);
  } catch (error) {
    next(error);
  }
};

export const cancelRequest = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const seekerId = req.user?.userId;
    const request = await ReferralRequest.findById(req.params.id);

    if (!request) {
      sendError(res, 404, 'Referral request not found.');
      return;
    }

    if (request.seeker.toString() !== seekerId && req.user?.role !== 'admin') {
      sendError(res, 403, 'You are not authorized to cancel this request.');
      return;
    }

    if (request.status !== 'Pending') {
      sendError(res, 400, 'Only pending referral requests can be cancelled.');
      return;
    }

    request.status = 'Cancelled';
    request.statusHistory.push({
      status: 'Cancelled',
      changedAt: new Date(),
      comment: 'Request withdrawn by candidate.',
    });
    await request.save();

    sendSuccess(res, 200, 'Referral request cancelled.', request);
  } catch (error) {
    next(error);
  }
};

export const getAllReferralsAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const requests = await ReferralRequest.find()
      .populate('seeker', 'name email avatar')
      .populate('referrer', 'name email avatar')
      .populate('job', 'title company location')
      .sort({ createdAt: -1 });

    sendSuccess(res, 200, 'All referral requests retrieved.', requests);
  } catch (error) {
    next(error);
  }
};
