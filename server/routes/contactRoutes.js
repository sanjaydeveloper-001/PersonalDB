import express from 'express';
import { sendContactMessage } from '../controllers/contactController.js';

const router = express.Router();

/**
 * POST /api/contact/send
 * Send contact form message
 * Body: { username, email, issueType, message }
 */
router.post('/send', sendContactMessage);

export default router;
