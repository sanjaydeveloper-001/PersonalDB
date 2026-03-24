import User from '../models/common/User.js';

/**
 * Search for public users by username
 * Only returns users who have enabled publicProfile in privacy settings
 */
export const searchPublicUsers = async (req, res) => {
  try {
    const { query } = req.query;

    // Validate query
    if (!query || query.trim().length < 1) {
      return res.status(400).json({ 
        message: 'Search query is required',
        users: [] 
      });
    }

    // Limit query length
    if (query.length > 50) {
      return res.status(400).json({ 
        message: 'Search query too long',
        users: [] 
      });
    }

    // Search users where:
    // 1. Username matches the query (case-insensitive)
    // 2. Public profile is ENABLED in privacy settings
    const users = await User.find(
      {
        username: { $regex: query, $options: 'i' }, // Case-insensitive search
        'preferences.privacy.publicProfile': true    // Only public profiles
      },
      { username: 1, _id: 1 } // Only return username and ID
    )
    .limit(10) // Limit results to 10
    .lean();

    // Return matched users
    res.json({
      success: true,
      count: users.length,
      users: users.map(u => ({
        _id: u._id,
        username: u.username
      }))
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      message: 'Search failed',
      error: error.message 
    });
  }
};

/**
 * Alternative: Get all public users (no search)
 */
export const getAllPublicUsers = async (req, res) => {
  try {
    const users = await User.find(
      { 'preferences.privacy.publicProfile': true },
      { username: 1, _id: 1 }
    )
    .limit(20)
    .lean();

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Error fetching public users:', error);
    res.status(500).json({ message: 'Failed to fetch public users' });
  }
};