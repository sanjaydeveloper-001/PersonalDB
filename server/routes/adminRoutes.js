import express from 'express';
import { protect } from '../middleware/auth.js';
import { adminOnly } from '../middleware/adminOnly.js';
import {
  getAllTemplatesAdmin,
  createTemplateAdmin,
  getTemplateAdmin,
  updateTemplateAdmin,
  deleteTemplateAdmin,
} from '../controllers/adminTemplateController.js';
import {
  getAllUsersAdmin,
  getUserAdmin,
  updateUserRoleAdmin,
  deleteUserAdmin,
  searchUserAdmin,
} from '../controllers/adminUserController.js';

const router = express.Router();

// Protect all admin routes
router.use(protect, adminOnly);

/* ═══════════════════════════════════
   TEMPLATES MANAGEMENT
═══════════════════════════════════ */
router.get('/templates', getAllTemplatesAdmin);
router.post('/templates', createTemplateAdmin);
router.get('/templates/:templateId', getTemplateAdmin);
router.put('/templates/:templateId', updateTemplateAdmin);
router.delete('/templates/:templateId', deleteTemplateAdmin);

/* ═══════════════════════════════════
   USERS MANAGEMENT
═══════════════════════════════════ */
router.get('/users', getAllUsersAdmin);
router.get('/users/search', searchUserAdmin);
router.get('/users/:userId', getUserAdmin);
router.put('/users/:userId/role', updateUserRoleAdmin);
router.delete('/users/:userId', deleteUserAdmin);

export default router;