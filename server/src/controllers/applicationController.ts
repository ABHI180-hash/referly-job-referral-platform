import { Request, Response, NextFunction } from 'express';
import { Application, ApplicationStage } from '../models/Application';
import { Job } from '../models/Job';
import { Notification } from '../models/Notification';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';
import { getIO } from '../sockets/socketHandler';

export const createApplication = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const seekerId = req.user?.userId;
    const { jobId, referralRequestId, notes } = req.body;

    if (!jobId) {
      sendError(res, 400, 'Job identifier is required.');
      return;
    }

    const job = await Job.findById(jobId);
    if (!job) {
      sendError(res, 404, 'Job opening not found.');
      return;
    }

    // Check for existing application
    const existing = await Application.findOne({ seeker: seekerId, job: jobId });
    if (existing) {
      sendError(res, 409, 'You have already applied for this position.');
      return;
    }

    const application = await Application.create({
      seeker: seekerId,
      job: jobId,
      referralRequest: referralRequestId,
      status: 'Applied',
      notes: notes || '',
      feedback: 'Application submitted. Under initial recruiter review.',
      statusHistory: [
        {
          status: 'Applied',
          changedAt: new Date(),
          note: 'Application submitted to company queue.',
        },
      ],
    });

    sendSuccess(res, 201, `Application submitted for ${job.title}!`, application);
  } catch (error) {
    next(error);
  }
};

export const getMyApplications = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const seekerId = req.user?.userId;
    const { status } = req.query;

    const filter: any = { seeker: seekerId };
    if (status && status !== 'all') {
      filter.status = status;
    }

    const applications = await Application.find(filter)
      .populate('job', 'title company companyLogo location workMode salary')
      .populate({
        path: 'referralRequest',
        populate: { path: 'referrer', select: 'name email position' },
      })
      .sort({ appliedDate: -1 });

    sendSuccess(res, 200, 'Applications retrieved successfully.', applications);
  } catch (error) {
    next(error);
  }
};

export const getApplicationById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('seeker', 'name email avatar')
      .populate('referralRequest');

    if (!application) {
      sendError(res, 404, 'Application not found.');
      return;
    }

    // Ownership check: applicant, or admin
    if (
      application.seeker._id.toString() !== req.user?.userId &&
      req.user?.role !== 'admin'
    ) {
      sendError(res, 403, 'Forbidden access to this application record.');
      return;
    }

    sendSuccess(res, 200, 'Application details retrieved.', application);
  } catch (error) {
    next(error);
  }
};

export const updateApplicationStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, feedback } = req.body;

    const validStages: ApplicationStage[] = [
      'Applied',
      'Under Review',
      'Shortlisted',
      'Interview',
      'Selected',
      'Rejected',
    ];

    if (!validStages.includes(status)) {
      sendError(res, 400, 'Invalid application status provided.');
      return;
    }

    const application = await Application.findById(req.params.id).populate(
      'job',
      'title company'
    );

    if (!application) {
      sendError(res, 404, 'Application record not found.');
      return;
    }

    application.status = status;
    if (feedback) application.feedback = feedback;

    application.statusHistory.push({
      status,
      changedAt: new Date(),
      note: feedback || `Status transitioned to ${status}.`,
    });

    await application.save();

    // Create candidate notification
    const notif = await Notification.create({
      recipient: application.seeker,
      category: 'application',
      title: `Application Updated: ${status}`,
      message: `Your application for ${(application.job as any).title} is now in the "${status}" stage.`,
      relatedEntityId: application._id,
      relatedEntityType: 'Application',
      actionUrl: '/dashboard/applications',
    });

    try {
      const io = getIO();
      if (io) {
        io.to(application.seeker.toString()).emit('new_notification', notif);
      }
    } catch (socketErr) {}

    sendSuccess(res, 200, `Application status updated to ${status}.`, application);
  } catch (error) {
    next(error);
  }
};
