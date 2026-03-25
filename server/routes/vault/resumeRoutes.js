import express from 'express';
import { getResumes, uploadResume, deleteResume, addEmptySlot } from '../../controllers/vault/resumeController.js';
import { protect } from '../../middleware/auth.js';
import { uploadVault } from '../../middleware/uploadVault.js';

const router = express.Router();
router.route('/').get(protect, getResumes);
router.post('/add-slot', protect, addEmptySlot); // NEW: Add empty slot without file
router.post('/upload', protect, uploadVault.single('resume'), uploadResume);
router.delete('/:id', protect, deleteResume);
export default router;