import { Router } from 'express';
import { LaunchAnalyticsController } from '../controllers/launchAnalyticsController';

const router = Router();

router.get('/', LaunchAnalyticsController.getAnalytics);

export default router;
