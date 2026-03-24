import User from '../models/common/User.js';

// Escape special regex characters to prevent ReDoS
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: 'Query must be at least 2 characters.' });
    }

    const query = escapeRegex(q.trim().slice(0, 50));

    const users = await User.find(
      { username: { $regex: query, $options: 'i' } },
      { username: 1, _id: 0 }
    ).limit(10);

    res.json({ users: users.map(u => ({ username: u.username })) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
