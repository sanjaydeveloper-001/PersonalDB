// ── Email Templates ──────────────────────────────────────────────────────────

/**
 * OTP Reset Email Template
 * @param {string} otp - 6-digit OTP
 * @returns {string} HTML email template
 */
export const otpEmailTemplate = (otp) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 12px;">
    <h2 style="color: #1e40af; margin-bottom: 8px;">Password Reset</h2>
    <p style="color: #475569;">Use the OTP below to reset your PersonalDB password. It is valid for <strong>10 minutes</strong>.</p>
    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px 32px; text-align: center; margin: 24px 0;">
      <span style="font-size: 2.5rem; font-weight: 700; letter-spacing: 0.3em; color: #1e40af;">${otp}</span>
    </div>
    <p style="color: #94a3b8; font-size: 0.85rem;">If you did not request this, please ignore this email. Your password will remain unchanged.</p>
  </div>
`;

/**
 * Welcome Email Template
 * @param {string} username - User's username
 * @returns {string} HTML email template
 */
export const welcomeEmailTemplate = (username) => `
  <div style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">
    
    <!-- Header Banner -->
    <div style="background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%); padding: 48px 32px; text-align: center; color: white;">
      <h1 style="margin: 0 0 12px 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">Welcome to PersonalDB!</h1>
      <p style="margin: 0; font-size: 16px; font-weight: 300; opacity: 0.95;">Your personal database for everything that matters</p>
    </div>

    <!-- Main Content -->
    <div style="padding: 48px 32px;">
      
      <!-- Greeting -->
      <div style="margin-bottom: 32px;">
        <p style="margin: 0 0 16px 0; font-size: 16px; color: #1f2937; line-height: 1.6;">
          Hi <strong style="color: #1e40af;">${username}</strong>,
        </p>
        <p style="margin: 0; font-size: 15px; color: #4b5563; line-height: 1.8;">
          We're thrilled you've decided to join PersonalDB! Your account is now active and ready to use. Whether you're organizing your professional portfolio, managing your personal vault, or sharing your achievements, we're here to help you every step of the way.
        </p>
      </div>

      <!-- Features Section -->
      <div style="background: #f8fafc; border-radius: 12px; padding: 28px; margin: 32px 0;">
        <h2 style="margin: 0 0 24px 0; font-size: 18px; font-weight: 600; color: #1f2937;">What You Can Do Now:</h2>
        
        <div style="display: block;">
          <!-- Feature 1 -->
          <div style="margin-bottom: 20px; display: flex; align-items: flex-start;">
            <div style="flex-shrink: 0; width: 32px; height: 32px; background: linear-gradient(135deg, #1e40af, #2563eb); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; margin-right: 16px; font-size: 18px;">📋</div>
            <div>
              <h3 style="margin: 0 0 4px 0; font-size: 15px; font-weight: 600; color: #1f2937;">Build Your Portfolio</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.6;">Create stunning portfolio pages with our professional templates and showcase your work to the world.</p>
            </div>
          </div>

          <!-- Feature 2 -->
          <div style="margin-bottom: 20px; display: flex; align-items: flex-start;">
            <div style="flex-shrink: 0; width: 32px; height: 32px; background: linear-gradient(135deg, #059669, #10b981); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; margin-right: 16px; font-size: 18px;">🔒</div>
            <div>
              <h3 style="margin: 0 0 4px 0; font-size: 15px; font-weight: 600; color: #1f2937;">Secure Vault</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.6;">Store and organize your important files, documents, and memories in a secure, encrypted environment.</p>
            </div>
          </div>

          <!-- Feature 3 -->
          <div style="display: flex; align-items: flex-start;">
            <div style="flex-shrink: 0; width: 32px; height: 32px; background: linear-gradient(135deg, #7c3aed, #a855f7); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; margin-right: 16px; font-size: 18px;">⚡</div>
            <div>
              <h3 style="margin: 0 0 4px 0; font-size: 15px; font-weight: 600; color: #1f2937;">Quick Start</h3>
              <p style="margin: 0; font-size: 14px; color: #6b7280; line-height: 1.6;">Get started in minutes with our intuitive interface designed for seamless user experience.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${process.env.CLIENT_URL1 || 'https://personaldb.josan.tech'}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #1e40af, #2563eb); color: white; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);">
          Go to Your Dashboard
        </a>
      </div>

      <!-- Next Steps -->
      <div style="background: #eff6ff; border-left: 4px solid #1e40af; padding: 20px; border-radius: 6px; margin: 32px 0;">
        <h3 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 600; color: #1e40af;">Next Steps:</h3>
        <ul style="margin: 0; padding: 0 0 0 20px; font-size: 14px; color: #1f2937; line-height: 2;">
          <li>Complete your profile with a profile picture</li>
          <li>Explore portfolio templates and choose your favorite</li>
          <li>Upload your first items to the vault</li>
          <li>Customize your preferences in settings</li>
        </ul>
      </div>

      <!-- Support -->
      <div style="margin: 32px 0 0 0; padding: 24px 0; border-top: 1px solid #e5e7eb; text-align: center;">
        <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280;">Questions? We're here to help!</p>
        <p style="margin: 0; font-size: 14px;">
          <a href="${process.env.CLIENT_URL1 || 'https://personaldb.josan.tech'}/contact" style="color: #1e40af; text-decoration: none; font-weight: 600;">Contact Support</a>
          &nbsp; • &nbsp;
          <a href="${process.env.CLIENT_URL1 || 'https://personaldb.josan.tech'}/docs" style="color: #1e40af; text-decoration: none; font-weight: 600;">View Documentation</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f3f4f6; padding: 28px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0 0 16px 0; font-size: 13px; color: #6b7280;">Follow us on social media</p>
      <div style="margin: 0 0 20px 0; text-align: center;">
        <a href="#" style="display: inline-block; margin: 0 8px; color: #1e40af; text-decoration: none; font-size: 20px;">𝕏</a>
        <a href="#" style="display: inline-block; margin: 0 8px; color: #1e40af; text-decoration: none; font-size: 20px;">f</a>
        <a href="#" style="display: inline-block; margin: 0 8px; color: #1e40af; text-decoration: none; font-size: 20px;">in</a>
        <a href="#" style="display: inline-block; margin: 0 8px; color: #1e40af; text-decoration: none; font-size: 20px;">📧</a>
      </div>
      <p style="margin: 16px 0 0 0; font-size: 12px; color: #9ca3af;">
        © 2026 PersonalDB. All rights reserved.<br>
        <a href="#" style="color: #6b7280; text-decoration: none;">Privacy Policy</a> &nbsp; • &nbsp;
        <a href="#" style="color: #6b7280; text-decoration: none;">Terms of Service</a>
      </p>
    </div>

  </div>
`;

/**
 * Email Verification Template
 * @param {string} username - User's username
 * @param {string} verificationLink - Email verification link
 * @returns {string} HTML email template
 */
export const verificationEmailTemplate = (username, verificationLink) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 12px;">
    <h2 style="color: #1e40af; margin-bottom: 8px;">Verify Your Email</h2>
    <p style="color: #475569;">Hi ${username},</p>
    <p style="color: #475569;">Please verify your email address to complete your PersonalDB account setup.</p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${verificationLink}" style="background: #1e40af; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Verify Email</a>
    </div>
    <p style="color: #94a3b8; font-size: 0.85rem;">Or copy and paste this link: <br><span style="word-break: break-all;">${verificationLink}</span></p>
    <p style="color: #94a3b8; font-size: 0.85rem;">This link will expire in 24 hours.</p>
  </div>
`;

/**
 * Account Deleted Confirmation Template
 * @param {string} username - User's username
 * @returns {string} HTML email template
 */
export const accountDeletedTemplate = (username) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 12px;">
    <h2 style="color: #dc2626; margin-bottom: 8px;">Account Deletion Confirmation</h2>
    <p style="color: #475569;">Hi ${username},</p>
    <p style="color: #475569;">Your PersonalDB account has been successfully deleted.</p>
    <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 24px 0;">
      <p style="color: #7f1d1d; margin: 0;">All your data has been permanently removed from our servers.</p>
    </div>
    <p style="color: #475569;">If you didn't request this deletion or have any concerns, please contact our support team immediately.</p>
    <p style="color: #94a3b8; font-size: 0.85rem;">The PersonalDB Team</p>
  </div>
`;

/**
 * Password Changed Confirmation Template
 * @param {string} username - User's username
 * @returns {string} HTML email template
 */
export const passwordChangedTemplate = (username) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 32px; border: 1px solid #e2e8f0; border-radius: 12px;">
    <h2 style="color: #1e40af; margin-bottom: 8px;">Password Changed</h2>
    <p style="color: #475569;">Hi ${username},</p>
    <p style="color: #475569;">Your PersonalDB password was successfully changed.</p>
    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 16px; margin: 24px 0;">
      <p style="color: #1e40af; margin: 0;">If this wasn't you, please <a href="#" style="color: #1e40af; font-weight: bold;">reset your password immediately</a>.</p>
    </div>
    <p style="color: #94a3b8; font-size: 0.85rem;">The PersonalDB Team</p>
  </div>
`;

/**
 * Contact Form Template
 * Notification sent to admin about contact form submission
 * @param {string} username - User's username
 * @param {string} email - User's email
 * @param {string} issueType - Type of issue
 * @param {string} message - User's message
 * @returns {string} HTML email template
 */
export const contactFormTemplate = (username, email, issueType, message) => `
  <div style="font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%); padding: 32px; color: white;">
      <h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700;">New Contact Form Submission</h2>
      <p style="margin: 0; opacity: 0.9;">PersonalDB Support</p>
    </div>

    <!-- Content -->
    <div style="padding: 32px; background: #ffffff;">
      
      <!-- User Info -->
      <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin-bottom: 24px; border-left: 4px solid #1e40af;">
        <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: #1f2937;">User Information</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; width: 100px; font-weight: 600; color: #6b7280;">Username:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;"><strong>${username}</strong></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #6b7280;">Email:</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; color: #1f2937;">
              <a href="mailto:${email}" style="color: #1e40af; text-decoration: none;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Issue Type:</td>
            <td style="padding: 8px 0; color: #1f2937;">
              <span style="background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 4px; font-weight: 600; display: inline-block;">
                ${issueType.charAt(0).toUpperCase() + issueType.slice(1)}
              </span>
            </td>
          </tr>
        </table>
      </div>

      <!-- Message -->
      <div>
        <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: #1f2937;">Message</h3>
        <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e5e7eb; color: #4b5563; line-height: 1.8; white-space: pre-wrap; word-wrap: break-word;">
${message}
        </div>
      </div>

      <!-- Action -->
      <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0 0 12px 0; color: #6b7280; font-size: 14px;">Please respond to this message promptly to assist the user.</p>
        <a href="mailto:${email}" style="display: inline-block; background: #1e40af; color: white; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">Reply to User</a>
      </div>

    </div>

    <!-- Footer -->
    <div style="background: #f3f4f6; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="margin: 0; font-size: 12px; color: #9ca3af;">
        This is an automated notification from PersonalDB Contact Form. Please do not reply to this email.
      </p>
    </div>

  </div>
`;

// Note: Login alert template removed per user request - only welcome emails are sent now
// If needed in the future, can be restored from git history or by keeping the template code
