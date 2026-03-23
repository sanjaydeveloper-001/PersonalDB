import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '../../config/s3.js';

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
