import User from '../models/common/User.js';

/**
 * Admin Only Middleware
 * Checks if the authenticated user has admin privileges
 * Must be used after the protect middleware
 */
export const adminOnly = async (req, res, next) => {
  try {
    // Ensure protect middleware ran first (req.user should exist)
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized. Please login first.' 
      });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin privileges required.' 
      });
    }

    // User is admin, proceed to next middleware/route
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

/**
 * Super Admin Only Middleware
 * More restrictive - only superadmin role allowed
 */
export const superAdminOnly = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized. Please login first.' 
      });
    }

    if (req.user.role !== 'superadmin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Super admin privileges required.' 
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

/**
 * Admin or Owner Middleware
 * Allows admin OR the user who owns the resource
 */
export const adminOrOwner = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized. Please login first.' 
      });
    }

    // Get resource owner ID from params
    const ownerId = req.params.userId;
    const isAdmin = req.user.role === 'admin' || req.user.role === 'superadmin';
    const isOwner = req.user._id.toString() === ownerId;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. You can only modify your own resources.' 
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

/**
 * Check Role Middleware
 * Allows specifying multiple allowed roles
 */
export const checkRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false,
          message: 'Not authorized. Please login first.' 
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ 
          success: false,
          message: `Access denied. Required role(s): ${allowedRoles.join(', ')}` 
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  };
};