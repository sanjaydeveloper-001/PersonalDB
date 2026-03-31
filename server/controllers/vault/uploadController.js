import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import s3Client from '../../config/s3.js'

/* ═══════════════════════════════════════
   Generate a short-lived signed GET URL
═══════════════════════════════════════ */
export const generateSignedUrl = async (key, expiresIn = 3600) => {
  return getSignedUrl(
    s3Client,
    new GetObjectCommand({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key: key }),
    { expiresIn }
  )
}

/* ═══════════════════════════════════════
   Reusable: upload a multer file to S3
   folder  — e.g. 'avatars/userId' or 'portfolio'
   Returns the S3 key string.
═══════════════════════════════════════ */
export const uploadToS3 = async (file, folder) => {
  const key = `${folder}/${Date.now()}_${file.originalname}`
  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  }))
  return key
}

/* ═══════════════════════════════════════
   Reusable: delete an object from S3 by key
═══════════════════════════════════════ */
export const deleteFromS3 = async (key) => {
  await s3Client.send(new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  }))
}

/* ═══════════════════════════════════════
   POST /vault/upload  (existing route)
═══════════════════════════════════════ */
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })

    const key = await uploadToS3(req.file, `vault/${req.user._id}`)
    const url = await generateSignedUrl(key)

    res.json({ key, url })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}