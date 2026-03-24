import User from '../models/common/User.js';
import Profile from '../models/portfolio/Profile.js';
import Education from '../models/portfolio/Education.js';
import Experience from '../models/portfolio/Experience.js';
import Project from '../models/portfolio/Project.js';
import Skill from '../models/portfolio/Skill.js';
import Certification from '../models/portfolio/Certification.js';
import Interest from '../models/portfolio/Interest.js';
import { generateSignedUrl } from './vault/uploadController.js';

/**
 * Get authenticated user's complete portfolio (for API key)
 * GET /api/portfolio
 * Headers: Authorization: Bearer YOUR_API_KEY
 */
export const getAuthenticatedPortfolio = async (req, res) => {
  try {
    console.log('📌 Fetching portfolio for user:', req.user._id);
    
    const userId = req.user._id;
    
    // Query all portfolio data in parallel
    const [profile, education, experience, projects, skills, certifications, interests] = await Promise.all([
      Profile.findOne({ user: userId }).lean(),
      Education.find({ user: userId }).sort('-createdAt').lean(),
      Experience.find({ user: userId }).sort('-createdAt').lean(),
      Project.find({ user: userId }).sort('-createdAt').lean(),
      Skill.findOne({ user: userId }).lean(),
      Certification.find({ user: userId }).sort('-createdAt').lean(),
      Interest.findOne({ user: userId }).lean()
    ]);

    // Generate signed URLs for images if they exist
    const processedProfile = profile ? { ...profile } : {};
    if (processedProfile.profilePhoto) {
      try {
        processedProfile.profilePhotoUrl = await generateSignedUrl(processedProfile.profilePhoto, 3600);
      } catch (err) {
        console.warn('Could not generate signed URL for profile photo:', err.message);
      }
    }

    // Process certifications with signed URLs
    const processedCertifications = await Promise.all(
      (certifications || []).map(async (cert) => {
        const processed = { ...cert };
        if (processed.image) {
          try {
            processed.imageUrl = await generateSignedUrl(processed.image, 3600);
          } catch (err) {
            console.warn('Could not generate signed URL for certification:', err.message);
          }
        }
        return processed;
      })
    );

    // Process projects with signed URLs
    const processedProjects = await Promise.all(
      (projects || []).map(async (project) => {
        const processed = { ...project };
        if (processed.image) {
          try {
            processed.imageUrl = await generateSignedUrl(processed.image, 3600);
          } catch (err) {
            console.warn('Could not generate signed URL for project:', err.message);
          }
        }
        return processed;
      })
    );

    const portfolioData = {
      user: {
        _id: req.user._id,
        username: req.user.username,
      },
      profile: processedProfile || {},
      education: education || [],
      experience: experience || [],
      projects: processedProjects || [],
      skills: skills || { skills: [] },
      certifications: processedCertifications || [],
      interests: interests || { interests: [] },
    };

    console.log('✅ Portfolio fetched successfully');
    res.json(portfolioData);
  } catch (error) {
    console.error('❌ Error fetching portfolio:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get specific section of portfolio (for API key)
 * GET /api/portfolio/:section
 * Sections: profile, skills, projects, education, experience, certifications, interests
 */
export const getPortfolioSection = async (req, res) => {
  try {
    const { section } = req.params;
    const userId = req.user._id;

    console.log(`📌 Fetching ${section} for user:`, userId);

    let data;
    
    switch (section.toLowerCase()) {
      case 'profile':
        data = await Profile.findOne({ user: userId }).lean();
        if (data?.profilePhoto) {
          try {
            data.profilePhotoUrl = await generateSignedUrl(data.profilePhoto, 3600);
          } catch (err) {
            console.warn('Could not generate signed URL:', err.message);
          }
        }
        break;

      case 'education':
        data = await Education.find({ user: userId }).sort('-createdAt').lean();
        break;

      case 'experience':
        data = await Experience.find({ user: userId }).sort('-createdAt').lean();
        break;

      case 'projects':
        data = await Project.find({ user: userId }).sort('-createdAt').lean();
        data = await Promise.all(
          (data || []).map(async (project) => {
            if (project.image) {
              try {
                project.imageUrl = await generateSignedUrl(project.image, 3600);
              } catch (err) {
                console.warn('Could not generate signed URL:', err.message);
              }
            }
            return project;
          })
        );
        break;

      case 'skills':
        data = await Skill.findOne({ user: userId }).lean();
        break;

      case 'certifications':
        data = await Certification.find({ user: userId }).sort('-createdAt').lean();
        data = await Promise.all(
          (data || []).map(async (cert) => {
            if (cert.image) {
              try {
                cert.imageUrl = await generateSignedUrl(cert.image, 3600);
              } catch (err) {
                console.warn('Could not generate signed URL:', err.message);
              }
            }
            return cert;
          })
        );
        break;

      case 'interests':
        data = await Interest.findOne({ user: userId }).lean();
        break;

      default:
        return res.status(400).json({ 
          message: `Invalid section. Available: profile, education, experience, projects, skills, certifications, interests` 
        });
    }

    console.log(`✅ ${section} fetched successfully`);
    res.json({
      section,
      data: data || {}
    });
  } catch (error) {
    console.error(`❌ Error fetching ${req.params.section}:`, error);
    res.status(500).json({ message: error.message });
  }
};