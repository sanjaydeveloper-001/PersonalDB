import { useState, useEffect, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'
import { Layout, Settings2, Globe, CheckCircle2, XCircle, Loader2, AlertTriangle, ExternalLink, Download } from 'lucide-react'
import TemplateCard from '../components/Templatecard'
import PortfolioExportModal from '../components/PortfolioExportModal'
import toast from 'react-hot-toast'
import { userService } from '../services/userService'

/* ─── Animations ─── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`

const spin = keyframes`
  to { transform: rotate(360deg); }
`

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
`

/* ──── PAGE LAYOUT ──── */
const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: ${fadeUp} 0.4s ease forwards;
  max-width: 100%;
`

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const PageTitle = styled.h1`
  font-size: 1.35rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.625rem;

  svg {
    width: 20px;
    height: 20px;
    color: #3b82f6;
  }
`

const PageDesc = styled.p`
  font-size: 0.825rem;
  color: #94a3b8;
  margin: 0;
`

/* ──── SHARED CARD ──── */
const Card = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.875rem;
  padding: 1.5rem;
`

/* ──── CUSTOM DOMAIN SECTION ──── */
const DomainHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
`

const DomainTitleGroup = styled.div``

const DomainTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg { width: 18px; height: 18px; color: #3b82f6; }
`

const DomainSubtitle = styled.p`
  font-size: 0.78rem;
  color: #94a3b8;
  margin: 0.2rem 0 0;
`

const CurrentDomainBadge = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #3b82f6;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  padding: 4px 12px;
  border-radius: 20px;
  text-decoration: none;
  transition: background 0.2s;
  white-space: nowrap;

  &:hover {
    background: #dbeafe;
  }

  svg { width: 12px; height: 12px; }
`

/* ──── URL PREVIEW BOX ──── */
const UrlPreviewBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 1.25rem;
  font-size: 0.82rem;
  color: #64748b;

  span.base {
    color: #94a3b8;
    font-family: 'JetBrains Mono', monospace;
  }

  span.username {
    color: #3b82f6;
    font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
  }
`

/* ──── DOMAIN INPUT ROW ──── */
const DomainInputRow = styled.div`
  display: flex;
  align-items: stretch;
  border: 2px solid ${({ $status }) =>
    $status === 'available' ? '#22c55e' :
    $status === 'taken' ? '#ef4444' :
    $status === 'invalid' ? '#f59e0b' :
    '#e2e8f0'};
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.25s, box-shadow 0.25s;
  background: white;

  &:focus-within {
    box-shadow: 0 0 0 3px ${({ $status }) =>
      $status === 'available' ? 'rgba(34,197,94,0.15)' :
      $status === 'taken' ? 'rgba(239,68,68,0.15)' :
      $status === 'invalid' ? 'rgba(245,158,11,0.15)' :
      'rgba(59,130,246,0.12)'};
    border-color: ${({ $status }) =>
      $status === 'available' ? '#22c55e' :
      $status === 'taken' ? '#ef4444' :
      $status === 'invalid' ? '#f59e0b' :
      '#3b82f6'};
  }
`

const DomainPrefix = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  font-size: 0.88rem;
  font-weight: 600;
  color: #64748b;
  font-family: 'JetBrains Mono', monospace;
  white-space: nowrap;
  user-select: none;
`

const DomainInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  outline: none;
  font-size: 0.95rem;
  color: #0f172a;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.02em;
  background: transparent;
  min-width: 0;

  &::placeholder {
    color: #94a3b8;
    font-family: inherit;
  }
`

const DomainStatusIcon = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  color: ${({ $status }) =>
    $status === 'available' ? '#22c55e' :
    $status === 'taken' ? '#ef4444' :
    $status === 'invalid' ? '#f59e0b' :
    '#cbd5e1'};

  svg {
    width: 18px;
    height: 18px;
    animation: ${({ $checking }) => $checking ? spin : 'none'} 0.7s linear infinite;
  }
`

/* ──── VALIDATION FEEDBACK ──── */
const FeedbackRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 0.625rem;
  font-size: 0.78rem;
  color: ${({ $type }) =>
    $type === 'success' ? '#16a34a' :
    $type === 'error' ? '#dc2626' :
    $type === 'warning' ? '#b45309' :
    '#64748b'};
  animation: ${slideIn} 0.2s ease;

  svg { width: 14px; height: 14px; flex-shrink: 0; margin-top: 1px; }
`

/* ──── RULES LIST ──── */
const RulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.5rem;
  margin-top: 1.25rem;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
`

const RuleItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: ${({ $ok }) => $ok ? '#16a34a' : '#94a3b8'};
  transition: color 0.2s;

  svg { width: 13px; height: 13px; flex-shrink: 0; }
`

/* ──── SAVE BUTTON ──── */
const SaveDomainBtn = styled.button`
  margin-top: 1.25rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(59,130,246,0.35);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  svg {
    width: 16px;
    height: 16px;
    animation: ${({ $loading }) => $loading ? spin : 'none'} 0.7s linear infinite;
  }
`

/* ──── EXPORT SECTION ──── */
const ExportSection = styled.div`
  background: linear-gradient(135deg, #f0f9ff 0%, #f8fafc 100%);
  border: 1px solid #bfdbfe;
  border-radius: 0.875rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

const ExportContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const ExportTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 18px;
    height: 18px;
    color: #3b82f6;
  }
`

const ExportDesc = styled.p`
  font-size: 0.78rem;
  color: #64748b;
  margin: 0;
`

const ExportBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(59,130,246,0.35);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  svg {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 600px) {
    width: 100%;
    justify-content: center;
  }
`

/* ──── TEMPLATES GRID SECTION ──── */
const GridWrap = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.875rem;
  padding: 1.5rem;
`

const GridHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`

const GridTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg { width: 18px; height: 18px; color: #3b82f6; }
`

const GridSubtitle = styled.p`
  font-size: 0.78rem;
  color: #94a3b8;
  margin: 0.2rem 0 0;
`

const GridCount = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #3b82f6;
  padding: 2px 10px;
  border-radius: 20px;
`

const TemplatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }

  @media (max-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  min-height: 400px;
`

const LoadingText = styled.p`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  color: #64748b;
  margin: 0;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #94a3b8;

  p { font-size: 1rem; margin: 0; }
`

const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(59, 130, 246, 0.2);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`

/* ════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════ */

const PATH_PREFIX = '/u/'

/**
 * Returns an array of validation errors for a given username.
 */
function validateUsername(value) {
  const errors = []

  if (!value) return errors

  if (value.length < 3) errors.push('too_short')
  if (value.length > 32) errors.push('too_long')
  if (/[^a-z0-9-]/.test(value)) errors.push('invalid_chars')
  if (/--/.test(value)) errors.push('double_hyphen')
  if (/\./.test(value)) errors.push('has_dot')
  if (/^-/.test(value)) errors.push('leading_hyphen')
  if (/-$/.test(value)) errors.push('trailing_hyphen')

  return errors
}

const RULE_DEFINITIONS = [
  { key: 'min_length',       label: 'At least 3 characters',           check: v => v.length >= 3 },
  { key: 'max_length',       label: 'Max 32 characters',               check: v => v.length <= 32 },
  { key: 'valid_chars',      label: 'Letters, numbers & hyphens only', check: v => /^[a-z0-9-]+$/.test(v) },
  { key: 'no_double_hyphen', label: 'No consecutive hyphens (--)',     check: v => !/--/.test(v) },
  { key: 'no_dot',           label: 'No dots allowed',                 check: v => !/\./.test(v) },
  { key: 'no_edge_hyphen',   label: 'No leading or trailing hyphen',   check: v => !/^-/.test(v) && !/-$/.test(v) },
]

/* ════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════ */
const PortfolioSettingsPage = () => {
  /* ── Templates state ── */
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [defaultTemplate, setDefaultTemplate] = useState(null)
  const [likedTemplates, setLikedTemplates] = useState({})
  const [saving, setSaving] = useState(false)

  /* ── Username/path state ── */
  const [currentUsername, setCurrentUsername] = useState('')  // existing portdomain from DB
  const [usernameInput, setUsernameInput] = useState('')       // what user types
  const [usernameStatus, setUsernameStatus] = useState('idle') // idle | checking | available | taken | invalid
  const [checkTimer, setCheckTimer] = useState(null)
  const [savingUsername, setSavingUsername] = useState(false)
  const [takenUsernames, setTakenUsernames] = useState([])     // pre-fetched list

  /* ── Export modal state ── */
  const [showExportModal, setShowExportModal] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  const runningUrl = import.meta.env.VITE_RUNNING_URL || window.location.origin

  /* ── Fetch all templates ── */
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/templates/all`)
        const data = await response.json()
        if (data.success) setTemplates(data.templates || [])
        else toast.error(data.message || 'Failed to load templates')
      } catch {
        toast.error('Failed to load templates')
      } finally {
        setLoading(false)
      }
    }
    fetchTemplates()
  }, [])

  /* ── Fetch user's default template ── */
  useEffect(() => {
    const fetchUserTemplate = async () => {
      try {
        const response = await fetch(`${API_URL}/templates/preference`, { credentials: 'include' })
        const data = await response.json()
        if (data.success && data.templateId) setDefaultTemplate(data.templateId)
      } catch {}
    }
    fetchUserTemplate()
  }, [])

  /* ── Fetch user profile (current username + all taken usernames) ── */
  useEffect(() => {
    const fetchUsernameData = async () => {
      try {
        const me = await userService.getProfile()
        if (me.success && me.user?.portdomain) {
          setCurrentUsername(me.user.portdomain)
          setUsernameInput(me.user.portdomain)
        }

        const taken = await userService.getAllDomains()
        if (taken.success && Array.isArray(taken.domains)) {
          setTakenUsernames(taken.domains)
        }
      } catch {}
    }
    fetchUsernameData()
  }, [])

  /* ── Input change handler ── */
  const handleUsernameChange = useCallback((e) => {
    const raw = e.target.value.toLowerCase().replace(/\s/g, '')
    setUsernameInput(raw)

    if (checkTimer) clearTimeout(checkTimer)

    if (!raw) {
      setUsernameStatus('idle')
      return
    }

    const errors = validateUsername(raw)
    if (errors.length > 0) {
      setUsernameStatus('invalid')
      return
    }

    if (raw === currentUsername) {
      setUsernameStatus('idle')
      return
    }

    setUsernameStatus('checking')

    const timer = setTimeout(() => {
      const isTaken = takenUsernames.includes(raw)
      setUsernameStatus(isTaken ? 'taken' : 'available')
    }, 500)

    setCheckTimer(timer)
  }, [checkTimer, currentUsername, takenUsernames])

  /* ── Save username ── */
  const handleSaveUsername = async () => {
    if (usernameStatus !== 'available') return

    try {
      setSavingUsername(true)
      const result = await userService.updateDomain(usernameInput)

      if (result.success) {
        setCurrentUsername(usernameInput)
        setUsernameStatus('idle')
        toast.success(`✅ Your portfolio is now at ${runningUrl}${PATH_PREFIX}${usernameInput}`)
      } else {
        toast.error(result.message || 'Failed to update username')
        if (result.code === 'DOMAIN_TAKEN') {
          setTakenUsernames(prev => [...prev, usernameInput])
          setUsernameStatus('taken')
        }
      }
    } catch {
      toast.error('Failed to update username')
    } finally {
      setSavingUsername(false)
    }
  }

  /* ── Template handlers ── */
  const handleSetDefault = async (templateId) => {
    try {
      setSaving(true)
      const response = await fetch(`${API_URL}/templates/set`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
        credentials: 'include',
      })
      const data = await response.json()
      if (data.success) {
        setDefaultTemplate(templateId)
        const name = templates.find(t => t._id === templateId)?.name
        toast.success(`"${name}" set as default template`)
      } else toast.error(data.message || 'Failed to set template')
    } catch {
      toast.error('Failed to set template')
    } finally {
      setSaving(false)
    }
  }

  const handleLike = async (templateId) => {
    try {
      const response = await fetch(`${API_URL}/templates/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
        credentials: 'include',
      })
      const data = await response.json()
      if (data.success) {
        setLikedTemplates(prev => ({ ...prev, [templateId]: true }))
        setTemplates(prev => prev.map(t => t._id === templateId ? { ...t, likescount: t.likescount + 1 } : t))
        toast.success('❤️ You liked this template')
      } else toast.error(data.message || 'Failed to like template')
    } catch {
      toast.error('Failed to like template')
    }
  }

  const handleUnlike = async (templateId) => {
    try {
      setLikedTemplates(prev => ({ ...prev, [templateId]: false }))
      setTemplates(prev => prev.map(t => t._id === templateId && t.likescount > 0 ? { ...t, likescount: t.likescount - 1 } : t))
      toast.success('Removed like')
    } catch {
      toast.error('Failed to unlike template')
    }
  }

  /* ── Derived state for UI ── */
  const validationErrors = validateUsername(usernameInput)
  const hasChanges = usernameInput && usernameInput !== currentUsername

  const getFeedback = () => {
    if (!usernameInput) return null
    if (usernameStatus === 'checking') return { type: 'info', msg: `Checking availability for "${usernameInput}"…` }
    if (usernameStatus === 'available') return { type: 'success', msg: `"${usernameInput}" is available! 🎉` }
    if (usernameStatus === 'taken') return { type: 'error', msg: `"${usernameInput}" is already taken.` }
    if (usernameStatus === 'invalid') {
      if (validationErrors.includes('double_hyphen')) return { type: 'warning', msg: 'Double hyphens (--) are not allowed.' }
      if (validationErrors.includes('has_dot')) return { type: 'warning', msg: 'Dots are not allowed in your username.' }
      if (validationErrors.includes('leading_hyphen') || validationErrors.includes('trailing_hyphen'))
        return { type: 'warning', msg: 'Username cannot start or end with a hyphen.' }
      if (validationErrors.includes('invalid_chars')) return { type: 'warning', msg: 'Only lowercase letters, numbers, and hyphens allowed.' }
      if (validationErrors.includes('too_short')) return { type: 'warning', msg: 'Username must be at least 3 characters.' }
      if (validationErrors.includes('too_long')) return { type: 'warning', msg: 'Username must be 32 characters or fewer.' }
    }
    if (usernameInput === currentUsername) return { type: 'info', msg: 'This is your current username.' }
    return null
  }

  const feedback = getFeedback()
  const feedbackIcon = {
    success: <CheckCircle2 />,
    error: <XCircle />,
    warning: <AlertTriangle />,
    info: <Globe />,
  }

  const statusIcon = () => {
    if (usernameStatus === 'checking') return <Loader2 />
    if (usernameStatus === 'available') return <CheckCircle2 />
    if (usernameStatus === 'taken') return <XCircle />
    if (usernameStatus === 'invalid') return <AlertTriangle />
    return <Globe />
  }

  return (
    <Root>
      {/* ── Page header ── */}
      <PageHeader>
        <PageTitle>
          <Settings2 />
          Portfolio Settings
        </PageTitle>
        <PageDesc>Choose and manage your portfolio template</PageDesc>
      </PageHeader>

      {/* ════════════════
          USERNAME / URL
      ════════════════ */}
      <Card>
        <DomainHeader>
          <DomainTitleGroup>
            <DomainTitle>
              <Globe />
              Portfolio URL
            </DomainTitle>
            <DomainSubtitle>Claim your personal portfolio link on {runningUrl}</DomainSubtitle>
          </DomainTitleGroup>
          {currentUsername && (
            <CurrentDomainBadge
              href={`${runningUrl}${PATH_PREFIX}${currentUsername}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {PATH_PREFIX}{currentUsername}
              <ExternalLink />
            </CurrentDomainBadge>
          )}
        </DomainHeader>

        {/* ── Live URL preview ── */}
        <UrlPreviewBox>
          <Globe size={14} />
          <span className="base">{runningUrl}{PATH_PREFIX}</span>
          <span className="username">{usernameInput || 'your-username'}</span>
        </UrlPreviewBox>

        {/* ── Input row ── */}
        <DomainInputRow $status={usernameInput && usernameStatus !== 'idle' ? usernameStatus : undefined}>
          <DomainPrefix>{PATH_PREFIX}</DomainPrefix>
          <DomainInput
            type="text"
            placeholder="your-username"
            value={usernameInput}
            onChange={handleUsernameChange}
            maxLength={32}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="none"
          />
          <DomainStatusIcon $status={usernameInput ? usernameStatus : 'idle'} $checking={usernameStatus === 'checking'}>
            {statusIcon()}
          </DomainStatusIcon>
        </DomainInputRow>

        {/* ── Inline feedback ── */}
        {feedback && (
          <FeedbackRow $type={feedback.type}>
            {feedbackIcon[feedback.type]}
            {feedback.msg}
          </FeedbackRow>
        )}

        {/* ── Rules checklist ── */}
        {usernameInput && (
          <RulesGrid>
            {RULE_DEFINITIONS.map(rule => (
              <RuleItem key={rule.key} $ok={rule.check(usernameInput)}>
                {rule.check(usernameInput)
                  ? <CheckCircle2 />
                  : <XCircle />}
                {rule.label}
              </RuleItem>
            ))}
          </RulesGrid>
        )}

        {/* ── Save button ── */}
        <SaveDomainBtn
          onClick={handleSaveUsername}
          disabled={usernameStatus !== 'available' || savingUsername || !hasChanges}
          $loading={savingUsername}
        >
          {savingUsername ? <Loader2 /> : <Globe />}
          {savingUsername ? 'Saving…' : 'Save Username'}
        </SaveDomainBtn>
      </Card>

      {/* ════════════════
          EXPORT SECTION
      ════════════════ */}
      <ExportSection>
        <ExportContent>
          <ExportTitle>
            <Download />
            Export Your Portfolio
          </ExportTitle>
          <ExportDesc>Download your complete portfolio data as JSON, Text, or PDF</ExportDesc>
        </ExportContent>
        <ExportBtn onClick={() => setShowExportModal(true)}>
          <Download size={16} />
          Export Now
        </ExportBtn>
      </ExportSection>

      {/* ════════════════
          TEMPLATES GRID
      ════════════════ */}
      <GridWrap>
        <GridHeader>
          <div>
            <GridTitle>
              <Layout />
              Portfolio Templates
            </GridTitle>
            <GridSubtitle>Pick a default template for your public portfolio</GridSubtitle>
          </div>
          {!loading && <GridCount>{templates.length} templates</GridCount>}
        </GridHeader>

        {loading ? (
          <LoadingContainer>
            <LoadingText>
              <Spinner />
              Loading templates...
            </LoadingText>
          </LoadingContainer>
        ) : templates.length === 0 ? (
          <EmptyState><p>No templates available at the moment</p></EmptyState>
        ) : (
          <TemplatesGrid>
            {templates.map(template => (
              <TemplateCard
                key={template._id}
                template={template}
                isDefault={defaultTemplate === template._id}
                onSetDefault={handleSetDefault}
                onLike={handleLike}
                onUnlike={handleUnlike}
                isLiked={likedTemplates[template._id] || false}
                loading={saving}
              />
            ))}
          </TemplatesGrid>
        )}
      </GridWrap>

      {/* Export Modal */}
      <PortfolioExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} />
    </Root>
  )
}

export default PortfolioSettingsPage