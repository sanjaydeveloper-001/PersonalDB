import nodemailer from 'nodemailer';

// ── Setup nodemailer transporter ──────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify transporter configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('[Email] Transporter configuration error:', error.message);
  } else {
    console.log('[Email] Transporter ready');
  }
});

export default transporter;
