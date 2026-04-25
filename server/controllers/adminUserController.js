import User from '../models/common/User.js';
import Review from '../models/common/Review.js';
import Resume from '../models/vault/Resume.js';
import Item from '../models/vault/Item.js';
import Profile from '../models/portfolio/Profile.js';
import Experience from '../models/portfolio/Experience.js';
import Education from '../models/portfolio/Education.js';
import Certification from '../models/portfolio/Certification.js';
import Skill from '../models/portfolio/Skill.js';
import Project from '../models/portfolio/Project.js';
import Interest from '../models/portfolio/Interest.js';
import { generateSignedUrl } from './vault/uploadController.js';

// Get all users with stats
export const getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .lean();

    // Sort: admins/superadmins first, then regular users, each group by creation date descending
    users.sort((a, b) => {
      const aIsAdmin = a.role === 'admin' || a.role === 'superadmin' ? 0 : 1;
      const bIsAdmin = b.role === 'admin' || b.role === 'superadmin' ? 0 : 1;
      
      if (aIsAdmin !== bIsAdmin) {
        return aIsAdmin - bIsAdmin; // Admins first (0 before 1)
      }
      
      // Within same role group, sort by creation date descending
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

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

// Delete user with cascade delete of all related data
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

    // Verify user exists before cascading delete
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Cascade delete: Portfolio DB
    await Promise.all([
      Review.deleteMany({ userId }),
      Profile.deleteOne({ user: userId }),
      Experience.deleteMany({ user: userId }),
      Education.deleteMany({ user: userId }),
      Certification.deleteMany({ user: userId }),
      Skill.deleteOne({ user: userId }),
      Project.deleteMany({ user: userId }),
      Interest.deleteOne({ user: userId }),
    ]);

    // Cascade delete: Vault DB
    await Promise.all([
      Resume.deleteMany({ user: userId }),
      Item.deleteMany({ user: userId }),
    ]);

    // Finally delete the user
    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'User and all associated data deleted successfully',
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