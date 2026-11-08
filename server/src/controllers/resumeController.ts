import { Request, Response, NextFunction } from 'express';
import { Resume } from '../models/Resume';
import { SeekerProfile } from '../models/SeekerProfile';
import { cloudinary } from '../config/cloudinary';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../types';
import { ENV } from '../config/environment';

export const uploadResumeFile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const file = req.file;

    if (!file) {
      sendError(res, 400, 'Please select a resume file to upload.');
      return;
    }

    let cloudUrl = `https://storage.referly.io/resumes/${userId}_${Date.now()}_${file.originalname}`;

    // Upload to Cloudinary if credentials configured
    if (ENV.CLOUDINARY_CLOUD_NAME && ENV.CLOUDINARY_API_KEY) {
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;
      const uploadRes = await cloudinary.uploader.upload(dataURI, {
        resource_type: 'raw',
        folder: 'referly/resumes',
        public_id: `${userId}_resume_${Date.now()}`,
      });
      cloudUrl = uploadRes.secure_url;
    }

    // Upsert Resume record
    const resume = await Resume.findOneAndUpdate(
      { user: userId },
      {
        originalFilename: file.originalname,
        cloudStorageUrl: cloudUrl,
        fileType: file.mimetype,
        fileSize: file.size,
        isPrimary: true,
      },
      { upsert: true, new: true }
    );

    // Update Seeker Profile
    await SeekerProfile.findOneAndUpdate(
      { user: userId },
      {
        resumeUrl: cloudUrl,
        resumeName: file.originalname,
      }
    );

    sendSuccess(res, 200, `Resume "${file.originalname}" uploaded successfully!`, resume);
  } catch (error) {
    next(error);
  }
};

export const deleteResumeFile = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    await Resume.deleteOne({ user: userId });
    await SeekerProfile.findOneAndUpdate(
      { user: userId },
      { $unset: { resumeUrl: 1, resumeName: 1 } }
    );

    sendSuccess(res, 200, 'Resume removed successfully.');
  } catch (error) {
    next(error);
  }
};
