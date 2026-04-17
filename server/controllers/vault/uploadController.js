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
   Upload Google profile picture to S3
   Downloads from Google URL and uploads to avatars/userId
═══════════════════════════════════════ */
export const uploadGoogleProfilePicture = async (googleImageUrl, userId) => {
  try {
    if (!googleImageUrl) return null
    
    // Download image from Google
    const response = await fetch(googleImageUrl)
    if (!response.ok) {
      return null
    }
    
    // Use arrayBuffer() for native fetch, then convert to Buffer
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    
    // Upload to S3 with key format: avatars/userId
    const key = `avatars/${userId}`
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }))
    
    return key
  } catch (error) {
    return null
  }
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