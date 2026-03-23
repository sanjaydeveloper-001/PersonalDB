import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled, { keyframes, css } from 'styled-components'
import {
  Lock, LogOut, Trash2, Eye, EyeOff, ShieldAlert,
  CheckCircle2, AlertTriangle, User, Bell, Shield,
  ChevronRight, Palette, Globe, Key, Smartphone,
  Activity, Clock, Check,
} from 'lucide-react'
import { authService } from '../services/authService'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

/* ─── Animations ─── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`
const slideDown = keyframes`
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
`
const spin = keyframes`to { transform: rotate(360deg); }`

/* ─── Root layout ─── */
const Root = styled.div`
  display: flex;
  gap: 1.75rem;
  align-items: flex-start;
  animation: ${fadeUp} 0.4s ease forwards;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`

/* ══════════════════════════════════════
   LEFT SIDEBAR
══════════════════════════════════════ */
const Sidebar = styled.aside`
  width: 220px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  position: sticky;
  top: 1.5rem;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    position: static;
    gap: 0.5rem;
  }
`

const SidebarSection = styled.div`
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    display: contents;
  }
`

const SidebarLabel = styled.p`
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #94a3b8;
  margin: 0 0 0.375rem 0.625rem;

  @media (max-width: 768px) { display: none; }
`

const NavItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.625rem 0.875rem;
  border-radius: 0.625rem;
  border: 1px solid transparent;
  background: none;
  cursor: pointer;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s;
  color: ${({ $active }) => $active ? '#1e40af' : '#475569'};
  background: ${({ $active }) => $active ? '#eff6ff' : 'transparent'};
  border-color: ${({ $active }) => $active ? '#bfdbfe' : 'transparent'};

  &:hover {
    background: ${({ $active }) => $active ? '#eff6ff' : '#f8fafc'};
    color: ${({ $active }) => $active ? '#1e40af' : '#0f172a'};
    border-color: ${({ $active }) => $active ? '#bfdbfe' : '#e2e8f0'};
  }

  svg {
    width: 15px; height: 15px;
    color: ${({ $active }) => $active ? '#3b82f6' : '#94a3b8'};
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    width: auto;
    padding: 0.5rem 0.875rem;
    font-size: 0.8rem;
  }
`

const NavDot = styled.span`
  margin-left: auto;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #3b82f6;
  display: ${({ $active }) => $active ? 'block' : 'none'};

  @media (max-width: 768px) { display: none; }
`

/* ══════════════════════════════════════
   RIGHT CONTENT
══════════════════════════════════════ */
const Content = styled.main`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

/* ─── Section header (clickable, accordion trigger) ─── */
const SectionWrap = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.875rem;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;

  ${({ $danger }) => $danger && css`
    border-color: #fecaca;
    &:hover { border-color: #fca5a5; }
  `}

  ${({ $open, $danger }) => $open && !$danger && css`
    border-color: #bfdbfe;
    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.07);
  `}
`

const SectionTrigger = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.125rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;

  &:hover { background: #f8fafc; }

  ${({ $danger }) => $danger && css`
    &:hover { background: #fff5f5; }
  `}
`

const SectionIconWrap = styled.div`
  width: 38px; height: 38px;
  border-radius: 0.625rem;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  svg { width: 17px; height: 17px; }

  ${({ $color }) => {
    const map = {
      blue:   css`background:#eff6ff; border:1px solid #bfdbfe; color:#3b82f6;`,
      green:  css`background:#f0fdf4; border:1px solid #bbf7d0; color:#16a34a;`,
      orange: css`background:#fff7ed; border:1px solid #fed7aa; color:#ea580c;`,
      purple: css`background:#faf5ff; border:1px solid #e9d5ff; color:#9333ea;`,
      slate:  css`background:#f8fafc; border:1px solid #e2e8f0; color:#64748b;`,
      red:    css`background:#fef2f2; border:1px solid #fecaca; color:#dc2626;`,
    }
    return map[$color] || map.slate
  }}
`

const SectionMeta = styled.div`flex: 1; min-width: 0;`

const SectionTitle = styled.p`
  font-size: 0.925rem;
  font-weight: 600;
  color: ${({ $danger }) => $danger ? '#dc2626' : '#0f172a'};
  margin: 0 0 2px;
`

const SectionDesc = styled.p`
  font-size: 0.775rem;
  color: #94a3b8;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ChevronIcon = styled(ChevronRight)`
  width: 16px !important; height: 16px !important;
  color: #94a3b8;
  flex-shrink: 0;
  transition: transform 0.2s;
  transform: ${({ $open }) => $open ? 'rotate(90deg)' : 'rotate(0deg)'};
`

/* ─── Section body (the panel content) ─── */
const SectionBody = styled.div`
  border-top: 1px solid ${({ $danger }) => $danger ? '#fecaca' : '#f1f5f9'};
  padding: 1.5rem;
  animation: ${slideDown} 0.2s ease;
`

/* ══════════════════════════════════════
   FORM ELEMENTS
══════════════════════════════════════ */
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 1rem;
`

const Label = styled.label`
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
`

const InputWrap = styled.div`position: relative;`

const Input = styled.input`
  width: 100%;
  padding: 0.625rem ${({ $hasIcon }) => $hasIcon ? '2.5rem' : '0.875rem'} 0.625rem 0.875rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #0f172a;
  background: white;
  transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  &:disabled { background: #f8fafc; color: #94a3b8; cursor: not-allowed; }
`

const EyeBtn = styled.button`
  position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; color: #94a3b8; padding: 0;
  display: flex; align-items: center;
  &:hover { color: #64748b; }
  svg { width: 15px; height: 15px; }
`

const Hint = styled.p`
  font-size: 0.72rem;
  color: #94a3b8;
  margin: 0.2rem 0 0;
`

const SelectInput = styled.select`
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #0f172a;
  background: white;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
  }
`

/* ── Toggle switch ── */
const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
  &:last-child { border-bottom: none; }
`

const ToggleMeta = styled.div``
const ToggleTitle = styled.p`font-size: 0.875rem; font-weight: 500; color: #0f172a; margin: 0 0 2px;`
const ToggleHint  = styled.p`font-size: 0.75rem; color: #94a3b8; margin: 0;`

const ToggleTrack = styled.button`
  width: 40px; height: 22px;
  border-radius: 11px;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  position: relative;
  transition: background 0.2s;
  background: ${({ $on }) => $on ? '#3b82f6' : '#e2e8f0'};
`

const ToggleThumb = styled.span`
  position: absolute;
  top: 3px;
  left: ${({ $on }) => $on ? '21px' : '3px'};
  width: 16px; height: 16px;
  border-radius: 50%;
  background: white;
  transition: left 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
`

/* ── Buttons ── */
const Btn = styled.button`
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem; font-weight: 600;
  cursor: pointer; transition: all 0.15s;
  border: 1px solid transparent;
  svg { width: 15px; height: 15px; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

const PrimaryBtn = styled(Btn)`
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  &:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(59,130,246,0.3); }
`

const OutlineBtn = styled(Btn)`
  background: white; color: #374151;
  border-color: #e2e8f0;
  &:hover:not(:disabled) { background: #f8fafc; border-color: #cbd5e1; }
`

const DangerBtn = styled(Btn)`
  background: #dc2626; color: white;
  &:hover:not(:disabled) { background: #b91c1c; }
`

const OutlineDangerBtn = styled(Btn)`
  background: white; color: #dc2626;
  border-color: #fecaca;
  &:hover:not(:disabled) { background: #fef2f2; border-color: #fca5a5; }
`

const BtnRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.25rem;
  ${({ $end }) => $end && 'justify-content: flex-end;'}
`

/* ── Spinner ── */
const SpinnerIcon = styled.div`
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`

/* ── Warning box ── */
const WarningBox = styled.div`
  display: flex; gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: #fff7ed; border: 1px solid #fed7aa; border-radius: 0.5rem;
  margin-bottom: 1.25rem;
  svg { width: 16px; height: 16px; color: #ea580c; flex-shrink: 0; margin-top: 1px; }
  p { font-size: 0.8rem; color: #9a3412; margin: 0; line-height: 1.55; }
`

/* ── Delete stepper ── */
const StepRow = styled.div`display: flex; gap: 0; margin-bottom: 1.5rem;`

const Step = styled.div`
  flex: 1; display: flex; flex-direction: column; align-items: center; position: relative;
  &:not(:last-child)::after {
    content: ''; position: absolute;
    top: 13px; left: 50%; right: -50%;
    height: 2px;
    background: ${({ $done }) => $done ? '#3b82f6' : '#e2e8f0'};
    transition: background 0.3s; z-index: 0;
  }
`

const StepDot = styled.div`
  width: 26px; height: 26px; border-radius: 50%; z-index: 1;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.72rem; font-weight: 700;
  transition: background 0.3s;
  background: ${({ $active, $done }) => $active ? '#dc2626' : $done ? '#3b82f6' : '#e2e8f0'};
  color: ${({ $active, $done }) => ($active || $done) ? 'white' : '#94a3b8'};
  svg { width: 12px; height: 12px; }
`

const StepLabel = styled.span`
  font-size: 0.68rem; margin-top: 0.3rem; text-align: center;
  color: ${({ $active }) => $active ? '#dc2626' : '#94a3b8'};
  font-weight: ${({ $active }) => $active ? '600' : '400'};
`

const ConfirmInput = styled(Input)`
  font-family: 'Courier New', monospace;
  text-align: center;
  letter-spacing: 0.1em;
  font-size: 1rem;
  &::placeholder { font-family: inherit; letter-spacing: 0; font-size: 0.82rem; }
`

/* ── Info row (readonly display) ── */
const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
  &:last-child { border-bottom: none; }
`
const InfoLabel = styled.p`font-size: 0.8rem; color: #64748b; margin: 0; font-weight: 500;`
const InfoValue = styled.p`font-size: 0.875rem; color: #0f172a; margin: 0; font-weight: 500;`
const InfoBadge = styled.span`
  font-size: 0.68rem; font-weight: 700; letter-spacing: 0.06em;
  padding: 2px 10px; border-radius: 20px;
  background: ${({ $color }) => $color === 'green' ? '#f0fdf4' : '#eff6ff'};
  border: 1px solid ${({ $color }) => $color === 'green' ? '#bbf7d0' : '#bfdbfe'};
  color: ${({ $color }) => $color === 'green' ? '#16a34a' : '#3b82f6'};
`

/* ══════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════ */
const PasswordField = ({ id, label, value, onChange, disabled, placeholder, hint }) => {
  const [show, setShow] = useState(false)
  return (
    <FormGroup>
      <Label htmlFor={id}>{label}</Label>
      <InputWrap>
        <Input
          id={id} type={show ? 'text' : 'password'}
          value={value} onChange={onChange}
          disabled={disabled} placeholder={placeholder}
          $hasIcon required
        />
        <EyeBtn type="button" onClick={() => setShow(s => !s)} tabIndex={-1}>
          {show ? <EyeOff /> : <Eye />}
        </EyeBtn>
      </InputWrap>
      {hint && <Hint>{hint}</Hint>}
    </FormGroup>
  )
}

const Toggle = ({ label, hint, value, onChange }) => (
  <ToggleRow>
    <ToggleMeta>
      <ToggleTitle>{label}</ToggleTitle>
      {hint && <ToggleHint>{hint}</ToggleHint>}
    </ToggleMeta>
    <ToggleTrack $on={value} onClick={() => onChange(!value)}>
      <ToggleThumb $on={value} />
    </ToggleTrack>
  </ToggleRow>
)

/* Accordion section */
const Section = ({ icon, iconColor = 'blue', title, desc, children, danger, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen || false)
  return (
    <SectionWrap $open={open} $danger={danger}>
      <SectionTrigger onClick={() => setOpen(o => !o)} $danger={danger}>
        <SectionIconWrap $color={iconColor}>{icon}</SectionIconWrap>
        <SectionMeta>
          <SectionTitle $danger={danger}>{title}</SectionTitle>
          <SectionDesc>{desc}</SectionDesc>
        </SectionMeta>
        <ChevronIcon $open={open} />
      </SectionTrigger>
      {open && <SectionBody $danger={danger}>{children}</SectionBody>}
    </SectionWrap>
  )
}

/* ══════════════════════════════════════
   NAV SECTIONS CONFIG
══════════════════════════════════════ */
const NAV = [
  { id: 'account',   label: 'Account',   icon: <User />,    group: 'General' },
  { id: 'security',  label: 'Security',  icon: <Shield />,  group: 'General' },
  { id: 'notifs',    label: 'Notifications', icon: <Bell />, group: 'General' },
  { id: 'appearance',label: 'Appearance',icon: <Palette />, group: 'Preferences' },
  { id: 'privacy',   label: 'Privacy',   icon: <Globe />,   group: 'Preferences' },
  { id: 'danger',    label: 'Danger Zone',icon: <ShieldAlert />, group: 'Account' },
]

/* ══════════════════════════════════════
   PAGE
══════════════════════════════════════ */
const SettingsPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  /* ── active nav ── */
  const [activeNav, setActiveNav] = useState('account')

  /* ── change password ── */
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [pwLoading, setPwLoading] = useState(false)

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (pw.next !== pw.confirm) return toast.error('New passwords do not match')
    if (pw.next.length < 6)    return toast.error('Password must be at least 6 characters')
    setPwLoading(true)
    try {
      await authService.changePassword(pw.current, pw.next)
      toast.success('Password changed successfully')
      setPw({ current: '', next: '', confirm: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setPwLoading(false)
    }
  }

  /* ── logout ── */
  const handleLogout = () => { logout(); navigate('/login'); toast.success('Logged out') }

  /* ── delete account ── */
  const [deleteStep, setDeleteStep]         = useState(0)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleteLoading, setDeleteLoading]   = useState(false)

  const cancelDelete = () => { setDeleteStep(0); setDeletePassword(''); setDeleteConfirmText('') }

  const handleDeleteStep1 = async (e) => {
    e.preventDefault()
    if (!deletePassword) return toast.error('Enter your password')
    setDeleteLoading(true)
    try {
      await authService.verifyPassword(deletePassword)
      setDeleteStep(2)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Incorrect password')
    } finally { setDeleteLoading(false) }
  }

  const handleDeleteStep2 = (e) => {
    e.preventDefault()
    if (deleteConfirmText !== 'Delete') return toast.error('Type exactly: Delete')
    setDeleteStep(3)
  }

  const handleDeleteFinal = async () => {
    setDeleteLoading(true)
    try {
      await authService.deleteAccount(deletePassword)
      toast.success('Account permanently deleted')
      logout(); navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account')
      setDeleteLoading(false)
    }
  }

  /* ── notification toggles ── */
  const [notifs, setNotifs] = useState({
    loginAlerts: true,
    weeklyDigest: false,
    productUpdates: true,
    securityAlerts: true,
  })
  const [notifsLoading, setNotifsLoading] = useState(false)

  useEffect(() => {
    authService.getNotificationPreferences()
      .then(data => setNotifs(data))
      .catch(() => {})
  }, [])

  const handleSaveNotifications = async () => {
    setNotifsLoading(true)
    try {
      await authService.updateNotificationPreferences(notifs)
      toast.success('Notification preferences saved')
    } catch {
      toast.error('Failed to save notification preferences')
    } finally {
      setNotifsLoading(false)
    }
  }

  /* ── appearance ── */
  const [theme, setTheme]       = useState('system')
  const [language, setLanguage] = useState('en')
  const [timezone, setTimezone] = useState('UTC')
  const [appearanceLoading, setAppearanceLoading] = useState(false)

  useEffect(() => {
    authService.getAppearancePreferences()
      .then(data => { setTheme(data.theme); setLanguage(data.language); setTimezone(data.timezone) })
      .catch(() => {})
  }, [])

  const handleSaveAppearance = async () => {
    setAppearanceLoading(true)
    try {
      await authService.updateAppearancePreferences({ theme, language, timezone })
      toast.success('Appearance preferences saved')
    } catch {
      toast.error('Failed to save appearance preferences')
    } finally {
      setAppearanceLoading(false)
    }
  }

  /* ── privacy toggles ── */
  const [privacy, setPrivacy] = useState({
    activityLog: true,
    analyticsSharing: false,
    publicProfile: false,
  })
  const [privacyLoading, setPrivacyLoading] = useState(false)

  useEffect(() => {
    authService.getPrivacyPreferences()
      .then(data => setPrivacy(data))
      .catch(() => {})
  }, [])

  const handleSavePrivacy = async () => {
    setPrivacyLoading(true)
    try {
      await authService.updatePrivacyPreferences(privacy)
      toast.success('Privacy preferences saved')
    } catch {
      toast.error('Failed to save privacy preferences')
    } finally {
      setPrivacyLoading(false)
    }
  }

  /* ── groups ── */
  const groups = [...new Set(NAV.map(n => n.group))]

  /* ── content panels per nav ── */
  const renderContent = () => {
    switch (activeNav) {

      /* ══ ACCOUNT ══ */
      case 'account': return (
        <>
          <Section icon={<User />} iconColor="blue" title="Profile information"
            desc="Your name, username and account details" defaultOpen>
            <InfoRow>
              <InfoLabel>Username</InfoLabel>
              <InfoValue>@{user?.username || '—'}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Email address</InfoLabel>
              <InfoValue>{user?.email || '—'}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Account status</InfoLabel>
              <InfoBadge $color="green">Active</InfoBadge>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Plan</InfoLabel>
              <InfoBadge $color="blue">Free</InfoBadge>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Member since</InfoLabel>
              <InfoValue>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                  : '—'}
              </InfoValue>
            </InfoRow>
          </Section>

          <Section icon={<Activity />} iconColor="slate" title="Session"
            desc="Manage your active session">
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 1.25rem', lineHeight: 1.6 }}>
              Logging out ends your current session. You can sign back in any time with your credentials.
            </p>
            <OutlineBtn type="button" onClick={handleLogout}>
              <LogOut /> Sign out
            </OutlineBtn>
          </Section>
        </>
      )

      /* ══ SECURITY ══ */
      case 'security': return (
        <>
          <Section icon={<Key />} iconColor="blue" title="Change password"
            desc="Update your account password" defaultOpen>
            <form onSubmit={handleChangePassword}>
              <PasswordField
                id="cur" label="Current password"
                value={pw.current} onChange={e => setPw(p => ({ ...p, current: e.target.value }))}
                disabled={pwLoading} placeholder="Enter current password"
              />
              <PasswordField
                id="nxt" label="New password"
                value={pw.next} onChange={e => setPw(p => ({ ...p, next: e.target.value }))}
                disabled={pwLoading} placeholder="At least 6 characters"
                hint="Minimum 6 characters."
              />
              <PasswordField
                id="cnf" label="Confirm new password"
                value={pw.confirm} onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))}
                disabled={pwLoading} placeholder="Repeat new password"
              />
              <BtnRow $end>
                <PrimaryBtn type="submit" disabled={pwLoading}>
                  {pwLoading ? <SpinnerIcon /> : <Lock />}
                  {pwLoading ? 'Updating…' : 'Update password'}
                </PrimaryBtn>
              </BtnRow>
            </form>
          </Section>

          <Section icon={<Smartphone />} iconColor="purple" title="Two-factor authentication"
            desc="Add an extra layer of security to your account">
            <InfoRow>
              <InfoLabel>Status</InfoLabel>
              <InfoBadge $color="blue">Not enabled</InfoBadge>
            </InfoRow>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '1rem 0 0', lineHeight: 1.6 }}>
              Two-factor authentication adds an extra step when signing in to keep your account secure.
            </p>
            <BtnRow $end>
              <OutlineBtn type="button" onClick={() => toast('Coming soon!')}>
                <Shield /> Enable 2FA
              </OutlineBtn>
            </BtnRow>
          </Section>

          <Section icon={<Clock />} iconColor="slate" title="Login history"
            desc="Recent sign-in activity on your account">
            {[
              { device: 'Chrome on macOS', location: 'Chennai, IN', time: 'Just now', current: true },
              { device: 'Safari on iPhone', location: 'Chennai, IN', time: '2 days ago' },
            ].map((s, i) => (
              <InfoRow key={i}>
                <InfoLabel>
                  {s.device}
                  {s.current && (
                    <span style={{ marginLeft: 6, fontSize: '0.65rem', color: '#16a34a',
                      background: '#f0fdf4', border: '1px solid #bbf7d0',
                      borderRadius: 20, padding: '1px 7px', fontWeight: 600 }}>
                      Current
                    </span>
                  )}
                  <br />
                  <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>{s.location}</span>
                </InfoLabel>
                <InfoValue style={{ fontSize: '0.78rem', color: '#64748b' }}>{s.time}</InfoValue>
              </InfoRow>
            ))}
          </Section>
        </>
      )

      /* ══ NOTIFICATIONS ══ */
      case 'notifs': return (
        <>
          <Section icon={<Bell />} iconColor="orange" title="Email notifications"
            desc="Choose which emails you receive" defaultOpen>
            <Toggle label="Login alerts" hint="Get notified when your account is accessed"
              value={notifs.loginAlerts}
              onChange={v => setNotifs(p => ({ ...p, loginAlerts: v }))} />
            <Toggle label="Weekly digest" hint="A summary of your vault activity every week"
              value={notifs.weeklyDigest}
              onChange={v => setNotifs(p => ({ ...p, weeklyDigest: v }))} />
            <Toggle label="Product updates" hint="New features and improvements"
              value={notifs.productUpdates}
              onChange={v => setNotifs(p => ({ ...p, productUpdates: v }))} />
            <Toggle label="Security alerts" hint="Critical alerts about your account security"
              value={notifs.securityAlerts}
              onChange={v => setNotifs(p => ({ ...p, securityAlerts: v }))} />
            <BtnRow $end>
              <PrimaryBtn type="button" onClick={handleSaveNotifications} disabled={notifsLoading}>
                {notifsLoading ? <SpinnerIcon /> : <Check />}
                {notifsLoading ? 'Saving…' : 'Save preferences'}
              </PrimaryBtn>
            </BtnRow>
          </Section>
        </>
      )

      /* ══ APPEARANCE ══ */
      case 'appearance': return (
        <>
          <Section icon={<Palette />} iconColor="purple" title="Theme & display"
            desc="Customize how the app looks" defaultOpen>
            <FormGroup>
              <Label>Theme</Label>
              <SelectInput value={theme} onChange={e => setTheme(e.target.value)}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System default</option>
              </SelectInput>
            </FormGroup>
            <FormGroup>
              <Label>Language</Label>
              <SelectInput value={language} onChange={e => setLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="ta">Tamil</option>
                <option value="hi">Hindi</option>
              </SelectInput>
            </FormGroup>
            <FormGroup>
              <Label>Timezone</Label>
              <SelectInput value={timezone} onChange={e => setTimezone(e.target.value)}>
                <option value="UTC">UTC</option>
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </SelectInput>
            </FormGroup>
            <BtnRow $end>
              <PrimaryBtn type="button" onClick={handleSaveAppearance} disabled={appearanceLoading}>
                {appearanceLoading ? <SpinnerIcon /> : <Check />}
                {appearanceLoading ? 'Saving…' : 'Save'}
              </PrimaryBtn>
            </BtnRow>
          </Section>
        </>
      )

      /* ══ PRIVACY ══ */
      case 'privacy': return (
        <>
          <Section icon={<Globe />} iconColor="green" title="Privacy controls"
            desc="Control what data is collected and shared" defaultOpen>
            <Toggle label="Activity log" hint="Keep a log of actions taken in your vault"
              value={privacy.activityLog}
              onChange={v => setPrivacy(p => ({ ...p, activityLog: v }))} />
            <Toggle label="Analytics sharing" hint="Help improve the app by sharing usage data"
              value={privacy.analyticsSharing}
              onChange={v => setPrivacy(p => ({ ...p, analyticsSharing: v }))} />
            <Toggle label="Public profile" hint="Allow others to find your public portfolio"
              value={privacy.publicProfile}
              onChange={v => setPrivacy(p => ({ ...p, publicProfile: v }))} />
            <BtnRow $end>
              <PrimaryBtn type="button" onClick={handleSavePrivacy} disabled={privacyLoading}>
                {privacyLoading ? <SpinnerIcon /> : <Check />}
                {privacyLoading ? 'Saving…' : 'Save'}
              </PrimaryBtn>
            </BtnRow>
          </Section>
        </>
      )

      /* ══ DANGER ZONE ══ */
      case 'danger': return (
        <>
          <Section icon={<LogOut />} iconColor="slate" title="Sign out"
            desc="End your current session">
            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 1.25rem', lineHeight: 1.6 }}>
              Logging out ends your current session securely. You can sign back in any time.
            </p>
            <OutlineBtn type="button" onClick={handleLogout}>
              <LogOut /> Sign out of account
            </OutlineBtn>
          </Section>

          <Section icon={<ShieldAlert />} iconColor="red" title="Delete account"
            desc="Permanently erase your account and all data" danger>
            {deleteStep === 0 && (
              <>
                <WarningBox>
                  <AlertTriangle />
                  <p>
                    This action is <strong>irreversible</strong>. All vault items, portfolio data,
                    and files will be permanently erased with no way to recover them.
                  </p>
                </WarningBox>
                <OutlineDangerBtn type="button" onClick={() => setDeleteStep(1)}>
                  <Trash2 /> I want to delete my account
                </OutlineDangerBtn>
              </>
            )}

            {deleteStep >= 1 && (
              <>
                <StepRow>
                  {['Verify', 'Confirm', 'Delete'].map((lbl, i) => (
                    <Step key={lbl} $done={deleteStep > i + 1}>
                      <StepDot $active={deleteStep === i + 1} $done={deleteStep > i + 1}>
                        {deleteStep > i + 1 ? <CheckCircle2 /> : i + 1}
                      </StepDot>
                      <StepLabel $active={deleteStep === i + 1}>{lbl}</StepLabel>
                    </Step>
                  ))}
                </StepRow>

                {deleteStep === 1 && (
                  <form onSubmit={handleDeleteStep1}>
                    <PasswordField
                      id="dpw" label="Enter your password to continue"
                      value={deletePassword}
                      onChange={e => setDeletePassword(e.target.value)}
                      disabled={deleteLoading} placeholder="Your account password"
                    />
                    <BtnRow>
                      <OutlineDangerBtn type="button" onClick={cancelDelete} style={{ flex: 1 }}>Cancel</OutlineDangerBtn>
                      <DangerBtn type="submit" disabled={deleteLoading} style={{ flex: 1 }}>
                        {deleteLoading ? <SpinnerIcon /> : null}
                        {deleteLoading ? 'Verifying…' : 'Continue →'}
                      </DangerBtn>
                    </BtnRow>
                  </form>
                )}

                {deleteStep === 2 && (
                  <form onSubmit={handleDeleteStep2}>
                    <FormGroup>
                      <Label>Type <strong style={{ color: '#dc2626', fontFamily: 'Courier New' }}>Delete</strong> to confirm</Label>
                      <ConfirmInput
                        type="text" placeholder='Type "Delete" here'
                        value={deleteConfirmText}
                        onChange={e => setDeleteConfirmText(e.target.value)}
                        autoComplete="off"
                      />
                    </FormGroup>
                    <BtnRow>
                      <OutlineDangerBtn type="button" onClick={cancelDelete} style={{ flex: 1 }}>Cancel</OutlineDangerBtn>
                      <DangerBtn type="submit" disabled={deleteConfirmText !== 'Delete'} style={{ flex: 1 }}>
                        Continue →
                      </DangerBtn>
                    </BtnRow>
                  </form>
                )}

                {deleteStep === 3 && (
                  <>
                    <WarningBox>
                      <AlertTriangle />
                      <p>
                        You are about to <strong>permanently delete</strong> the account{' '}
                        <strong>@{user?.username}</strong>. This cannot be undone.
                      </p>
                    </WarningBox>
                    <BtnRow>
                      <OutlineDangerBtn type="button" onClick={cancelDelete} style={{ flex: 1 }}>Cancel</OutlineDangerBtn>
                      <DangerBtn type="button" onClick={handleDeleteFinal} disabled={deleteLoading} style={{ flex: 1 }}>
                        {deleteLoading ? <SpinnerIcon /> : <Trash2 />}
                        {deleteLoading ? 'Deleting…' : 'Delete permanently'}
                      </DangerBtn>
                    </BtnRow>
                  </>
                )}
              </>
            )}
          </Section>
        </>
      )

      default: return null
    }
  }

  return (
    <Root>
      {/* ── Sidebar ── */}
      <Sidebar>
        {groups.map(group => (
          <SidebarSection key={group}>
            <SidebarLabel>{group}</SidebarLabel>
            {NAV.filter(n => n.group === group).map(n => (
              <NavItem
                key={n.id}
                $active={activeNav === n.id}
                onClick={() => setActiveNav(n.id)}
              >
                {n.icon}
                {n.label}
                <NavDot $active={activeNav === n.id} />
              </NavItem>
            ))}
          </SidebarSection>
        ))}
      </Sidebar>

      {/* ── Content panels ── */}
      <Content>
        {renderContent()}
      </Content>
    </Root>
  )
}

export default SettingsPage