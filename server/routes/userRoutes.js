/**
 * userRoutes.js
 * Mount at: app.use('/api/users', userRouter)
 *
 * Requires:
 *  - protect  — your existing auth middleware (sets req.user)
 *  - multer   — for avatar uploads
 */
import express from 'express'
import multer from 'multer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { protect } from '../middleware/auth.js'
import {
  getMe,
  updateUsername,
  updateEmail,
  uploadAvatar,
  removeAvatar,
  getAllDomains,
  updateDomain,
} from '../controllers/userController.js'

const router = express.Router()

/* ── Multer config for avatar uploads ── */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/avatars')   // make sure this directory exists
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${uuidv4()}${ext}`)
  },
})

const avatarUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB hard limit
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (allowed.includes(file.mimetype)) cb(null, true)
    else cb(new Error('Only JPEG, PNG, WebP, and GIF files are allowed'))
  },
})

/* ─────────────────────────────────────────────────────────────
   PUBLIC (no auth required)
───────────────────────────────────────────────────────────── */

// GET /api/users/domains  — list of all taken subdomains
router.get('/domains', getAllDomains)

/* ─────────────────────────────────────────────────────────────
   PROTECTED (must be logged in)
───────────────────────────────────────────────────────────── */

// GET  /api/users/me
router.get('/me', protect, getMe)

// PUT  /api/users/me/username
router.put('/me/username', protect, updateUsername)

// PUT  /api/users/me/email
router.put('/me/email', protect, updateEmail)

// POST /api/users/me/avatar
router.post('/me/avatar', protect, avatarUpload.single('avatar'), uploadAvatar)

// DELETE /api/users/me/avatar
router.delete('/me/avatar', protect, removeAvatar)

// PUT  /api/users/me/domain
router.put('/me/domain', protect, updateDomain)

export default router