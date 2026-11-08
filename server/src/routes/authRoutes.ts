import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
} from '../controllers/authController';
import { authenticateUser } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import {
  validateRegister,
  validateLogin,
  validatePasswordChange,
} from '../validators';

const router = Router();

router.post('/register', validateRegister, validateRequest, register);
router.post('/login', validateLogin, validateRequest, login);
router.post('/refresh-token', refreshToken);
router.get('/me', authenticateUser, getMe);
router.post('/logout', authenticateUser, logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post(
  '/change-password',
  authenticateUser,
  validatePasswordChange,
  validateRequest,
  changePassword
);

export default router;
