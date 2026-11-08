import { Router } from 'express';
import { LaunchNotificationController } from '../controllers/launchNotificationController';

const router = Router();

router.get('/', LaunchNotificationController.getAll);
router.patch('/:id/read', LaunchNotificationController.markRead);
router.post('/read-all', LaunchNotificationController.markAllRead);

export default router;
