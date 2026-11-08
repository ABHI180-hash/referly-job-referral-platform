import { Router } from 'express';
import {
  createApplication,
  getMyApplications,
  getApplicationById,
  updateApplicationStatus,
} from '../controllers/applicationController';
import { authenticateUser } from '../middleware/auth';
import { authorizeRoles } from '../middleware/role';
import { validateApplicationCreate } from '../validators';
import { validateRequest } from '../middleware/validate';

const router = Router();

router.post(
  '/',
  authenticateUser,
  authorizeRoles('seeker'),
  validateApplicationCreate,
  validateRequest,
  createApplication
);

router.get('/my', authenticateUser, authorizeRoles('seeker'), getMyApplications);
router.get('/:id', authenticateUser, getApplicationById);

router.patch(
  '/:id/status',
  authenticateUser,
  authorizeRoles('referrer', 'admin'),
  updateApplicationStatus
);

export default router;
