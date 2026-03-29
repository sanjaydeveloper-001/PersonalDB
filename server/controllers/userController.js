import User from '../models/common/User.js'       // adjust path to your model
import path from 'path'
import fs from 'fs'

/* ═══════════════════════════════════════
   HELPER — sanitize a subdomain prefix
═══════════════════════════════════════ */
const SUBDOMAIN_RE = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/

function validateSubdomainPrefix(value) {
  const errors = []
  if (!value || typeof value !== 'string') return ['required']

  const v = value.toLowerCase().trim()

  if (v.length < 3)           errors.push('too_short')       // min 3 chars
  if (v.length > 32)          errors.push('too_long')        // max 32 chars
  if (/[^a-z0-9-]/.test(v))  errors.push('invalid_chars')   // only a-z 0-9 -
  if (/--/.test(v))           errors.push('double_hyphen')   // no --
  if (/\./.test(v))           errors.push('has_dot')         // no dots
  if (/^-/.test(v))           errors.push('leading_hyphen')  // can't start with -
  if (/-$/.test(v))           errors.push('trailing_hyphen') // can't end with -
  if (!SUBDOMAIN_RE.test(v))  errors.push('invalid_format')

  return errors
}

/* ═══════════════════════════════════════
   GET /users/me
   Returns the current user's full profile
═══════════════════════════════════════ */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -apiKeys -placeAnswerHash -friendAnswerHash')
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    return res.json({ success: true, user })
  } catch (err) {
    console.error('[userController.getMe]', err)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

/* ═══════════════════════════════════════
   PUT /users/me/username
   Change username (uniqueness enforced)
═══════════════════════════════════════ */
export const updateUsername = async (req, res) => {
  try {
    const { username } = req.body

    if (!username || typeof username !== 'string') {
      return res.status(400).json({ success: false, message: 'Username is required' })
    }

    const trimmed = username.trim()
    if (trimmed.length < 3 || trimmed.length > 30) {
      return res.status(400).json({ success: false, message: 'Username must be 3–30 characters' })
    }

    // Check taken
    const existing = await User.findOne({ username: trimmed, _id: { $ne: req.user._id } })
    if (existing) {
      return res.status(409).json({ success: false, message: 'Username already taken' })
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { username: trimmed },
      { new: true }
    ).select('-password')

    return res.json({ success: true, message: 'Username updated', user })
  } catch (err) {
    console.error('[userController.updateUsername]', err)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

/* ═══════════════════════════════════════
   PUT /users/me/email
   Add or update email address
═══════════════════════════════════════ */
export const updateEmail = async (req, res) => {
  try {
    const { email } = req.body

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, message: 'Email is required' })
    }

    // Basic email format check
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRe.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' })
    }

    // Check uniqueness (sparse index allows multiple nulls but not duplicate values)
    const existing = await User.findOne({ email: email.toLowerCase(), _id: { $ne: req.user._id } })
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already in use' })
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { email: email.toLowerCase() },
      { new: true }
    ).select('-password')

    return res.json({ success: true, message: 'Email updated', user })
  } catch (err) {
    console.error('[userController.updateEmail]', err)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

/* ═══════════════════════════════════════
   POST /users/me/avatar
   Upload profile image (multer expected upstream)
   req.file must be set by multer middleware
═══════════════════════════════════════ */
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' })
    }

    // Only allow image mime types
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(req.file.mimetype)) {
      fs.unlinkSync(req.file.path) // clean up
      return res.status(400).json({ success: false, message: 'Only JPEG, PNG, WebP, and GIF images are allowed' })
    }

    // Max 5 MB
    if (req.file.size > 5 * 1024 * 1024) {
      fs.unlinkSync(req.file.path)
      return res.status(400).json({ success: false, message: 'Image must be under 5 MB' })
    }

    // Remove old avatar file if it's a local upload (not a URL)
    const existing = await User.findById(req.user._id).select('profileImage')
    if (existing?.profileImage && existing.profileImage.startsWith('/uploads/')) {
      const oldPath = path.join(process.cwd(), 'public', existing.profileImage)
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
    }

    // Store relative URL
    const relativePath = `/uploads/avatars/${req.file.filename}`

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: relativePath },
      { new: true }
    ).select('-password')

    return res.json({ success: true, message: 'Avatar updated', user, avatarUrl: relativePath })
  } catch (err) {
    console.error('[userController.uploadAvatar]', err)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

/* ═══════════════════════════════════════
   DELETE /users/me/avatar
   Remove profile image (reset to default)
═══════════════════════════════════════ */
export const removeAvatar = async (req, res) => {
  try {
    const existing = await User.findById(req.user._id).select('profileImage')

    // Delete file if it's local
    if (existing?.profileImage && existing.profileImage.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'public', existing.profileImage)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: null },
      { new: true }
    ).select('-password')

    return res.json({ success: true, message: 'Avatar removed', user })
  } catch (err) {
    console.error('[userController.removeAvatar]', err)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

/* ═══════════════════════════════════════
   GET /users/domains
   Returns ALL taken portdomain prefixes
   (for client-side availability check)
═══════════════════════════════════════ */
export const getAllDomains = async (req, res) => {
  try {
    // Only return portdomain field for every user — lean for performance
    const users = await User.find({}, 'portdomain').lean()
    const domains = users.map(u => u.portdomain).filter(Boolean)

    return res.json({ success: true, domains })
  } catch (err) {
    console.error('[userController.getAllDomains]', err)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

/* ═══════════════════════════════════════
   PUT /users/me/domain
   Claim / update the user's portdomain.

   Security:
   1. Format validation (same rules as client)
   2. Server-side uniqueness check (prevents race conditions even
      if two users pass client-side check simultaneously)
   3. The current user's own domain is excluded from the uniqueness
      check so they can "re-save" without error
═══════════════════════════════════════ */
export const updateDomain = async (req, res) => {
  try {
    const { subdomain } = req.body

    if (!subdomain) {
      return res.status(400).json({ success: false, message: 'Subdomain is required' })
    }

    const value = subdomain.toLowerCase().trim()

    // ── 1. Format validation ──
    const errors = validateSubdomainPrefix(value)
    if (errors.length > 0) {
      const messages = {
        too_short:        'Subdomain must be at least 3 characters',
        too_long:         'Subdomain must be 32 characters or fewer',
        invalid_chars:    'Only lowercase letters, numbers, and hyphens are allowed',
        double_hyphen:    'Double hyphens (--) are not allowed',
        has_dot:          'Dots are not allowed in a subdomain',
        leading_hyphen:   'Subdomain cannot start with a hyphen',
        trailing_hyphen:  'Subdomain cannot end with a hyphen',
        invalid_format:   'Invalid subdomain format',
      }
      const firstError = errors[0]
      return res.status(400).json({
        success: false,
        message: messages[firstError] || 'Invalid subdomain',
        errors,
      })
    }

    // ── 2. Uniqueness check (excludes current user's own domain) ──
    const conflict = await User.findOne({
      portdomain: value,
      _id: { $ne: req.user._id },
    })

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: `${value}.josan.tech is already taken`,
        code: 'DOMAIN_TAKEN',
      })
    }

    // ── 3. Save ──
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { portdomain: value },
      { new: true, runValidators: true }
    ).select('-password')

    return res.json({
      success: true,
      message: `Domain updated to ${value}.josan.tech`,
      user,
      domain: `${value}.josan.tech`,
    })
  } catch (err) {
    // Catch Mongoose unique index violation as fallback
    if (err.code === 11000 && err.keyPattern?.portdomain) {
      return res.status(409).json({
        success: false,
        message: 'That subdomain is already taken',
        code: 'DOMAIN_TAKEN',
      })
    }
    console.error('[userController.updateDomain]', err)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}