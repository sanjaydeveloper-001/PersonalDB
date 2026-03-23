import crypto from 'crypto';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import Resume from '../../models/vault/Resume.js';
import s3Client from '../../config/s3.js';
import { generateSignedUrl } from './uploadController.js';

export const getResumes = async (req, res) => {
  try {
    res.json(await Resume.find({ user: req.user._id }).sort('-createdAt'));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // Get next position for this user
    const count = await Resume.countDocuments({ user: req.user._id });
    const position = Math.min(count + 1, 3);

    const key = `resumes/${req.user._id}/${Date.now()}_${req.file.originalname}`;
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    }));

    const resume = await Resume.create({
      user: req.user._id,
      position,
      publicToken: crypto.randomBytes(16).toString('hex'),
      file: { 
        key, 
        contentType: req.file.mimetype, 
        originalName: req.file.originalname, 
        size: req.file.size 
      },
    });
    
    res.status(201).json({
      _id: resume._id,
      filename: resume.file.originalName,
      originalName: resume.file.originalName,
      createdAt: resume.createdAt,
      url: await generateSignedUrl(resume.file.key, 3600),
    });
  } catch (error) {
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
    if (resume.file?.key) {
      await s3Client.send(new DeleteObjectCommand({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key: resume.file.key }));
    }
    res.json({ message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
