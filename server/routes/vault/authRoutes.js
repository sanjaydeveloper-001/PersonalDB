import express from 'express';
import { registerUser, loginUser, logoutUser, getMe, verifySecurity, resetPassword } from '../../controllers/vault/authController.js';
import { protect } from '../../middleware/auth.js';

const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);
router.post('/verify-security', verifySecurity);
router.post('/reset-password', resetPassword);
export default router;
