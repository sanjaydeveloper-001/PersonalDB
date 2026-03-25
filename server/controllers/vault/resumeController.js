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
    const maxPosition = await Resume.findOne({ user: req.user._id })
      .sort('-position')
      .select('position');

    const nextPosition = (maxPosition?.position || 0) + 1;

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

    if (!position || isNaN(position) || position < 1) {
      return res.status(400).json({ message: 'Valid position required (must be >= 1)' });
    }

    const positionNum = parseInt(position);

    const userResumes = await Resume.find({ user: req.user._id }).sort('position');

    if (positionNum > userResumes.length + 1) {
      return res.status(400).json({
        message: `Invalid position. You can only add to position ${userResumes.length + 1}.`,
      });
    }

    const existingResume = await Resume.findOne({
      user: req.user._id,
      position: positionNum,
    });

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

    const key = `resumes/${req.user._id}/${Date.now()}_${req.file.originalname}`;
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    }));

    let resume;
    if (existingResume) {
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
    if (error.code === 11000) {
      return res.status(400).json({
        message: 'A file already exists at this position. Delete it first or replace it.',
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// ── Public file access — redirects directly to the signed S3 URL ──
// Visiting /api/vault/resume/public/:token in a browser opens the file immediately.
export const getResumeByToken = async (req, res) => {
  try {
    const resume = await Resume.findOne({ publicToken: req.params.token });
    if (!resume?.file?.key) {
      return res.status(404).json({ message: 'File not found or link has expired.' });
    }

    const signedUrl = await generateSignedUrl(resume.file.key, 3600);

    // 302 redirect — browser follows it and opens/downloads the file directly
    return res.redirect(302, signedUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

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

    const remainingResumes = await Resume.find({ user: req.user._id }).sort('position');
    for (let i = 0; i < remainingResumes.length; i++) {
      await Resume.findByIdAndUpdate(remainingResumes[i]._id, { position: i + 1 });
    }

    res.json({ message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};