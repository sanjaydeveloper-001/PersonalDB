import api from './api';

export const twoFactorService = {
  /**
   * Generate 2FA setup (get QR code and backup codes)
   */
  async generate() {
    const { data } = await api.post('/auth/2fa/generate');
    return data;
  },

  /**
   * Verify 2FA setup with 6-digit code
   */
  async verifySetup(token) {
    const { data } = await api.post('/auth/2fa/verify-setup', { token });
    return data;
  },

  /**
   * Disable 2FA (requires password)
   */
  async disable(password) {
    const { data } = await api.delete('/auth/2fa/disable', {
      data: { password },
    });
    return data;
  },

  /**
   * Get 2FA status
   */
  async getStatus() {
    const { data } = await api.get('/auth/2fa/status');
    return data;
  },

  /**
   * Request 2FA disable via email
   */
  async requestDisableEmail() {
    const { data } = await api.post('/auth/2fa/disable-request-email');
    return data;
  },

  /**
   * Verify 2FA disable token
   */
  async verifyDisableToken(token) {
    const { data } = await api.post('/auth/2fa/verify-disable-token', { token });
    return data;
  },
};
