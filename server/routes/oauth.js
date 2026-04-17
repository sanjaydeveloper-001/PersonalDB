import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmailAsync } from '../services/email/emailService.js';

const router = express.Router();

// ────────────────────────────────────────────────────────────────────────────
// GOOGLE OAUTH ROUTES
// ────────────────────────────────────────────────────────────────────────────

/**
 * Step 1: Redirect to Google login
 * GET /auth/google
 */
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

/**
 * Step 2: Google redirects back with auth code
 * GET /auth/google/callback
 * Passport verifies the code and creates/finds the user
 */
router.get('/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${process.env.CLIENT_URL1}/login?error=google_auth_failed`,
    session: false, // ✅ Disable session — we use JWT only
  }),
  (req, res) => {
    // ✅ Generate JWT — same as your generateToken() function
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // ✅ Set cookie — exactly like your cookieOptions()
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    // Send welcome email asynchronously if new user (non-blocking)
    if (req.user._isNewUser && req.user.email) {
      sendWelcomeEmailAsync(req.user.email, req.user.username);
    }

    // ✅ Redirect to frontend — no token in URL
    res.redirect(`${process.env.CLIENT_URL1}/dashboard`);
  }
);

/**
 * Get current authenticated user
 * GET /auth/google/me
 */
router.get('/google/me', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      profileImage: req.user.profileImage,
      authProvider: req.user.authProvider,
    });
  }
  res.status(401).json({ message: 'Not authenticated' });
});

/**
 * Logout
 * GET /auth/google/logout
 */
router.get('/google/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully', redirectUrl: process.env.CLIENT_URL1 });
  });
});

export default router;
