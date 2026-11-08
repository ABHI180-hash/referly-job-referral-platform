import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
} from '../controllers/userController';
import { authenticateUser } from '../middleware/auth';
import { authorizeRoles } from '../middleware/role';

const router = Router();

// Admin-only endpoints
router.get('/', authenticateUser, authorizeRoles('admin'), getAllUsers);
router.get('/:id', authenticateUser, getUserById);
router.patch('/:id/status', authenticateUser, authorizeRoles('admin'), updateUserStatus);
router.delete('/:id', authenticateUser, authorizeRoles('admin'), deleteUser);

export default router;
