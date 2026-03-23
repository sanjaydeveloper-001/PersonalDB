import User from '../models/common/User.js';
import Profile from '../models/portfolio/Profile.js';
import Education from '../models/portfolio/Education.js';
import Experience from '../models/portfolio/Experience.js';
import Project from '../models/portfolio/Project.js';
import Skill from '../models/portfolio/Skill.js';
import Certification from '../models/portfolio/Certification.js';
import Interest from '../models/portfolio/Interest.js';

export const getPublicPortfolio = async (req, res) => {
  try {
    const { username } = req.params;
    
    // Look up user in vaultDB by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const userId = user._id;
    
    // Query all portfolio data in parallel using userId
    const [profile, education, experience, projects, skills, certifications, interests] = await Promise.all([
      Profile.findOne({ user: userId }).lean(),
      Education.find({ user: userId }).sort('-startDate').lean(),
      Experience.find({ user: userId }).sort('-startDate').lean(),
      Project.find({ user: userId }).sort('-createdAt').lean(),
      Skill.findOne({ user: userId }).lean(),
      Certification.find({ user: userId }).sort('-issuedDate').lean(),
      Interest.findOne({ user: userId }).lean()
    ]);
    
    // Return consolidated portfolio data
    res.json({
      profile: profile || {},
      education: education || [],
      experience: experience || [],
      projects: projects || [],
      skills: skills || {},
      certifications: certifications || [],
      interests: interests || {}
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

    // Dynamically import s3Client and generateSignedUrl from uploadController
    const { generateSignedUrl } = await import('./vault/uploadController.js');
    const url = await generateSignedUrl(key, 3600); // 1 hour expiry
    
    res.json({ url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
