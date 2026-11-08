import multer from 'multer';
import path from 'path';

// Use memory storage so files can either be streamed to Cloudinary or stored
const storage = multer.memoryStorage();

// Resume filter: PDF or DOCX only
const resumeFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMime = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
  ];

  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedMime.includes(file.mimetype) || ext === '.pdf' || ext === '.docx') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only PDF and DOCX resume files are permitted.'));
  }
};

// Image filter: JPEG, PNG, WEBP
const imageFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid image format. Supported formats: JPG, PNG, WEBP.'));
  }
};

export const uploadResume = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: resumeFilter,
});

export const uploadImage = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: imageFilter,
});
