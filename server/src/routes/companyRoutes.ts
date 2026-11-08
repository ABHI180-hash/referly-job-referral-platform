import { Router } from 'express';
import {
  getCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany,
} from '../controllers/companyController';
import { authenticateUser } from '../middleware/auth';
import { authorizeRoles } from '../middleware/role';

const router = Router();

router.get('/', getCompanies);
router.get('/:id', getCompanyById);

// Admin-only creation/update
router.post('/', authenticateUser, authorizeRoles('admin'), createCompany);
router.put('/:id', authenticateUser, authorizeRoles('admin'), updateCompany);
router.delete('/:id', authenticateUser, authorizeRoles('admin'), deleteCompany);

export default router;
