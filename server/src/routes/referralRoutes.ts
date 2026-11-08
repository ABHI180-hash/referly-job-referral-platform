import { Router } from 'express';
import {
  createReferralRequest,
  getMySentRequests,
  getIncomingRequests,
  updateRequestStatus,
  cancelRequest,
  getAllReferralsAdmin,
} from '../controllers/referralController';
import { authenticateUser } from '../middleware/auth';
import { authorizeRoles } from '../middleware/role';
import { validateReferralCreate } from '../validators';
import { validateRequest } from '../middleware/validate';

const router = Router();

// Job Seeker: Create referral request
router.post(
  '/',
  authenticateUser,
  authorizeRoles('seeker'),
  validateReferralCreate,
  validateRequest,
  createReferralRequest
);

// Job Seeker: Sent requests
router.get('/sent', authenticateUser, authorizeRoles('seeker'), getMySentRequests);

// Referrer: Incoming requests
router.get(
  '/incoming',
  authenticateUser,
  authorizeRoles('referrer'),
  getIncomingRequests
);

// Referrer / Admin: Accept or Reject request
router.patch(
  '/:id/status',
  authenticateUser,
  authorizeRoles('referrer', 'admin'),
  updateRequestStatus
);

// Seeker: Cancel request
router.delete('/:id', authenticateUser, cancelRequest);

// Admin: View all
router.get('/all', authenticateUser, authorizeRoles('admin'), getAllReferralsAdmin);

export default router;
