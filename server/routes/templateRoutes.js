import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getAllTemplates,
  getTemplateCode,
  getUserTemplate,
  getUserTemplatePreference,
  setUserTemplate,
  likeTemplate,
  createTemplate,
  getTemplate,
  updateTemplate,
  deleteTemplate,
} from '../controllers/templateController.js';
import { adminOnly } from '../middleware/adminOnly.js';

const router = express.Router();

// Public routes
router.get('/all', getAllTemplates);
router.get('/code/:templateId', getTemplateCode);
router.get('/user/:username', getUserTemplate);
router.post('/like', likeTemplate);

// Protected routes
router.get('/preference', protect, getUserTemplatePreference);
router.post('/set', protect, setUserTemplate);

// Admin only routes
router.post('/create', protect, adminOnly, createTemplate);
router.get('/:templateId', protect, adminOnly, getTemplate);
router.put('/:templateId', protect, adminOnly, updateTemplate);
router.delete('/:templateId', protect, adminOnly, deleteTemplate);

export default router;