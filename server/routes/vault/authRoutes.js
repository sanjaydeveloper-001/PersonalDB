import express from 'express';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getMe, 
  verifySecurity, 
  resetPassword,
  verifyPassword,
  changePassword,
  deleteAccount,
  getNotificationPreferences,
  updateNotificationPreferences,
  getAppearancePreferences,
  updateAppearancePreferences,
  getPrivacyPreferences,
  updatePrivacyPreferences,
} from '../../controllers/vault/authController.js';
import { protect } from '../../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-security', verifySecurity);
router.post('/reset-password', resetPassword);

// Protected routes
router.post('/logout', protect, logoutUser);
router.get('/me', protect, getMe);
router.post('/verify-password', protect, verifyPassword);
router.put('/change-password', protect, changePassword);
router.delete('/account', protect, deleteAccount);

// Preference routes
router.get('/preferences/notifications', protect, getNotificationPreferences);
router.put('/preferences/notifications', protect, updateNotificationPreferences);

router.get('/preferences/appearance', protect, getAppearancePreferences);
router.put('/preferences/appearance', protect, updateAppearancePreferences);

router.get('/preferences/privacy', protect, getPrivacyPreferences);
router.put('/preferences/privacy', protect, updatePrivacyPreferences);

export default router;