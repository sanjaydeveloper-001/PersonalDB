import express from 'express';
import { getResumes, uploadResume, getResumeByToken, deleteResume } from '../../controllers/vault/resumeController.js';
import { protect } from '../../middleware/auth.js';
import { uploadVault } from '../../middleware/uploadVault.js';

const router = express.Router();
router.route('/').get(protect, getResumes);
router.post('/upload', protect, uploadVault.single('resume'), uploadResume);
router.get('/public/:token', getResumeByToken);
router.delete('/:id', protect, deleteResume);
export default router;
