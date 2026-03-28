import Profile from '../../models/portfolio/Profile.js';
import { generateSignedUrl } from '../vault/uploadController.js';

export const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) profile = await new Profile({ user: req.user._id }).save();
    profile = profile.toObject();
    if (profile.profilePhoto?.startsWith('portfolio/')) {
      try {
        profile.profilePhotoUrl = await generateSignedUrl(profile.profilePhoto, 3600);
      } catch (err) {
        console.warn('Could not generate signed URL for profile photo:', err.message);
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