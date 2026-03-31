import User from '../models/common/User.js'
import { generateSignedUrl, uploadToS3, deleteFromS3 } from './vault/uploadController.js'

const SUBDOMAIN_RE = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/

function validateSubdomainPrefix(value) {
  const errors = []
  if (!value || typeof value !== 'string') return ['required']
  const v = value.toLowerCase().trim()
  if (v.length < 3)           errors.push('too_short')
  if (v.length > 32)          errors.push('too_long')
  if (/[^a-z0-9-]/.test(v))  errors.push('invalid_chars')
  if (/--/.test(v))           errors.push('double_hyphen')
  if (/\./.test(v))           errors.push('has_dot')
  if (/^-/.test(v))           errors.push('leading_hyphen')
  if (/-$/.test(v))           errors.push('trailing_hyphen')
  if (!SUBDOMAIN_RE.test(v))  errors.push('invalid_format')
  return errors
}

/* ── Shared helper: attach a signed URL to any user object ── */
async function attachSignedUrl(user) {
  if (user.profileImage?.startsWith('avatars/')) {
    try {
      user.profileImageUrl = await generateSignedUrl(user.profileImage, 3600)
    } catch (err) {
      console.warn('[attachSignedUrl] Could not generate signed URL:', err.message)
    }
  }
  return user
}

/* ═══════════════════════════════════════
   GET /users/me
═══════════════════════════════════════ */
export const getMe = async (req, res) => {
  try {
    let user = await User.findById(req.user._id)
      .select('-password -placeAnswerHash -friendAnswerHash')
      .lean()
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    user = await attachSignedUrl(user)
    return res.json({ success: true, user })
  } catch (err) {
    console.error('[userController.getMe]', err)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

/* ═══════════════════════════════════════
   PUT /users/me/username
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
    const existing = await User.findOne({ username: trimmed, _id: { $ne: req.user._id } })
    if (existing) {
      return res.status(409).json({ success: false, message: 'Username already taken' })
    }
    let user = await User.findByIdAndUpdate(
      req.user._id, { username: trimmed }, { new: true }
    ).select('-password -placeAnswerHash -friendAnswerHash').lean()
    user = await attachSignedUrl(user)
    return res.json({ success: true, message: 'Username updated', user })
  } catch (err) {
    console.error('[userController.updateUsername]', err)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

/* ═══════════════════════════════════════
   PUT /users/me/email
═══════════════════════════════════════ */
export const updateEmail = async (req, res) => {
  try {
    const { email } = req.body
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, message: 'Email is required' })
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRe.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' })
    }
    const existing = await User.findOne({ email: email.toLowerCase(), _id: { $ne: req.user._id } })
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already in use' })
    }
    let user = await User.findByIdAndUpdate(
      req.user._id, { email: email.toLowerCase() }, { new: true }
    ).select('-password -placeAnswerHash -friendAnswerHash').lean()
    user = await attachSignedUrl(user)
    return res.json({ success: true, message: 'Email updated', user })
  } catch (err) {
    console.error('[userController.updateEmail]', err)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

/* ═══════════════════════════════════════
   POST /users/me/avatar
   multer middleware must run before this.
   Expects req.file (field name: "avatar").
   1. Validates mime type + size
   2. Deletes old S3 object if present
   3. Uploads new file → avatars/<userId>/timestamp_filename
   4. Saves S3 key in User.profileImage
   5. Returns user with fresh profileImageUrl (signed URL)
═══════════════════════════════════════ */
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided' })
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(req.file.mimetype)) {
      return res.status(400).json({ success: false, message: 'Only JPEG, PNG, WebP, and GIF are allowed' })
    }
    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ success: false, message: 'Image must be under 5 MB' })
    }

    // Delete old S3 object if there is one
    const existing = await User.findById(req.user._id).select('profileImage').lean()
    if (existing?.profileImage?.startsWith('avatars/')) {
      try {
        await deleteFromS3(existing.profileImage)
      } catch (e) {
        console.warn('[uploadAvatar] Could not delete old avatar from S3:', e.message)
      }
    }

    // Upload to S3 → key: avatars/<userId>/timestamp_originalname
    const s3Key = await uploadToS3(req.file, `avatars/${req.user._id}`)

    // Persist the S3 key in the User document
    let user = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: s3Key },
      { new: true }
    ).select('-password -placeAnswerHash -friendAnswerHash').lean()

    // Attach fresh signed URL so the client can display the image immediately
    user = await attachSignedUrl(user)

    return res.json({ success: true, message: 'Avatar updated', user })
  } catch (err) {
    console.error('[userController.uploadAvatar]', err)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

/* ═══════════════════════════════════════
   DELETE /users/me/avatar
═══════════════════════════════════════ */
export const removeAvatar = async (req, res) => {
  try {
    const existing = await User.findById(req.user._id).select('profileImage').lean()
    if (existing?.profileImage?.startsWith('avatars/')) {
      try {
        await deleteFromS3(existing.profileImage)
      } catch (e) {
        console.warn('[removeAvatar] Could not delete S3 object:', e.message)
      }
    }
    const user = await User.findByIdAndUpdate(
      req.user._id, { profileImage: null }, { new: true }
    ).select('-password -placeAnswerHash -friendAnswerHash').lean()
    return res.json({ success: true, message: 'Avatar removed', user })
  } catch (err) {
    console.error('[userController.removeAvatar]', err)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

/* ═══════════════════════════════════════
   GET /users/domains
═══════════════════════════════════════ */
export const getAllDomains = async (req, res) => {
  try {
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
═══════════════════════════════════════ */
export const updateDomain = async (req, res) => {
  try {
    const { subdomain } = req.body
    if (!subdomain) {
      return res.status(400).json({ success: false, message: 'Subdomain is required' })
    }
    const value = subdomain.toLowerCase().trim()
    const validationErrors = validateSubdomainPrefix(value)
    if (validationErrors.length > 0) {
      const messages = {
        too_short:       'Subdomain must be at least 3 characters',
        too_long:        'Subdomain must be 32 characters or fewer',
        invalid_chars:   'Only lowercase letters, numbers, and hyphens are allowed',
        double_hyphen:   'Double hyphens (--) are not allowed',
        has_dot:         'Dots are not allowed in a subdomain',
        leading_hyphen:  'Subdomain cannot start with a hyphen',
        trailing_hyphen: 'Subdomain cannot end with a hyphen',
        invalid_format:  'Invalid subdomain format',
      }
      return res.status(400).json({
        success: false,
        message: messages[validationErrors[0]] || 'Invalid subdomain',
        errors: validationErrors,
      })
    }
    const conflict = await User.findOne({ portdomain: value, _id: { $ne: req.user._id } })
    if (conflict) {
      return res.status(409).json({
        success: false,
        message: `${value}.josan.tech is already taken`,
        code: 'DOMAIN_TAKEN',
      })
    }
    let user = await User.findByIdAndUpdate(
      req.user._id,
      { portdomain: value },
      { new: true, runValidators: true }
    ).select('-password -placeAnswerHash -friendAnswerHash').lean()
    user = await attachSignedUrl(user)
    return res.json({
      success: true,
      message: `Domain updated to ${value}.josan.tech`,
      user,
      domain: `${value}.josan.tech`,
    })
  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.portdomain) {
      return res.status(409).json({ success: false, message: 'That subdomain is already taken', code: 'DOMAIN_TAKEN' })
    }
    console.error('[userController.updateDomain]', err)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}