import api from './api';

export const apiService = {
  // Get all API keys for the user
  getKeys: () => api.get('/keys'),

  // Generate a new API key
  generateKey: (name) => api.post('/keys', { name }),

  // Revoke an API key
  revokeKey: (id) => api.delete(`/keys/${id}`),

  // Get API usage statistics
  getUsageStats: () => api.get('/keys/usage/stats'),
};
