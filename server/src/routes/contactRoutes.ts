import { Router } from 'express';
import {
  submitContactMessage,
  getContactMessages,
} from '../controllers/contactController';
import { authenticateUser } from '../middleware/auth';
import { authorizeRoles } from '../middleware/role';

const router = Router();

router.post('/', submitContactMessage);
router.get('/', authenticateUser, authorizeRoles('admin'), getContactMessages);

export default router;
