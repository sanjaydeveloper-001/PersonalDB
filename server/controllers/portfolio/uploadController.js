import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '../../config/s3.js';
import { generateSignedUrl, deleteFromS3 } from '../vault/uploadController.js';
import Profile from '../../models/portfolio/Profile.js';

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const key = `portfolio/${req.user._id}/${Date.now()}_${req.file.originalname}`;
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    }));

    res.json({ key });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // Get the user's profile to check for existing resume
    let profile = await Profile.findOne({ user: req.user._id });
    
    // Delete old resume if exists
    if (profile?.resume) {
      try {
        await deleteFromS3(profile.resume);
      } catch (err) {
        console.warn('Could not delete old resume:', err.message);
      }
    }

    // Upload new resume
    const key = `resume/${req.user._id}/${Date.now()}_${req.file.originalname}`;
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    }));

    // Update profile with new resume key
    if (!profile) {
      profile = new Profile({ user: req.user._id, resume: key });
    } else {
      profile.resume = key;
    }
    await profile.save();

    // Generate and return signed URL
    const url = await generateSignedUrl(key, 3600);
    res.json({ key, url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    
    if (!profile?.resume) {
      return res.status(404).json({ message: 'No resume found' });
    }

    // Delete from S3
    await deleteFromS3(profile.resume);

    // Remove resume key from profile
    profile.resume = null;
    await profile.save();

    res.json({ message: 'Resume deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
