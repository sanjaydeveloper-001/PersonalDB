import api from './api'

export const authService = {
  // Authentication endpoints - extract .data from response
  login: async (data) => {
    const response = await api.post('/auth/login', data)
    return response.data
  },
  
  register: async (data) => {
    const response = await api.post('/auth/register', data)
    return response.data
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },
  
  // Settings endpoints
  verifyPassword: async (password) => {
    const response = await api.post('/auth/verify-password', { password })
    return response.data
  },
  
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/change-password', { currentPassword, newPassword })
    return response.data
  },
  
  deleteAccount: async (password) => {
    const response = await api.delete('/auth/account', { data: { password } })
    return response.data
  },
  
  // Notification preferences
  getNotificationPreferences: async () => {
    const response = await api.get('/auth/preferences/notifications')
    return response.data
  },
  
  updateNotificationPreferences: async (prefs) => {
    const response = await api.put('/auth/preferences/notifications', prefs)
    return response.data
  },
  
  // Appearance preferences
  getAppearancePreferences: async () => {
    const response = await api.get('/auth/preferences/appearance')
    return response.data
  },
  
  updateAppearancePreferences: async (prefs) => {
    const response = await api.put('/auth/preferences/appearance', prefs)
    return response.data
  },
  
  // Privacy preferences
  getPrivacyPreferences: async () => {
    const response = await api.get('/auth/preferences/privacy')
    return response.data
  },
  
  updatePrivacyPreferences: async (prefs) => {
    const response = await api.put('/auth/preferences/privacy', prefs)
    return response.data
  },
}