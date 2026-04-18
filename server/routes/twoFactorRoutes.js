import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  generate2FA,
  verify2FASetup,
  disable2FA,
  get2FAStatusAPI,
  request2FADisableEmail,
  verify2FADisableToken,
} from '../controllers/vault/twoFactorController.js';

const router = express.Router();

// Generate 2FA setup (get QR code and manual code) - requires auth
router.post('/generate', protect, generate2FA);

// Verify 2FA setup (user enters 6-digit code) - requires auth
router.post('/verify-setup', protect, verify2FASetup);

// Disable 2FA (requires password) - requires auth
router.delete('/disable', protect, disable2FA);

// Get 2FA status - requires auth
router.get('/status', protect, get2FAStatusAPI);

// Request 2FA disable via email - works with authenticated user OR pending 2FA session
router.post('/disable-request-email', request2FADisableEmail);

// Public route - verify 2FA disable token (no auth required)
router.post('/verify-disable-token', verify2FADisableToken);

export default router;
