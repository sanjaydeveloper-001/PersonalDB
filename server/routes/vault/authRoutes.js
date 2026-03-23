import express from 'express';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getMe, 
  verifySecurity, 
  resetPassword,
  verifyPassword,        // NEW
  changePassword,        // NEW
  deleteAccount          // NEW
} from '../../controllers/vault/authController.js';
import { protect } from '../../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-security', verifySecurity);
router.post('/reset-password', resetPassword);

// Protected routes (require authentication)
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getMe);
router.post('/verify-password', protect, verifyPassword);        // NEW
router.put('/change-password', protect, changePassword);         // NEW
router.delete('/account', protect, deleteAccount);               // NEW

export default router;