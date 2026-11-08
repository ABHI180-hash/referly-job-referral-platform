import { Router } from 'express';
import {
  saveJob,
  unsaveJob,
  getSavedJobs,
  checkIsSaved,
} from '../controllers/savedJobController';
import { authenticateUser } from '../middleware/auth';

const router = Router();

router.post('/', authenticateUser, saveJob);
router.delete('/:jobId', authenticateUser, unsaveJob);
router.get('/', authenticateUser, getSavedJobs);
router.get('/:jobId/check', authenticateUser, checkIsSaved);

export default router;
