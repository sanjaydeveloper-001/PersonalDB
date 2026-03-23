const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const publicService = {
  getPortfolio: async (username) => {
    const response = await fetch(`${API_BASE_URL}/port/${username}`);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('User not found');
      }
      throw new Error('Failed to fetch portfolio');
    }
    return response.json();
  },

  getSignedUrl: async (key) => {
    const response = await fetch(`${API_BASE_URL}/util/signed-url?key=${encodeURIComponent(key)}`);
    if (!response.ok) throw new Error('Failed to get signed URL');
    const data = await response.json();
    return data.url;
  },
};
