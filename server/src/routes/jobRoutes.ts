import { Router } from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/jobController';
import { authenticateUser } from '../middleware/auth';
import { authorizeRoles } from '../middleware/role';
import { validateJobCreate } from '../validators';
import { validateRequest } from '../middleware/validate';

const router = Router();

router.get('/', getJobs);
router.get('/:id', getJobById);

// Protected routes: referrers & admins
router.post(
  '/',
  authenticateUser,
  authorizeRoles('referrer', 'admin'),
  validateJobCreate,
  validateRequest,
  createJob
);

router.put(
  '/:id',
  authenticateUser,
  authorizeRoles('referrer', 'admin'),
  updateJob
);

router.delete(
  '/:id',
  authenticateUser,
  authorizeRoles('referrer', 'admin'),
  deleteJob
);

export default router;
