import express from 'express';
import { protect } from '../../middleware/auth.js';
import { uploadVault } from '../../middleware/uploadVault.js';
import { uploadFile } from '../../controllers/vault/uploadController.js';

const router = express.Router();
router.post('/', protect, uploadVault.single('file'), uploadFile);
export default router;
