import { useState, useRef, useEffect } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { useAuth } from '../contexts/AuthContext'
import { userService } from '../services/userService'
import {
  User, Calendar, Key, Clock, Activity,
  ExternalLink, Copy, Globe, Mail, AtSign,
  Camera, Trash2, Check, X, Loader, Shield,
  ChevronRight, Edit3, AlertCircle, Link2
} from 'lucide-react'
import toast from 'react-hot-toast'

/* ── Animations ── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`
const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
`
const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
`

/* ── Layout ── */
const PageWrap = styled.div`
  max-width: 860px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: ${fadeUp} 0.4s ease both;
`

/* ── Hero Card ── */
const HeroCard = styled.div`
  background: var(--bg-card, #161b27);
  border: 1px solid rgba(59,130,246,0.1);
  border-radius: 20px;
  padding: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent);
  }
`

const HeroInner = styled.div`
  display: flex;
  align-items: center;
  gap: 1.75rem;
  @media (max-width: 600px) { flex-direction: column; align-items: flex-start; gap: 1.25rem; }
`

/* ── Avatar ── */
const AvatarWrap = styled.div`
  position: relative;
  flex-shrink: 0;
`

const AvatarCircle = styled.div`
  width: 88px; height: 88px;
  border-radius: 50%;
  background: ${({ $hasImg }) => $hasImg ? 'transparent' : 'linear-gradient(135deg, #3b82f6, #1e40af)'};
  border: 2px solid rgba(59,130,246,0.3);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
  position: relative;
  box-shadow: 0 0 0 4px rgba(59,130,246,0.08);

  img { width: 100%; height: 100%; object-fit: cover; }

  span {
    color: white; font-size: 2.2rem; font-weight: 800;
    font-family: 'Syne', sans-serif;
  }
`

const AvatarOverlay = styled.div`
  position: absolute; inset: 0;
  border-radius: 50%;
  background: rgba(0,0,0,0.55);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 0.2rem;
  opacity: 0;
  cursor: pointer;
  transition: opacity 0.2s;

  ${AvatarWrap}:hover & { opacity: 1; }

  svg { width: 18px; height: 18px; color: white; }
  span { font-size: 0.62rem; color: rgba(255,255,255,0.85); font-weight: 600; letter-spacing: 0.04em; }
`

const AvatarRemove = styled.button`
  position: absolute;
  top: -4px; right: -4px;
  width: 22px; height: 22px;
  border-radius: 50%;
  background: #ef4444;
  border: 2px solid var(--bg-card, #161b27);
  color: white;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  svg { width: 10px; height: 10px; }
  &:hover { background: #dc2626; transform: scale(1.1); }
`

const HiddenInput = styled.input`
  display: none;
`

/* ── Hero Meta ── */
const HeroMeta = styled.div`
  flex: 1;
`

const HeroName = styled.h1`
  font-family: 'Syne', sans-serif;
  font-size: 1.6rem; font-weight: 800;
  color: var(--text-primary, #e2e8f0);
  margin: 0 0 0.2rem;
`

const HeroSub = styled.p`
  font-size: 0.82rem;
  color: var(--text-muted, #64748b);
  margin: 0 0 0.85rem;
`

const BadgeRow = styled.div`
  display: flex; flex-wrap: wrap; gap: 0.5rem;
`

const Badge = styled.span`
  display: inline-flex; align-items: center; gap: 0.35rem;
  font-size: 0.72rem; font-weight: 600;
  padding: 0.28rem 0.65rem; border-radius: 7px;
  background: ${({ $bg }) => $bg || 'rgba(59,130,246,0.1)'};
  color: ${({ $color }) => $color || '#3b82f6'};
  border: 1px solid ${({ $border }) => $border || 'rgba(59,130,246,0.2)'};
  svg { width: 11px; height: 11px; }
`

/* ── Section ── */
const Section = styled.div`
  background: var(--bg-card, #161b27);
  border: 1px solid rgba(59,130,246,0.08);
  border-radius: 18px;
  overflow: visible;
  position: relative;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: ${({ $delay }) => $delay || 0}s;

  &::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,0.25), transparent);
  }
`

const SectionHeader = styled.div`
  display: flex; align-items: center; gap: 0.75rem;
  padding: 1.1rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.04);

  svg { width: 16px; height: 16px; color: #3b82f6; }
`

const SectionTitle = styled.h2`
  font-family: 'Syne', sans-serif;
  font-size: 0.88rem; font-weight: 700;
  color: var(--text-primary, #e2e8f0); margin: 0;
  flex: 1;
`

const SectionBadge = styled.span`
  font-size: 0.68rem; font-weight: 700;
  padding: 0.18rem 0.5rem; border-radius: 5px;
  background: rgba(59,130,246,0.1);
  color: #3b82f6;
  border: 1px solid rgba(59,130,246,0.2);
  text-transform: uppercase; letter-spacing: 0.05em;
`

/* ── Field Row ── */
const FieldList = styled.div``

const FieldRow = styled.div`
  display: flex; align-items: center; gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  transition: background 0.2s;
  &:last-child { border-bottom: none; }
  &:hover { background: rgba(59,130,246,0.02); }

  @media (max-width: 600px) { flex-wrap: wrap; }
`

const FieldIconWrap = styled.div`
  width: 34px; height: 34px;
  border-radius: 9px;
  background: rgba(59,130,246,0.08);
  border: 1px solid rgba(59,130,246,0.12);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  svg { width: 15px; height: 15px; color: #3b82f6; }
`

const FieldContent = styled.div`
  flex: 1; min-width: 0;
`

const FieldLabel = styled.div`
  font-size: 0.7rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.07em;
  color: var(--text-muted, #64748b);
  margin-bottom: 0.2rem;
`

const FieldValue = styled.div`
  font-size: 0.875rem; font-weight: 500;
  color: var(--text-primary, #e2e8f0);
  font-family: ${({ $mono }) => $mono ? "'Courier New', monospace" : 'inherit'};
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`

const FieldMuted = styled(FieldValue)`
  color: var(--text-muted, #64748b);
  font-style: italic; font-weight: 400;
`

/* ── Inline Edit ── */
const EditArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  animation: ${slideIn} 0.18s ease both;
`

const EditRow = styled.div`
  display: flex; gap: 0.5rem; align-items: center;
`

const EditInput = styled.input`
  flex: 1;
  padding: 0.55rem 0.85rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(59,130,246,0.25);
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem;
  color: var(--text-primary, #e2e8f0);
  transition: all 0.2s;
  min-width: 0;

  &::placeholder { color: var(--text-muted, #64748b); }
  &:focus {
    outline: none;
    border-color: rgba(59,130,246,0.5);
    box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
    background: rgba(59,130,246,0.04);
  }
`

const EditHint = styled.div`
  font-size: 0.7rem;
  color: ${({ $error }) => $error ? '#f87171' : 'var(--text-muted, #64748b)'};
  display: flex; align-items: center; gap: 0.3rem;
  svg { width: 11px; height: 11px; flex-shrink: 0; }
  animation: ${slideIn} 0.15s ease both;
`

const DomainPreview = styled.div`
  font-size: 0.72rem;
  color: ${({ $valid }) => $valid ? '#10b981' : 'var(--text-muted, #64748b)'};
  font-family: 'Courier New', monospace;
  padding: 0.3rem 0.6rem;
  background: ${({ $valid }) => $valid ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.03)'};
  border: 1px solid ${({ $valid }) => $valid ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)'};
  border-radius: 6px;
  transition: all 0.2s;
`

/* ── Buttons ── */
const Btn = styled.button`
  display: inline-flex; align-items: center; justify-content: center; gap: 0.35rem;
  padding: ${({ $sm }) => $sm ? '0.4rem 0.75rem' : '0.52rem 1rem'};
  border-radius: ${({ $sm }) => $sm ? '8px' : '10px'};
  font-family: 'DM Sans', sans-serif;
  font-size: ${({ $sm }) => $sm ? '0.75rem' : '0.8rem'};
  font-weight: 700;
  cursor: pointer;
  transition: all 0.18s;
  border: 1px solid transparent;
  svg { width: ${({ $sm }) => $sm ? '12px' : '14px'}; height: ${({ $sm }) => $sm ? '12px' : '14px'}; }

  ${({ $variant }) => {
    if ($variant === 'primary') return css`
      background: linear-gradient(135deg, #3b82f6, #1e40af);
      color: white;
      border-color: rgba(59,130,246,0.3);
      &:hover { box-shadow: 0 4px 14px rgba(59,130,246,0.35); transform: translateY(-1px); }
    `
    if ($variant === 'ghost') return css`
      background: rgba(255,255,255,0.04);
      color: var(--text-muted, #64748b);
      border-color: rgba(255,255,255,0.08);
      &:hover { background: rgba(59,130,246,0.08); color: #3b82f6; border-color: rgba(59,130,246,0.2); }
    `
    if ($variant === 'danger') return css`
      background: rgba(239,68,68,0.08);
      color: #f87171;
      border-color: rgba(239,68,68,0.2);
      &:hover { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.35); }
    `
    if ($variant === 'success') return css`
      background: rgba(16,185,129,0.1);
      color: #10b981;
      border-color: rgba(16,185,129,0.2);
      &:hover { background: rgba(16,185,129,0.18); border-color: rgba(16,185,129,0.35); }
    `
  }}

  &:disabled { opacity: 0.45; cursor: not-allowed; transform: none !important; box-shadow: none !important; }
`

const EditBtn = styled.button`
  display: inline-flex; align-items: center; gap: 0.3rem;
  padding: 0.35rem 0.65rem;
  border-radius: 8px;
  font-size: 0.72rem; font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  background: rgba(59,130,246,0.07);
  color: #3b82f6;
  border: 1px solid rgba(59,130,246,0.15);
  cursor: pointer;
  transition: all 0.18s;
  flex-shrink: 0;
  svg { width: 12px; height: 12px; }
  &:hover { background: rgba(59,130,246,0.14); border-color: rgba(59,130,246,0.3); }
`

/* ── Spinner ── */
const SpinIcon = styled(Loader)`
  animation: ${spin} 1s linear infinite;
`

/* ── Public URL Card ── */
const UrlBox = styled.div`
  display: flex; align-items: center; gap: 0.65rem;
  padding: 1rem 1.5rem;
`

const UrlCode = styled.div`
  flex: 1;
  padding: 0.6rem 0.9rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(59,130,246,0.12);
  border-radius: 10px;
  font-family: 'Courier New', monospace;
  font-size: 0.82rem;
  color: #3b82f6;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  min-width: 0;
`

const IconBtn = styled.button`
  width: 34px; height: 34px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(59,130,246,0.12);
  background: rgba(59,130,246,0.06);
  border-radius: 9px;
  color: #3b82f6;
  cursor: pointer;
  transition: all 0.18s;
  flex-shrink: 0;
  svg { width: 14px; height: 14px; }
  &:hover { background: rgba(59,130,246,0.14); border-color: rgba(59,130,246,0.3); transform: translateY(-1px); }
`

/* ── API Key rows ── */
const KeyList = styled.div``

const KeyRow = styled.div`
  display: flex; align-items: center; gap: 1rem;
  padding: 0.9rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  &:last-child { border-bottom: none; }
  @media (max-width: 600px) { flex-wrap: wrap; }
`

const KeyName = styled.div`
  font-size: 0.875rem; font-weight: 600;
  color: var(--text-primary, #e2e8f0); flex: 1; min-width: 0;
  font-family: 'DM Sans', sans-serif;
`

const KeyMeta = styled.div`
  display: flex; align-items: center; gap: 0.75rem;
`

const KeyStat = styled.span`
  font-size: 0.75rem; color: var(--text-muted, #64748b);
  display: flex; align-items: center; gap: 0.3rem;
  svg { width: 11px; height: 11px; }
`

const SummaryBar = styled.div`
  display: flex; gap: 2rem;
  padding: 0.9rem 1.5rem;
  border-top: 1px solid rgba(255,255,255,0.04);
  background: rgba(59,130,246,0.02);
`

const SumItem = styled.div``
const SumLabel = styled.div`
  font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.07em; color: var(--text-muted, #64748b); margin-bottom: 0.2rem;
`
const SumValue = styled.div`
  font-family: 'Syne', sans-serif;
  font-size: 1.2rem; font-weight: 800; color: #3b82f6;
`

const EmptyState = styled.div`
  padding: 2.5rem; text-align: center;
  color: var(--text-muted, #64748b); font-size: 0.85rem;
  svg { width: 2rem; height: 2rem; display: block; margin: 0 auto 0.75rem; color: rgba(59,130,246,0.2); }
`

/* ── Info Grid (static details) ── */
const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
`

const InfoCell = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.03);
  border-right: 1px solid rgba(255,255,255,0.03);
  &:nth-child(2n) { border-right: none; }
  &:last-child, &:nth-last-child(2):nth-child(odd) { border-bottom: none; }
`

const InfoLabel = styled.div`
  font-size: 0.68rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.07em;
  color: var(--text-muted, #64748b); margin-bottom: 0.3rem;
`

const InfoVal = styled.div`
  font-size: 0.875rem; font-weight: 500;
  color: ${({ $muted }) => $muted ? 'var(--text-muted, #64748b)' : 'var(--text-primary, #e2e8f0)'};
  font-style: ${({ $muted }) => $muted ? 'italic' : 'normal'};
  font-family: ${({ $mono }) => $mono ? "'Courier New', monospace" : 'inherit'};
  font-size: ${({ $mono }) => $mono ? '0.75rem' : '0.875rem'};
`

/* ═══════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════ */
const formatDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const timeAgo = (d) => {
  if (!d) return ''
  const days = Math.floor((Date.now() - new Date(d)) / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days} days ago`
  const m = Math.floor(days / 30)
  if (m < 12) return `${m} month${m > 1 ? 's' : ''} ago`
  const y = Math.floor(m / 12)
  return `${y} year${y > 1 ? 's' : ''} ago`
}

const SUBDOMAIN_RE = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/
const validateSubdomain = (v) => {
  if (!v) return null
  if (v.length < 3) return 'Too short (min 3 characters)'
  if (v.length > 32) return 'Too long (max 32 characters)'
  if (/[^a-z0-9-]/.test(v)) return 'Only lowercase letters, numbers, and hyphens'
  if (/--/.test(v)) return 'Double hyphens not allowed'
  if (/^-|-$/.test(v)) return 'Cannot start or end with a hyphen'
  if (!SUBDOMAIN_RE.test(v)) return 'Invalid format'
  return null
}

/* ═══════════════════════════════════════════════════
   INLINE EDIT FIELD
═══════════════════════════════════════════════════ */
const InlineField = ({
  icon, label, value, placeholder, onSave,
  prefix, suffix, hint, validate, mono, isSaving
}) => {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value || '')
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])
  useEffect(() => { setVal(value || '') }, [value])

  const handleSave = async () => {
    if (validate) {
      const err = validate(val)
      if (err) { setError(err); return }
    }
    setSaving(true)
    try {
      await onSave(val)
      setEditing(false)
      setError(null)
    } catch (e) {
      // ✅ FIX: handle both axios errors (e.response.data.message)
      // and plain JS errors (e.message) thrown manually from savers
      setError(e?.response?.data?.message || e?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave()
    if (e.key === 'Escape') { setEditing(false); setVal(value || ''); setError(null) }
  }

  return (
    <FieldRow>
      <FieldIconWrap>{icon}</FieldIconWrap>
      <FieldContent>
        <FieldLabel>{label}</FieldLabel>
        {editing ? (
          <EditArea>
            <EditRow>
              {prefix && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)', whiteSpace: 'nowrap' }}>{prefix}</span>}
              <EditInput
                ref={inputRef}
                value={val}
                onChange={e => { setVal(e.target.value); setError(null) }}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
              />
              {suffix && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748b)', whiteSpace: 'nowrap' }}>{suffix}</span>}
            </EditRow>
            {suffix && val && !error && (
              <DomainPreview $valid={!validateSubdomain(val)}>
                → {val.toLowerCase()}{suffix}
              </DomainPreview>
            )}
            {hint && !error && <EditHint>{hint}</EditHint>}
            {error && <EditHint $error><AlertCircle />{error}</EditHint>}
            <EditRow>
              <Btn $variant="primary" $sm onClick={handleSave} disabled={saving}>
                {saving ? <SpinIcon size={11} /> : <Check />}
                {saving ? 'Saving…' : 'Save'}
              </Btn>
              <Btn $variant="ghost" $sm onClick={() => { setEditing(false); setVal(value || ''); setError(null) }}>
                <X />Cancel
              </Btn>
            </EditRow>
          </EditArea>
        ) : (
          value
            ? <FieldValue $mono={mono}>{prefix}{value}{suffix}</FieldValue>
            : <FieldMuted>{placeholder || 'Not set'}</FieldMuted>
        )}
      </FieldContent>
      {!editing && (
        <EditBtn onClick={() => setEditing(true)}>
          <Edit3 />Edit
        </EditBtn>
      )}
    </FieldRow>
  )
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════ */
const AccountPage = () => {
  const { user, setUser } = useAuth()
  const fileInputRef = useRef(null)
  const [avatarLoading, setAvatarLoading] = useState(false)

  const publicUrl = user?.portdomain
    ? `${window.location.origin}/u/${user.portdomain}`
    : `${window.location.origin}/u/${user?.username}`

  const copyUrl = () => {
    navigator.clipboard.writeText(publicUrl)
    toast.success('Copied to clipboard!')
  }

  /* ── Avatar upload ── */
  const handleAvatarClick = () => fileInputRef.current?.click()

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append('avatar', file)
    setAvatarLoading(true)
    try {
      const data = await userService.uploadAvatar(fd)
      if (data.success) { setUser(data.user); toast.success('Avatar updated!') }
      else toast.error(data.message)
    } catch { toast.error('Failed to upload avatar') }
    finally { setAvatarLoading(false); e.target.value = '' }
  }

  const handleRemoveAvatar = async (e) => {
    e.stopPropagation()
    setAvatarLoading(true)
    try {
      const data = await userService.removeAvatar()
      if (data.success) { setUser(data.user); toast.success('Avatar removed') }
    } catch { toast.error('Failed to remove avatar') }
    finally { setAvatarLoading(false) }
  }

  /* ── Field savers ── */
  const saveUsername = async (username) => {
    const data = await userService.updateUsername(username)
    if (data.user) {
      setUser(data.user)
      toast.success('Username updated!')
    } else {
      throw new Error(data?.message || 'Failed to update username')
    }
  }

  const saveEmail = async (email) => {
    const data = await userService.updateEmail(email)
    if (data.user) {
      setUser(data.user)
      toast.success('Email updated!')
    } else {
      throw new Error(data?.message || 'Failed to update email')
    }
  }

  const saveDomain = async (subdomain) => {
    const data = await userService.updateDomain(subdomain.toLowerCase())
    if (data.user) {
      setUser(data.user)
      toast.success(`Domain set to ${data.domain}!`)
    } else {
      throw new Error(data?.message || 'Failed to update domain')
    }
  }

  const totalRequests = user?.apiKeys?.reduce((s, k) => s + (k.requestCount || 0), 0) ?? 0

  const avatarUrl = user?.profileImage
    ? (user.profileImage.startsWith('http') ? user.profileImage : `${import.meta.env.VITE_API_URL?.replace('/api', '')}${user.profileImage}`)
    : null

  return (
    <PageWrap>

      {/* ── HERO ── */}
      <HeroCard>
        <HeroInner>
          <AvatarWrap>
            <AvatarCircle $hasImg={!!avatarUrl} onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
              {avatarLoading
                ? <SpinIcon size={24} color="white" />
                : avatarUrl
                  ? <img src={avatarUrl} alt="avatar" />
                  : <span>{user?.username?.[0]?.toUpperCase()}</span>
              }
              <AvatarOverlay>
                <Camera />
                <span>Change</span>
              </AvatarOverlay>
            </AvatarCircle>
            {avatarUrl && !avatarLoading && (
              <AvatarRemove onClick={handleRemoveAvatar} title="Remove avatar">
                <X />
              </AvatarRemove>
            )}
            <HiddenInput
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleAvatarChange}
            />
          </AvatarWrap>

          <HeroMeta>
            <HeroName>{user?.username}</HeroName>
            <HeroSub>
              {user?.portdomain ? `${user.portdomain}.josan.tech` : 'PersonalDB member'}
            </HeroSub>
            <BadgeRow>
              <Badge $bg="rgba(16,185,129,0.1)" $color="#10b981" $border="rgba(16,185,129,0.2)">
                <Shield /> Active account
              </Badge>
              <Badge>
                <Key /> {user?.apiKeys?.length ?? 0} API key{user?.apiKeys?.length !== 1 ? 's' : ''}
              </Badge>
              {user?.createdAt && (
                <Badge $bg="rgba(100,116,139,0.1)" $color="#94a3b8" $border="rgba(100,116,139,0.15)">
                  <Calendar /> Joined {timeAgo(user.createdAt)}
                </Badge>
              )}
              {user?.role === 'admin' && (
                <Badge $bg="rgba(251,191,36,0.1)" $color="#fbbf24" $border="rgba(251,191,36,0.2)">
                  <Shield /> Admin
                </Badge>
              )}
            </BadgeRow>
          </HeroMeta>
        </HeroInner>
      </HeroCard>

      {/* ── PUBLIC PORTFOLIO LINK ── */}
      <Section $delay={0.05}>
        <SectionHeader>
          <Link2 />
          <SectionTitle>Public portfolio link</SectionTitle>
        </SectionHeader>
        <UrlBox>
          <UrlCode>{publicUrl}</UrlCode>
          <IconBtn onClick={copyUrl} title="Copy URL"><Copy /></IconBtn>
          <IconBtn as="a" href={publicUrl} target="_blank" rel="noopener noreferrer" title="Open in new tab">
            <ExternalLink />
          </IconBtn>
        </UrlBox>
      </Section>

      {/* ── PROFILE SETTINGS ── */}
      <Section $delay={0.1}>
        <SectionHeader>
          <User />
          <SectionTitle>Profile settings</SectionTitle>
          <SectionBadge>Editable</SectionBadge>
        </SectionHeader>
        <FieldList>
          <InlineField
            icon={<AtSign />}
            label="Username"
            value={user?.username}
            placeholder="Enter a username"
            onSave={saveUsername}
            hint="3–30 characters. This changes your public profile URL."
            validate={(v) => {
              if (!v || v.trim().length < 3) return 'Min 3 characters'
              if (v.trim().length > 30) return 'Max 30 characters'
              return null
            }}
          />
          <InlineField
            icon={<Mail />}
            label="Email address"
            value={user?.email}
            placeholder="Add your email"
            onSave={saveEmail}
            hint="Used for account recovery and notifications."
            validate={(v) => {
              if (!v) return 'Email is required'
              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Invalid email format'
              return null
            }}
          />
          <InlineField
            icon={<Globe />}
            label="Custom domain"
            value={user?.portdomain}
            placeholder="yourname"
            prefix="personaldb.josan.tech/u/"
            onSave={saveDomain}
            hint="Your personal subdomain. Must be 3–32 chars, lowercase, hyphens allowed."
            validate={(v) => {
              if (!v) return 'Subdomain is required'
              return validateSubdomain(v.toLowerCase())
            }}
          />
        </FieldList>
      </Section>

      {/* ── ACCOUNT DETAILS ── */}
      <Section $delay={0.15}>
        <SectionHeader>
          <Shield />
          <SectionTitle>Account details</SectionTitle>
        </SectionHeader>
        <InfoGrid>
          <InfoCell>
            <InfoLabel>User ID</InfoLabel>
            <InfoVal $mono>{user?._id ?? '—'}</InfoVal>
          </InfoCell>
          <InfoCell>
            <InfoLabel>Account created</InfoLabel>
            <InfoVal>{formatDate(user?.createdAt)}</InfoVal>
          </InfoCell>
          <InfoCell>
            <InfoLabel>Last updated</InfoLabel>
            <InfoVal>{formatDate(user?.updatedAt)}</InfoVal>
          </InfoCell>
          <InfoCell>
            <InfoLabel>Birth year</InfoLabel>
            {user?.birthYear
              ? <InfoVal>{user.birthYear}</InfoVal>
              : <InfoVal $muted>Not set</InfoVal>
            }
          </InfoCell>
          <InfoCell>
            <InfoLabel>Role</InfoLabel>
            <InfoVal style={{
              textTransform: 'capitalize',
              color: user?.role === 'admin' ? '#fbbf24' : 'var(--text-primary, #e2e8f0)'
            }}>
              {user?.role ?? 'user'}
            </InfoVal>
          </InfoCell>
          <InfoCell>
            <InfoLabel>Security questions</InfoLabel>
            <InfoVal style={{
              color: (user?.placeAnswerHash && user?.friendAnswerHash) ? '#10b981' : '#f59e0b'
            }}>
              {user?.placeAnswerHash && user?.friendAnswerHash ? '✓ Configured' : '⚠ Incomplete'}
            </InfoVal>
          </InfoCell>
        </InfoGrid>
      </Section>

      {/* ── API KEYS ── */}
      <Section $delay={0.2}>
        <SectionHeader>
          <Key />
          <SectionTitle>API keys — overview</SectionTitle>
          {user?.apiKeys?.length > 0 && (
            <SectionBadge>{user.apiKeys.length} key{user.apiKeys.length !== 1 ? 's' : ''}</SectionBadge>
          )}
        </SectionHeader>

        {!user?.apiKeys?.length ? (
          <EmptyState>
            <Key />
            No API keys yet. Generate one in the Developer section.
          </EmptyState>
        ) : (
          <>
            <KeyList>
              {user.apiKeys.map((k) => (
                <KeyRow key={k._id ?? k.name}>
                  <KeyName>{k.name}</KeyName>
                  <KeyMeta>
                    <KeyStat><Activity />{(k.requestCount ?? 0).toLocaleString()} requests</KeyStat>
                    {k.lastUsed && <KeyStat><Clock />Last used {timeAgo(k.lastUsed)}</KeyStat>}
                    <KeyStat><Calendar />{formatDate(k.createdAt)}</KeyStat>
                  </KeyMeta>
                </KeyRow>
              ))}
            </KeyList>
            <SummaryBar>
              <SumItem>
                <SumLabel>Total keys</SumLabel>
                <SumValue>{user.apiKeys.length}</SumValue>
              </SumItem>
              <SumItem>
                <SumLabel>Total requests</SumLabel>
                <SumValue>{totalRequests.toLocaleString()}</SumValue>
              </SumItem>
            </SummaryBar>
          </>
        )}
      </Section>

    </PageWrap>
  )
}

export default AccountPage