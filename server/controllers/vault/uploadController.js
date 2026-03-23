import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3Client from '../../config/s3.js';

export const generateSignedUrl = async (key, expiresIn = 3600) => {
  return getSignedUrl(s3Client, new GetObjectCommand({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key: key }), { expiresIn });
};

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const key = `vault/${req.user._id}/${Date.now()}_${req.file.originalname}`;
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    }));

    res.json({ key, url: await generateSignedUrl(key) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
