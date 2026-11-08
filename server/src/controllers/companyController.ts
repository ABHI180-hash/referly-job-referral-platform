import { Request, Response, NextFunction } from 'express';
import { Company } from '../models/Company';
import { Job } from '../models/Job';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';

export const getCompanies = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { search, industry } = req.query;

    const filter: any = {};
    if (industry && industry !== 'all') {
      filter.industry = { $regex: industry, $options: 'i' };
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const companies = await Company.find(filter).sort({ featured: -1, name: 1 });
    sendSuccess(res, 200, 'Companies retrieved successfully.', companies);
  } catch (error) {
    next(error);
  }
};

export const getCompanyById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      sendError(res, 404, 'Company not found.');
      return;
    }

    const openJobs = await Job.find({
      company: { $regex: `^${company.name}$`, $options: 'i' },
      status: 'active',
    });

    sendSuccess(res, 200, 'Company details retrieved.', { company, openJobs });
  } catch (error) {
    next(error);
  }
};

export const createCompany = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, industry, description, website, location, employeeCount, logo } =
      req.body;

    const company = await Company.create({
      name,
      industry,
      description,
      website,
      location,
      employeeCount,
      logo:
        logo ||
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=120',
      openPositions: 0,
    });

    sendSuccess(res, 201, 'Company partner registered successfully.', company);
  } catch (error) {
    next(error);
  }
};

export const updateCompany = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!company) {
      sendError(res, 404, 'Company not found.');
      return;
    }

    sendSuccess(res, 200, 'Company profile updated.', company);
  } catch (error) {
    next(error);
  }
};

export const deleteCompany = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      sendError(res, 404, 'Company not found.');
      return;
    }

    sendSuccess(res, 200, 'Company partner profile removed.');
  } catch (error) {
    next(error);
  }
};
