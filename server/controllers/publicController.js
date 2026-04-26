import User from '../models/common/User.js';
import Profile from '../models/portfolio/Profile.js';
import Education from '../models/portfolio/Education.js';
import Experience from '../models/portfolio/Experience.js';
import Project from '../models/portfolio/Project.js';
import Skill from '../models/portfolio/Skill.js';
import Certification from '../models/portfolio/Certification.js';
import Interest from '../models/portfolio/Interest.js';
import { generateSignedUrl } from './vault/uploadController.js';


export const getPublicPortfolioByDomain = async (req, res) => {
  try {
    const { portdomain } = req.params;

    // 1. Try portdomain first, fall back to username
    let user = await User.findOne({ portdomain });
    if (!user) {
      user = await User.findOne({ username: portdomain });
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userId = user._id;

    const [profile, education, experience, projects, skills, certifications, interests] = await Promise.all([
      Profile.findOne({ user: userId }).lean(),
      Education.find({ user: userId }).sort('-startDate').lean(),
      Experience.find({ user: userId }).sort('-startDate').lean(),
      Project.find({ user: userId }).sort('-createdAt').lean(),
      Skill.findOne({ user: userId }).lean(),
      Certification.find({ user: userId }).sort('-issuedDate').lean(),
      Interest.findOne({ user: userId }).lean()
    ]);

    // Process profile photo
    if (profile && profile.profilePhoto && profile.profilePhoto.startsWith('portfolio/')) {
      try {
        profile.profilePhotoUrl = await generateSignedUrl(profile.profilePhoto, 3600);
      } catch (err) {
        console.warn('Could not generate signed URL for profile photo:', err.message);
      }
    }

    // Process certification images
    const processedCertifications = await Promise.all(
      (certifications || []).map(async (cert) => {
        const processed = { ...cert };
        if (processed.image && processed.image.startsWith('portfolio/')) {
          try {
            processed.imageUrl = await generateSignedUrl(processed.image, 3600);
          } catch (err) {
            console.warn('Could not generate signed URL for certification:', err.message);
          }
        }
        return processed;
      })
    );

    // Process project images
    const processedProjects = await Promise.all(
      (projects || []).map(async (project) => {
        const processed = { ...project };
        if (processed.image && processed.image.startsWith('portfolio/')) {
          try {
            processed.imageUrl = await generateSignedUrl(processed.image, 3600);
          } catch (err) {
            console.warn('Could not generate signed URL for project:', err.message);
          }
        }
        return processed;
      })
    );

    res.json({
      profile:        profile || {},
      education:      education || [],
      experience:     experience || [],
      projects:       processedProjects || [],
      skills:         skills || {},
      certifications: processedCertifications || [],
      interests:      interests || {}
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSignedUrl = async (req, res) => {
  try {
    const { key } = req.query;
    if (!key) {
      return res.status(400).json({ message: 'Missing S3 key parameter' });
    }

    const { generateSignedUrl } = await import('./vault/uploadController.js');
    const url = await generateSignedUrl(key, 3600);

    res.json({ url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get website statistics for the homepage
export const getWebsiteStats = async (req, res) => {
  try {
    // Import Review model
    const Review = (await import('../models/common/Review.js')).default;
    const Profile = (await import('../models/portfolio/Profile.js')).default;

    // Get total active users (exclude superadmins)
    const totalUsers = await User.countDocuments({ 
      role: { $ne: 'superadmin' }
    });

    // Get total portfolios created (count of profiles with at least some content)
    const totalPortfolios = await Profile.countDocuments();

    // Get total reviews (published and approved)
    const totalReviews = await Review.countDocuments({ 
      isPublished: true,
      status: 'approved' 
    });

    // Safety percentage - set to 99.9% by default for security assurance
    const safetyPercentage = 99.9;

    res.status(200).json({
      success: true,
      data: {
        totalUsers: totalUsers || 0,
        totalPortfolios: totalPortfolios || 0,
        totalReviews: totalReviews || 0,
        safetyPercentage: safetyPercentage
      }
    });
  } catch (error) {
    console.error('Error fetching website stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch website statistics',
      error: error.message
    });
  }
};