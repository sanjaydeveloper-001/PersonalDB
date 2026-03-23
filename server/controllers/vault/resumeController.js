import crypto from 'crypto';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import Resume from '../../models/vault/Resume.js';
import s3Client from '../../config/s3.js';
import { generateSignedUrl } from './uploadController.js';

export const getResumes = async (req, res) => {
  try {
    res.json(await Resume.find({ user: req.user._id }).sort('position'));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// NEW: Add empty slot without file
export const addEmptySlot = async (req, res) => {
  try {
    // Get user's current max position
    const maxPosition = await Resume.findOne({ user: req.user._id })
      .sort('-position')
      .select('position');

    const nextPosition = (maxPosition?.position || 0) + 1;

    // Create empty slot (no file yet)
    const resume = await Resume.create({
      user: req.user._id,
      position: nextPosition,
      publicToken: crypto.randomBytes(16).toString('hex'),
      file: null,
    });

    res.status(201).json({
      _id: resume._id,
      position: resume.position,
      file: null,
      publicToken: resume.publicToken,
      createdAt: resume.createdAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const { position } = req.body;
    
    // Validate position is provided and valid
    if (!position || isNaN(position) || position < 1) {
      return res.status(400).json({ message: 'Valid position required (must be >= 1)' });
    }

    const positionNum = parseInt(position);

    // Get all user resumes to validate position
    const userResumes = await Resume.find({ user: req.user._id }).sort('position');
    
    // Can only add to next available position or update existing
    if (positionNum > userResumes.length + 1) {
      return res.status(400).json({ 
        message: `Invalid position. You can only add to position ${userResumes.length + 1}.` 
      });
    }

    // Check if replacing existing file at this position
    const existingResume = await Resume.findOne({ 
      user: req.user._id, 
      position: positionNum 
    });

    // Delete old file from S3 if replacing
    if (existingResume?.file?.key) {
      try {
        await s3Client.send(new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: existingResume.file.key,
        }));
      } catch (s3Error) {
        console.error('S3 deletion error:', s3Error);
      }
    }

    // Upload new file to S3
    const key = `resumes/${req.user._id}/${Date.now()}_${req.file.originalname}`;
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    }));

    // Update or create resume record
    let resume;
    if (existingResume) {
      // Update existing record
      resume = await Resume.findByIdAndUpdate(
        existingResume._id,
        {
          publicToken: crypto.randomBytes(16).toString('hex'),
          file: {
            key,
            contentType: req.file.mimetype,
            originalName: req.file.originalname,
            size: req.file.size,
          },
        },
        { new: true }
      );
    } else {
      // Create new record
      resume = await Resume.create({
        user: req.user._id,
        position: positionNum,
        publicToken: crypto.randomBytes(16).toString('hex'),
        file: {
          key,
          contentType: req.file.mimetype,
          originalName: req.file.originalname,
          size: req.file.size,
        },
      });
    }

    res.status(201).json({
      _id: resume._id,
      position: resume.position,
      filename: resume.file.originalName,
      originalName: resume.file.originalName,
      publicToken: resume.publicToken,
      createdAt: resume.createdAt,
      url: await generateSignedUrl(resume.file.key, 3600),
    });
  } catch (error) {
    // Handle unique constraint violation
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'A file already exists at this position. Delete it first or replace it.' 
      });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getResumeByToken = async (req, res) => {
  try {
    const resume = await Resume.findOne({ publicToken: req.params.token });
    if (!resume?.file?.key) return res.status(404).json({ message: 'Resume not found' });
    res.json({ url: await generateSignedUrl(resume.file.key, 3600) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    
    // Delete file from S3
    if (resume.file?.key) {
      try {
        await s3Client.send(new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: resume.file.key,
        }));
      } catch (s3Error) {
        console.error('S3 deletion error:', s3Error);
      }
    }

    // Reorder remaining files to compact positions (remove gaps)
    const remainingResumes = await Resume.find({ user: req.user._id }).sort('position');
    for (let i = 0; i < remainingResumes.length; i++) {
      await Resume.findByIdAndUpdate(remainingResumes[i]._id, { position: i + 1 });
    }

    res.json({ message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};