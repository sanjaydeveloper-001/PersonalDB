import api from './api'
export const userService = {
  // ─── Profile ───────────────────────────────────────────────
  /**
   * GET /users/me
   * Returns the current user's full profile.
   */
  getProfile: async () => {
    const response = await api.get('/users/me')
    return response.data
  },

  /**
   * PUT /users/me/username
   * Change the user's username.
   * @param {string} username
   */
  updateUsername: async (username) => {
    const response = await api.put('/users/me/username', { username })
    return response.data
  },

  /**
   * PUT /users/me/email
   * Add or update email address.
   * @param {string} email
   */
  updateEmail: async (email) => {
    const response = await api.put('/users/me/email', { email })
    return response.data
  },

  /**
   * POST /users/me/avatar
   * Upload a new profile image (multipart/form-data).
   * @param {FormData} formData  — must contain field "avatar"
   */
  uploadAvatar: async (formData) => {
    const response = await api.post('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  },

  /**
   * DELETE /users/me/avatar
   * Remove the current profile image (resets to default).
   */
  removeAvatar: async () => {
    const response = await api.delete('/users/me/avatar')
    return response.data
  },

  // ─── Domain ────────────────────────────────────────────────
  /**
   * GET /users/domains
   * Returns all taken portdomain values so the client can
   * validate availability before hitting the save endpoint.
   * Response: { success: true, domains: string[] }
   */
  getAllDomains: async () => {
    const response = await api.get('/users/domains')
    return response.data
  },

  /**
   * PUT /users/me/domain
   * Claim or update the user's custom subdomain.
   * Server performs a second uniqueness check to prevent race conditions.
   * @param {string} subdomain  — just the prefix, e.g. "sanjay" (not "sanjay.josan.tech")
   */
  updateDomain: async (subdomain) => {
    const response = await api.put('/users/me/domain', { subdomain })
    return response.data
  },
}