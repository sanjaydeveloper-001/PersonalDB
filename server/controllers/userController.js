import User from '../models/common/User.js';

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    // Validate query parameter
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ 
        message: 'Search query (q) is required' 
      });
    }

    // Minimum 2 characters
    if (q.trim().length < 2) {
      return res.status(400).json({ 
        message: 'Search query must be at least 2 characters' 
      });
    }

    const searchTerm = q.trim();

    // Case-insensitive search with regex
    const users = await User.find(
      { username: { $regex: searchTerm, $options: 'i' } },
      { username: 1, _id: 1 } // Only return username and id
    )
      .limit(10) // Max 10 results
      .lean() // For better performance
      .exec();

    res.json({
      success: true,
      count: users.length,
      data: users.map(user => ({
        id: user._id,
        username: user.username
      }))
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      message: 'Error searching users',
      error: error.message 
    });
  }
};