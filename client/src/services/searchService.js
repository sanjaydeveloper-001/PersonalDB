import api from './api';

class SearchService {
  constructor() {
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  async searchUsers(query) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const cacheKey = query.toLowerCase();
    const cached = this.cache.get(cacheKey);

    // Return cached results if available and not expired
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }

    try {
      const response = await api.get('/users/search', {
        params: { q: query.trim() }
      });

      const data = response.data.data || [];

      // Cache the results
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

export default new SearchService();