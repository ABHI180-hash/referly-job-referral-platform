import { Router } from 'express';
import {
  getMyProfile,
  updateMyProfile,
  getPublicReferrers,
  getReferrerById,
} from '../controllers/profileController';
import { authenticateUser } from '../middleware/auth';

const router = Router();

router.get('/me', authenticateUser, getMyProfile);
router.put('/me', authenticateUser, updateMyProfile);
router.patch('/me', authenticateUser, updateMyProfile);
router.get('/referrers', getPublicReferrers);
router.get('/referrers/:id', getReferrerById);

export default router;
