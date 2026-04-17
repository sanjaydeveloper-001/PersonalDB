# ════════════════════════════════════════════════════════════════════════════════
# GOOGLE OAUTH WITH PASSPORT.JS - MERN SETUP GUIDE
# ════════════════════════════════════════════════════════════════════════════════

## 1. GOOGLE CLOUD CONSOLE SETUP

Follow these steps to get your Google OAuth credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **Web Application**
6. Under **Authorized redirect URIs**, add:
   - For development: `http://localhost:5000/auth/oauth/google/callback`
   - For production: `https://yourdomain.com/auth/oauth/google/callback`
7. Copy the **Client ID** and **Client Secret**

---

## 2. ENVIRONMENT VARIABLES (.env)

Add these to your `.env` file in the server directory:

```env
# ── Google OAuth ────────────────────────────────────────────────────
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
SESSION_SECRET=your_random_session_secret_change_in_production

# ── Existing variables ───────────────────────────────────────────────
MONGO_URI=mongodb://localhost:27017/personaldb
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
PORT=5000
```

### 🔒 Security Tips:
- Never commit `.env` to Git
- Use strong random strings for `SESSION_SECRET`
- Rotate secrets periodically
- Use different secrets for dev/production

---

## 3. FILE CHANGES MADE

### Backend (Server) Changes:

#### ✅ New Files Created:
- `server/config/passport.js` - Passport Google OAuth strategy
- `server/routes/oauth.js` - Google OAuth routes

#### ✅ Modified Files:
- `server/server.js` - Added passport & session middleware
- `server/models/common/User.js` - Added Google OAuth fields:
  - `googleId` - Unique Google account ID
  - `googleEmail` - Email from Google
  - `googleAvatar` - Avatar URL from Google
  - `authProvider` - Either 'local' or 'google'
  - Made `password` optional (nullable)

#### ✅ Installed Packages:
```bash
npm install passport passport-google-oauth20 express-session connect-mongo
```

---

### Frontend (Client) Changes:

#### ✅ New Files Created:
- `client/src/components/common/GoogleLoginButton.jsx` - Google login button component
- `client/src/pages/auth/OAuthSuccess.jsx` - OAuth callback success page

#### ✅ Modified Files:
- `client/src/services/authService.js` - Added OAuth methods:
  - `googleLogin()` - Redirects to Google OAuth
  - `googleLogout()` - OAuth logout
  - `getOAuthUser()` - Get current OAuth user

---

## 4. HOW IT WORKS

### Flow Diagram:
```
┌─────────┐
│  React  │
│ Client  │
└────┬────┘
     │ 1. User clicks "Login with Google"
     │ authService.googleLogin()
     ▼
┌─────────────────────────────────────────────┐
│   Backend: /auth/oauth/google               │
│   passport.authenticate('google', ...)      │
└────┬────────────────────────────────────────┘
     │ 2. Redirects to Google Login
     ▼
┌──────────────────────┐
│  Google OAuth Page   │
│  User logs in        │
└────┬─────────────────┘
     │ 3. Google redirects back with auth code
     │    to /auth/oauth/google/callback
     ▼
┌──────────────────────────────────────────────┐
│  Backend: Verify code, find/create user     │
│  Create session                              │
│  Generate JWT token                          │
└────┬─────────────────────────────────────────┘
     │ 4. Redirect to frontend with token & user
     │    /auth/success?token=...&user=...
     ▼
┌──────────────────────────────────────┐
│  React: OAuthSuccess page            │
│  Store token in localStorage         │
│  Redirect to /dashboard              │
└──────────────────────────────────────┘
```

---

## 5. AUTHENTICATION METHODS

Your app now supports **two** authentication methods:

### Local Authentication (JWT):
```javascript
// Login with username/password
const user = await authService.login({ username, password })
```

### Google OAuth (Session + JWT):
```javascript
// Login with Google
authService.googleLogin() // Redirects to OAuth flow

// Get current OAuth user
const user = await authService.getOAuthUser()

// Logout
await authService.googleLogout()
```

---

## 6. UPDATING LOGIN PAGE

Add the Google login button to your Login component:

```jsx
import GoogleLoginButton from '../components/common/GoogleLoginButton'

export default function Login() {
  return (
    <div>
      {/* Your existing login form */}
      <form>...</form>
      
      {/* Add separator */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      {/* Google login button */}
      <GoogleLoginButton 
        text="Sign in with Google"
        className="w-full"
      />
    </div>
  )
}
```

---

## 7. PROTECTING ROUTES

Routes are protected by checking for JWT token + session:

```javascript
// Existing protected routes (JWT):
import { protect } from '../middleware/auth.js'
router.get('/protected', protect, (req, res) => { ... })

// OAuth routes are session-based:
router.get('/auth/oauth/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user)
  }
})
```

---

## 8. COMMON ISSUES & SOLUTIONS

| Issue | Solution |
|-------|----------|
| Callback URL mismatch | Ensure exact match in Google Console |
| Session not persisting | Check `MONGO_URI` is correct |
| `req.user` undefined | Verify `serializeUser/deserializeUser` in passport.js |
| CORS errors | Ensure `credentials: true` in fetch requests |
| Token not working | Check JWT_SECRET is set in .env |
| Cookies not sent | Use `credentials: 'include'` in all API calls |

---

## 9. NEXT STEPS

1. ✅ Get Google OAuth credentials (see step 1)
2. ✅ Add environment variables to `.env`
3. ✅ Restart the server: `npm run dev`
4. ✅ Add GoogleLoginButton to your Login page
5. ✅ Test OAuth flow: Click "Login with Google"
6. ✅ Verify user is created in MongoDB
7. ✅ Check JWT token is stored in localStorage

---

## 10. PRODUCTION DEPLOYMENT

Before going live:

- [ ] Change `SESSION_SECRET` to a strong random string
- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Set `secure: true` for cookies (HTTPS only)
- [ ] Update Google Console with production callback URL
- [ ] Use environment variables (never hardcode secrets)
- [ ] Enable HTTPS on your domain
- [ ] Test OAuth flow in production

---

## Troubleshooting

**Q: User logs in but `req.user` is undefined?**
A: Make sure `passport.initialize()` and `passport.session()` are called AFTER `app.use(session())`

**Q: Session expires immediately?**
A: Check `MONGO_URI` is correct and MongoDB is running

**Q: "Callback URL mismatch" error?**
A: Make sure the redirect URI in Google Console matches exactly (including protocol and port)

**Q: Can't link existing account to Google?**
A: The system auto-links if email matches. Otherwise, a new account is created.

---

For more help, check the guide at the top of this file!
