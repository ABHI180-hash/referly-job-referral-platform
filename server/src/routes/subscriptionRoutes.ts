import { Router } from 'express';
import {
  getPlans,
  getMySubscription,
  upgradePlan,
} from '../controllers/subscriptionController';
import { authenticateUser } from '../middleware/auth';

const router = Router();

router.get('/plans', getPlans);
router.get('/my', authenticateUser, getMySubscription);
router.post('/upgrade', authenticateUser, upgradePlan);

export default router;
