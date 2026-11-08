import { Router } from 'express';
import { LaunchScanController } from '../controllers/launchScanController';

const router = Router();

router.post('/trigger', LaunchScanController.triggerScan);
router.get('/latest/:websiteId', LaunchScanController.getLatestScan);
router.get('/history', LaunchScanController.getHistory);
router.get('/compare', LaunchScanController.compareScans);
router.post('/verify/:scanId', LaunchScanController.manualVerifyCheck);

export default router;
