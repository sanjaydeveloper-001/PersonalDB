import api from './api'

export const authService = {
  // ── Authentication ──────────────────────────────────────────────────────────
  login: async ({ username, password }) => {
    const { data } = await api.post('/auth/login', { username, password })
    return data
  },

  verify2FALogin: async ({ otp, backupCode }) => {
    const { data } = await api.post('/auth/login/2fa', { otp, backupCode })
    return data
  },

  register: async ({ username, password, birthYear, email }) => {
    const { data } = await api.post('/auth/register', { username, password, birthYear, email })
    return data
  },

  logout: async () => {
    const { data } = await api.post('/auth/logout')
    return data
  },

  getMe: async () => {
    const { data } = await api.get('/auth/me')
    return data
  },

  // ── Google OAuth ────────────────────────────────────────────────────────────
  googleLogin: () => {
    // Redirect to backend Google OAuth endpoint
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    window.location.href = `${baseUrl}/auth/google`
  },

  googleLogout: async () => {
    const { data } = await api.get('/auth/google/logout', { withCredentials: true })
    return data
  },

  getOAuthUser: async () => {
    try {
      const { data } = await api.get('/auth/google/me', { withCredentials: true })
      return data
    } catch {
      return null
    }
  },

  // ── OTP-based password reset ────────────────────────────────────────────────
  sendOtp: async (email) => {
    const { data } = await api.post('/auth/forgot-password/send-otp', { email })
    return data
  },

  verifyOtp: async (email, otp) => {
    const { data } = await api.post('/auth/forgot-password/verify-otp', { email, otp })
    // data.resetToken — store in memory, pass to resetPassword
    return data
  },

  resetPassword: async (newPassword, resetToken) => {
    const { data } = await api.post(
      '/auth/forgot-password/reset',
      { newPassword },
      { headers: { Authorization: `Bearer ${resetToken}` } }
    )
    return data
  },

  // ── Account settings ────────────────────────────────────────────────────────
  verifyPassword: async (password) => {
    const { data } = await api.post('/auth/verify-password', { password })
    return data
  },

  changePassword: async (currentPassword, newPassword) => {
    const { data } = await api.put('/auth/change-password', { currentPassword, newPassword })
    return data
  },

  deleteAccount: async (password) => {
    const { data } = await api.delete('/auth/account', { data: { password } })
    return data
  },

  // ── Notification preferences ────────────────────────────────────────────────
  getNotificationPreferences: async () => {
    const { data } = await api.get('/auth/preferences/notifications')
    return data
  },

  updateNotificationPreferences: async (prefs) => {
    const { data } = await api.put('/auth/preferences/notifications', prefs)
    return data
  },

  // ── Appearance preferences ──────────────────────────────────────────────────
  getAppearancePreferences: async () => {
    const { data } = await api.get('/auth/preferences/appearance')
    return data
  },

  updateAppearancePreferences: async (prefs) => {
    const { data } = await api.put('/auth/preferences/appearance', prefs)
    return data
  },

  // ── Privacy preferences ─────────────────────────────────────────────────────
  getPrivacyPreferences: async () => {
    const { data } = await api.get('/auth/preferences/privacy')
    return data
  },

  updatePrivacyPreferences: async (prefs) => {
    const { data } = await api.put('/auth/preferences/privacy', prefs)
    return data
  },
}