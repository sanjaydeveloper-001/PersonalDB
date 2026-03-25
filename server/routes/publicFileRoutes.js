import express from 'express';
import { getResumeByToken } from '../controllers/vault/resumeController.js';

const router = express.Router();

router.get('/:token', getResumeByToken);

export default router;