import { Router } from 'express';
import {
  getPlatformAnalytics,
  getAuditReports,
} from '../controllers/adminController';
import { authenticateUser } from '../middleware/auth';
import { authorizeRoles } from '../middleware/role';

const router = Router();

router.use(authenticateUser, authorizeRoles('admin'));

router.get('/analytics', getPlatformAnalytics);
router.get('/reports', getAuditReports);

export default router;
