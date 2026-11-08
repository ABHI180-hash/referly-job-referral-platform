import { Router } from 'express';
import { uploadResumeFile, deleteResumeFile } from '../controllers/resumeController';
import { authenticateUser } from '../middleware/auth';
import { uploadResume } from '../middleware/upload';

const router = Router();

router.post('/upload', authenticateUser, uploadResume.single('resume'), uploadResumeFile);
router.delete('/', authenticateUser, deleteResumeFile);

export default router;
