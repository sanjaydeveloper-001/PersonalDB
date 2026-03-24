import api from './api';

const searchService = {
  // Search public users by username
  searchPublicUsers: async (query) => {
    try {
      const response = await api.get('/search/users', {
        params: { query }
      });
      return response.data.users || [];
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  },

  // Get all public users
  getAllPublicUsers: async () => {
    try {
      const response = await api.get('/search/users/all');
      return response.data.users || [];
    } catch (error) {
      console.error('Error fetching public users:', error);
      return [];
    }
  }
};

export default searchService;