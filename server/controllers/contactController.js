/**
 * Contact Controller
 * Handles contact form submissions
 */

import { sendContactEmailAsync } from '../services/email/emailService.js';

// ── Send contact message ──────────────────────────────────────────────────────
export const sendContactMessage = async (req, res) => {
  try {
    const { username, email, issueType, message } = req.body;

    // Validate required fields
    if (!username || !email || !issueType || !message) {
      return res.status(400).json({
        message: 'All fields (username, email, issueType, message) are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate message length
    if (message.trim().length < 10) {
      return res.status(400).json({
        message: 'Message must be at least 10 characters long'
      });
    }

    // Send contact email asynchronously (fire-and-forget)
    sendContactEmailAsync(username, email, issueType, message);

    res.status(200).json({
      message: 'Your message has been sent successfully. We will get back to you soon.',
      success: true
    });
  } catch (error) {
    console.error('[Contact] Error:', error);
    res.status(500).json({
      message: 'Failed to send message. Please try again later.'
    });
  }
};
