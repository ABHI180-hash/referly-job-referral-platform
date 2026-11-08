import { Request, Response, NextFunction } from 'express';
import { SavedJob } from '../models/SavedJob';
import { Job } from '../models/Job';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export const saveJob = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { jobId } = req.body;

    if (!jobId) {
      sendError(res, 400, 'Job ID is required.');
      return;
    }

    const job = await Job.findById(jobId);
    if (!job) {
      sendError(res, 404, 'Job not found.');
      return;
    }

    // Check if already saved
    const alreadySaved = await SavedJob.findOne({ user: userId, job: jobId });
    if (alreadySaved) {
      sendSuccess(res, 200, 'Job is already saved to your bookmarks.', alreadySaved);
      return;
    }

    const savedJob = await SavedJob.create({ user: userId, job: jobId });
    sendSuccess(res, 201, 'Job bookmarked successfully!', savedJob);
  } catch (error) {
    next(error);
  }
};

export const unsaveJob = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { jobId } = req.params;

    const result = await SavedJob.findOneAndDelete({ user: userId, job: jobId });
    if (!result) {
      sendError(res, 404, 'Saved job bookmark not found.');
      return;
    }

    sendSuccess(res, 200, 'Job removed from your saved bookmarks.');
  } catch (error) {
    next(error);
  }
};

export const getSavedJobs = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const savedRecords = await SavedJob.find({ user: userId })
      .populate('job')
      .sort({ createdAt: -1 });

    const jobs = savedRecords.map((r) => r.job).filter(Boolean);
    sendSuccess(res, 200, 'Saved jobs retrieved.', jobs);
  } catch (error) {
    next(error);
  }
};

export const checkIsSaved = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { jobId } = req.params;

    const exists = await SavedJob.exists({ user: userId, job: jobId });
    sendSuccess(res, 200, 'Bookmark status checked.', { isSaved: Boolean(exists) });
  } catch (error) {
    next(error);
  }
};
