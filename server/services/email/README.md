# Email Service

Centralized email handling system for PersonalDB. All email sending functionality is extracted from controllers and organized in a modular, maintainable structure.

## Structure

```
server/services/email/
├── transporter.js        # Nodemailer SMTP configuration
├── templates.js          # HTML email templates
├── emailService.js       # Email sending functions
└── README.md            # This file
```

## Files

### `transporter.js`
Initializes and exports the nodemailer transporter with SMTP configuration.
- Reads environment variables: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- Auto-verifies configuration on startup

### `templates.js`
Contains HTML email templates as functions.
- `otpEmailTemplate(otp)` - Password reset OTP
- `welcomeEmailTemplate(username)` - Welcome email for new users
- `verificationEmailTemplate(username, link)` - Email verification
- `accountDeletedTemplate(username)` - Account deletion confirmation
- `passwordChangedTemplate(username)` - Password change notification
- `loginAlertTemplate(username, deviceInfo, ipAddress)` - Login security alert

### `emailService.js`
Main email service with exported functions:

#### Email Sending Functions
- `sendOtpEmail(email, otp)` - Send OTP for password reset
- `sendWelcomeEmail(email, username)` - Send welcome email
- `sendVerificationEmail(email, username, verificationLink)` - Send email verification
- `sendAccountDeletedEmail(email, username)` - Send deletion confirmation
- `sendPasswordChangedEmail(email, username)` - Send password change alert
- `sendLoginAlertEmail(email, username, deviceInfo, ipAddress)` - Send login alert

#### Helper Functions
- `generateAndSendOtp(user, email)` - Generate OTP, save to DB, and send email
- `verifyOtpAndGetToken(user, otp, generateToken)` - Verify OTP and return reset token

## Usage in Controllers

### Example: Sending Welcome Email
```javascript
import { sendWelcomeEmail } from '../../services/email/emailService.js';

// In your controller
if (email) {
  try {
    await sendWelcomeEmail(email, username);
  } catch (emailError) {
    console.warn('Email failed:', emailError.message);
  }
}
```

### Example: OTP Flow
```javascript
import { 
  generateAndSendOtp, 
  verifyOtpAndGetToken 
} from '../../services/email/emailService.js';

// Send OTP
const user = await User.findOne({ email });
await generateAndSendOtp(user, email);

// Verify OTP
const result = await verifyOtpAndGetToken(user, otp, generateToken);
const resetToken = result.resetToken;
```

## Environment Variables Required

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NODE_ENV=production|development
```

## Error Handling

All email functions are wrapped with try-catch. Email failures don't block user operations:
- Failed emails are logged with `[Email]` prefix
- Controllers catch email errors and log them as warnings
- User operations complete successfully even if email fails

## Adding New Email Types

1. **Add template in `templates.js`:**
   ```javascript
   export const myNewEmailTemplate = (param1, param2) => `
     <div>Your HTML here</div>
   `;
   ```

2. **Add function in `emailService.js`:**
   ```javascript
   export const sendMyNewEmail = async (email, param1, param2) => {
     return sendEmail(email, 'Subject', myNewEmailTemplate(param1, param2));
   };
   ```

3. **Use in controller:**
   ```javascript
   import { sendMyNewEmail } from '../../services/email/emailService.js';
   await sendMyNewEmail(userEmail, param1, param2);
   ```

## Best Practices

- Always wrap email calls in try-catch in controllers
- Use email gracefully - don't block operations on email failure
- Log email errors for debugging
- Test email configuration before deployment
- Use appropriate email subjects
- Keep templates responsive and simple
