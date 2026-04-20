import Profile from '../../models/portfolio/Profile.js';
import { generateSignedUrl } from '../vault/uploadController.js';

export const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) profile = await new Profile({ user: req.user._id }).save();
    profile = profile.toObject();
    
    // Generate signed URLs for profile photo
    if (profile.profilePhoto?.startsWith('portfolio/')) {
      try {
        profile.profilePhotoUrl = await generateSignedUrl(profile.profilePhoto, 3600);
      } catch (err) {
        console.warn('Could not generate signed URL for profile photo:', err.message);
      }
    }

    // Generate signed URL for resume
    if (profile.resume?.startsWith('resume/')) {
      try {
        profile.resumeUrl = await generateSignedUrl(profile.resume, 3600);
      } catch (err) {
        console.warn('Could not generate signed URL for resume:', err.message);
      }
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new Profile({ user: req.user._id, ...req.body });
    } else {
      Object.assign(profile, req.body);
    }
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};