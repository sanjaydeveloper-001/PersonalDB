import User from '../models/common/User.js';
import { generateSignedUrl } from './vault/uploadController.js';

// Get all users with stats
export const getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    // Generate signed URLs for profile images
    for (let user of users) {
      if (user.profileImage?.startsWith('avatars/')) {
        try {
          user.profileImage = await generateSignedUrl(user.profileImage, 3600);
        } catch (err) {
          console.warn('[getAllUsersAdmin] Could not generate signed URL:', err.message);
        }
      }
    }

    const stats = {
      total: users.length,
      admins: users.filter(u => u.role === 'admin' || u.role === 'superadmin').length,
      regularUsers: users.filter(u => u.role === 'user').length,
      activeToday: Math.floor(users.length * 0.4), // Placeholder
    };

    res.json({
      success: true,
      stats,
      users,
    });
  } catch (error) {
    console.error('getAllUsersAdmin error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get single user details
export const getUserAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('-password')
      .populate('selectedTemplateId', 'name image');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Generate signed URL if user has a profile image
    if (user.profileImage?.startsWith('avatars/')) {
      try {
        user.profileImage = await generateSignedUrl(user.profileImage, 3600);
      } catch (err) {
        console.warn('[getUserAdmin] Could not generate signed URL:', err.message);
      }
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('getUserAdmin error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Update user role
export const updateUserRoleAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin', 'superadmin'].includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid role' 
      });
    }

    // Prevent removing own admin status
    if (userId === req.user._id.toString() && role === 'user') {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot downgrade your own role' 
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Generate signed URL if user has a profile image
    if (user.profileImage?.startsWith('avatars/')) {
      try {
        user.profileImage = await generateSignedUrl(user.profileImage, 3600);
      } catch (err) {
        console.warn('[updateUserRoleAdmin] Could not generate signed URL:', err.message);
      }
    }

    res.json({
      success: true,
      message: 'User role updated',
      user,
    });
  } catch (error) {
    console.error('updateUserRoleAdmin error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Delete user
export const deleteUserAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent self-deletion
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete your own account' 
      });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('deleteUserAdmin error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get user by email (search)
export const searchUserAdmin = async (req, res) => {
  try {
    const { email, username } = req.query;

    if (!email && !username) {
      return res.status(400).json({ 
        success: false, 
        message: 'Provide email or username to search' 
      });
    }

    const query = {};
    if (email) query.email = new RegExp(email, 'i');
    if (username) query.username = new RegExp(username, 'i');

    const users = await User.find(query)
      .select('-password')
      .limit(10);

    // Generate signed URLs for profile images
    for (let user of users) {
      if (user.profileImage?.startsWith('avatars/')) {
        try {
          user.profileImage = await generateSignedUrl(user.profileImage, 3600);
        } catch (err) {
          console.warn('[searchUserAdmin] Could not generate signed URL:', err.message);
        }
      }
    }

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('searchUserAdmin error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};