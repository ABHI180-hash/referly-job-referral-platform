import { Router } from 'express';
import { LaunchWebsiteController } from '../controllers/launchWebsiteController';

const router = Router();

router.get('/', LaunchWebsiteController.getAll);
router.post('/', LaunchWebsiteController.create);
router.get('/:id', LaunchWebsiteController.getById);
router.put('/:id', LaunchWebsiteController.update);
router.delete('/:id', LaunchWebsiteController.delete);

export default router;
