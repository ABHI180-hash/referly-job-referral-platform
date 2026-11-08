import { Request, Response, NextFunction } from 'express';
import { Job, IJob } from '../models/Job';
import { Company } from '../models/Company';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export const getJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    const {
      search,
      location,
      workMode,
      jobType,
      experienceLevel,
      company,
      sortBy = 'latest',
    } = req.query;

    const filter: any = { status: 'active' };

    if (workMode && workMode !== 'all') {
      filter.workMode = new RegExp(`^${workMode}$`, 'i');
    }

    if (jobType && jobType !== 'all') {
      filter.jobType = new RegExp(`^${jobType}$`, 'i');
    }

    if (experienceLevel && experienceLevel !== 'all') {
      filter.experienceLevel = new RegExp(`^${experienceLevel}$`, 'i');
    }

    if (company && company !== 'all') {
      filter.company = { $regex: company, $options: 'i' };
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search as string, 'i')] } },
      ];
    }

    let sort: any = { postedDate: -1 };
    if (sortBy === 'salary') {
      sort = { maxSalary: -1, minSalary: -1 };
    }

    const total = await Job.countDocuments(filter);
    const jobs = await Job.find(filter).sort(sort).skip(skip).limit(limit);

    sendSuccess(res, 200, 'Jobs retrieved successfully.', jobs, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

export const getJobById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      sendError(res, 404, 'Job opening not found.');
      return;
    }

    // Retrieve up to 2 similar jobs from same department or other active listings
    const similarJobs = await Job.find({
      _id: { $ne: job._id },
      status: 'active',
    })
      .limit(2)
      .sort({ postedDate: -1 });

    sendSuccess(res, 200, 'Job details retrieved.', { job, similarJobs });
  } catch (error) {
    next(error);
  }
};

export const createJob = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      title,
      company,
      location,
      workMode,
      jobType,
      experienceLevel,
      experienceRange,
      salary,
      department,
      description,
      responsibilities,
      skills,
      benefits,
      aboutCompany,
      applicationUrl,
    } = req.body;

    // Associate company logo if partner exists
    const partnerCompany = await Company.findOne({
      name: { $regex: `^${company}$`, $options: 'i' },
    });

    const job = await Job.create({
      title,
      company,
      companyLogo:
        partnerCompany?.logo ||
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=120',
      companyRef: partnerCompany?._id,
      location,
      workMode: workMode || 'Hybrid',
      jobType: jobType || 'Full-time',
      experienceLevel: experienceLevel || 'Mid-level',
      experienceRange: experienceRange || '3 - 6 years',
      salary: salary || 'Competitive',
      department: department || 'Engineering',
      description,
      responsibilities: responsibilities || [],
      skills: skills || [],
      benefits: benefits || [],
      aboutCompany: aboutCompany || '',
      applicationUrl,
      postedBy: req.user?.userId,
      status: 'active',
      referrerCount: 1,
    });

    // Update company open positions count if applicable
    if (partnerCompany) {
      partnerCompany.openPositions += 1;
      await partnerCompany.save();
    }

    sendSuccess(res, 201, 'Job referral opportunity successfully published.', job);
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      sendError(res, 404, 'Job not found.');
      return;
    }

    // Role check: Only owner or admin can update
    if (
      job.postedBy &&
      job.postedBy.toString() !== req.user?.userId &&
      req.user?.role !== 'admin'
    ) {
      sendError(res, 403, 'You are not authorized to modify this job requisition.');
      return;
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    sendSuccess(res, 200, 'Job updated successfully.', updatedJob);
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      sendError(res, 404, 'Job not found.');
      return;
    }

    // Role check: Only owner or admin can delete
    if (
      job.postedBy &&
      job.postedBy.toString() !== req.user?.userId &&
      req.user?.role !== 'admin'
    ) {
      sendError(res, 403, 'You are not authorized to delete this job requisition.');
      return;
    }

    await Job.findByIdAndDelete(req.params.id);
    sendSuccess(res, 200, 'Job requisition deleted successfully.');
  } catch (error) {
    next(error);
  }
};
