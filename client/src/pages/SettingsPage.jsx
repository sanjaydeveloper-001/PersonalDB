import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Lock, LogOut, Trash2, Eye, EyeOff, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

// ── Layout ──────────────────────────────────────────────────────────────────
const PageWrap = styled.div`
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const PageHeader = styled.div`
  margin-bottom: 0.25rem;
`

const PageTitle = styled.h1`
  font-size: 1.625rem; font-weight: 700; color: #0f172a; margin: 0 0 0.25rem 0;
`

const PageDesc = styled.p`
  font-size: 0.875rem; color: #64748b; margin: 0;
`

// ── Card ─────────────────────────────────────────────────────────────────────
const Card = styled.div`
  background: white;
  border: 1px solid ${props => props.$danger ? 'rgba(220,38,38,0.15)' : 'rgba(59,130,246,0.1)'};
  border-radius: 14px;
  overflow: hidden;
`

const CardHead = styled.div`
  display: flex; align-items: center; gap: 0.625rem;
  padding: 1.1rem 1.5rem;
  border-bottom: 1px solid ${props => props.$danger ? '#fee2e2' : '#f1f5f9'};
  background: ${props => props.$danger ? '#fff5f5' : 'transparent'};

  svg { width: 17px; height: 17px; color: ${props => props.$danger ? '#dc2626' : '#3b82f6'}; }
`

const CardHeadTitle = styled.h2`
  font-size: 0.9rem; font-weight: 600;
  color: ${props => props.$danger ? '#dc2626' : '#0f172a'};
  margin: 0;
`

const CardBody = styled.div`
  padding: 1.5rem;
`

// ── Form elements ────────────────────────────────────────────────────────────
const FormGroup = styled.div`
  display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.1rem;
  &:last-of-type { margin-bottom: 1.5rem; }
`

const Label = styled.label`
  font-size: 0.8rem; font-weight: 600; color: #374151;
`

const InputWrap = styled.div`
  position: relative;
`

const Input = styled.input`
  width: 100%; padding: 0.625rem 2.5rem 0.625rem 0.875rem;
  border: 1px solid #e2e8f0; border-radius: 8px;
  font-size: 0.9rem; font-family: inherit; color: #0f172a;
  background: white; transition: border-color 0.15s, box-shadow 0.15s;
  box-sizing: border-box;
  &:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
  &:disabled { background: #f8fafc; color: #94a3b8; cursor: not-allowed; }
`

const EyeBtn = styled.button`
  position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer; color: #94a3b8;
  display: flex; align-items: center; padding: 0;
  &:hover { color: #64748b; }
  svg { width: 16px; height: 16px; }
`

const Hint = styled.p`
  font-size: 0.75rem; color: #94a3b8; margin: 0.25rem 0 0 0;
`

// ── Buttons ──────────────────────────────────────────────────────────────────
const Btn = styled.button`
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  width: 100%; padding: 0.7rem 1.25rem;
  border: none; border-radius: 8px;
  font-size: 0.875rem; font-weight: 600; cursor: pointer;
  transition: all 0.15s;
  svg { width: 16px; height: 16px; }

  &:disabled { opacity: 0.55; cursor: not-allowed; }
`

const PrimaryBtn = styled(Btn)`
  background: linear-gradient(135deg, #3b82f6, #1e40af); color: white;
  &:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
`

const LogoutBtn = styled(Btn)`
  background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe;
  &:hover:not(:disabled) { background: #dbeafe; }
`

const DangerBtn = styled(Btn)`
  background: #dc2626; color: white;
  &:hover:not(:disabled) { background: #b91c1c; }
`

const OutlineDangerBtn = styled(Btn)`
  background: white; color: #dc2626; border: 1px solid #fecaca;
  &:hover:not(:disabled) { background: #fff5f5; border-color: #dc2626; }
`

// ── Delete account stepper ───────────────────────────────────────────────────
const StepRow = styled.div`
  display: flex; gap: 0; margin-bottom: 1.5rem;
`

const Step = styled.div`
  flex: 1; display: flex; flex-direction: column; align-items: center; position: relative;
  &:not(:last-child)::after {
    content: '';
    position: absolute; top: 14px; left: 50%; right: -50%;
    height: 2px;
    background: ${props => props.$done ? '#3b82f6' : '#e2e8f0'};
    transition: background 0.3s;
    z-index: 0;
  }
`

const StepDot = styled.div`
  width: 28px; height: 28px; border-radius: 50%; z-index: 1;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.75rem; font-weight: 700;
  background: ${props => props.$active ? '#dc2626' : props.$done ? '#3b82f6' : '#e2e8f0'};
  color: ${props => (props.$active || props.$done) ? 'white' : '#94a3b8'};
  transition: background 0.3s;
  svg { width: 13px; height: 13px; }
`

const StepLabel = styled.span`
  font-size: 0.7rem; color: ${props => props.$active ? '#dc2626' : '#94a3b8'};
  margin-top: 0.35rem; text-align: center; font-weight: ${props => props.$active ? '600' : '400'};
`

const WarningBox = styled.div`
  background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px;
  padding: 0.875rem 1rem; margin-bottom: 1.25rem;
  display: flex; gap: 0.625rem;
  svg { width: 17px; height: 17px; color: #ea580c; flex-shrink: 0; margin-top: 1px; }
  p { font-size: 0.825rem; color: #9a3412; margin: 0; line-height: 1.5; }
`

const DeleteConfirmInput = styled(Input)`
  font-family: 'Courier New', monospace;
  text-align: center;
  letter-spacing: 0.1em;
  font-size: 1rem;
  &::placeholder { font-family: inherit; letter-spacing: 0; font-size: 0.85rem; }
`

// ── Password field with show/hide ────────────────────────────────────────────
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
          required
        />
        <EyeBtn type="button" onClick={() => setShow(s => !s)} tabIndex={-1}>
          {show ? <EyeOff /> : <Eye />}
        </EyeBtn>
      </InputWrap>
      {hint && <Hint>{hint}</Hint>}
    </FormGroup>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
const SettingsPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // ── Change password state
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [pwLoading, setPwLoading] = useState(false)

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (pw.next !== pw.confirm) return toast.error('New passwords do not match')
    if (pw.next.length < 6) return toast.error('Password must be at least 6 characters')
    setPwLoading(true)
    try {
      await api.put('/vault/auth/change-password', {
        currentPassword: pw.current,
        newPassword: pw.next,
      })
      toast.success('Password changed successfully')
      setPw({ current: '', next: '', confirm: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setPwLoading(false)
    }
  }

  // ── Logout
  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('Logged out successfully')
  }

  // ── Delete account — 3 steps
  const [deleteStep, setDeleteStep] = useState(0)   // 0 = idle, 1, 2, 3
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)

  const startDelete = () => setDeleteStep(1)
  const cancelDelete = () => { setDeleteStep(0); setDeletePassword(''); setDeleteConfirmText('') }

  const handleDeleteStep1 = async (e) => {
    e.preventDefault()
    if (!deletePassword) return toast.error('Enter your password')
    setDeleteLoading(true)
    try {
      // Verify password by attempting a dummy password-check endpoint
      // or just proceed to step 2 (backend validates on final DELETE)
      await api.post('/vault/auth/verify-password', { password: deletePassword })
      setDeleteStep(2)
    } catch {
      toast.error('Incorrect password')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleDeleteStep2 = (e) => {
    e.preventDefault()
    if (deleteConfirmText !== 'Delete') return toast.error('Type exactly: Delete')
    setDeleteStep(3)
  }

  const handleDeleteFinal = async () => {
    setDeleteLoading(true)
    try {
      await api.delete('/vault/auth/account', {
        data: { password: deletePassword }
      })
      toast.success('Account permanently deleted')
      logout()
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete account')
      setDeleteLoading(false)
    }
  }

  return (
    <PageWrap>
      <PageHeader>
        <PageTitle>Settings</PageTitle>
        <PageDesc>Manage your password, session, and account lifecycle.</PageDesc>
      </PageHeader>

      {/* ── Change password ── */}
      <Card>
        <CardHead>
          <Lock />
          <CardHeadTitle>Change password</CardHeadTitle>
        </CardHead>
        <CardBody>
          <form onSubmit={handleChangePassword}>
            <PasswordField
              id="current" label="Current password"
              value={pw.current} onChange={e => setPw(p => ({ ...p, current: e.target.value }))}
              disabled={pwLoading} placeholder="Enter your current password"
            />
            <PasswordField
              id="next" label="New password"
              value={pw.next} onChange={e => setPw(p => ({ ...p, next: e.target.value }))}
              disabled={pwLoading} placeholder="At least 6 characters"
              hint="Minimum 6 characters."
            />
            <PasswordField
              id="confirm" label="Confirm new password"
              value={pw.confirm} onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))}
              disabled={pwLoading} placeholder="Repeat your new password"
            />
            <PrimaryBtn type="submit" disabled={pwLoading}>
              <Lock />
              {pwLoading ? 'Updating…' : 'Update password'}
            </PrimaryBtn>
          </form>
        </CardBody>
      </Card>

      {/* ── Session ── */}
      <Card>
        <CardHead>
          <LogOut />
          <CardHeadTitle>Session</CardHeadTitle>
        </CardHead>
        <CardBody>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0 0 1.25rem 0', lineHeight: '1.6' }}>
            Logging out will end your current session. You can log back in any time with your credentials.
          </p>
          <LogoutBtn type="button" onClick={handleLogout}>
            <LogOut /> Sign out of PersonalDB
          </LogoutBtn>
        </CardBody>
      </Card>

      {/* ── Delete account ── */}
      <Card $danger>
        <CardHead $danger>
          <ShieldAlert />
          <CardHeadTitle $danger>Delete account</CardHeadTitle>
        </CardHead>
        <CardBody>
          {deleteStep === 0 && (
            <>
              <WarningBox>
                <AlertTriangle />
                <p>
                  This action is <strong>irreversible</strong>. All your vault items, portfolio data,
                  and API keys will be permanently erased with no way to recover them.
                </p>
              </WarningBox>
              <OutlineDangerBtn type="button" onClick={startDelete}>
                <Trash2 /> I want to delete my account
              </OutlineDangerBtn>
            </>
          )}

          {deleteStep >= 1 && (
            <>
              {/* Step indicator */}
              <StepRow>
                {['Verify password', 'Confirm', 'Delete'].map((label, i) => (
                  <Step key={label} $done={deleteStep > i + 1}>
                    <StepDot $active={deleteStep === i + 1} $done={deleteStep > i + 1}>
                      {deleteStep > i + 1 ? <CheckCircle2 /> : i + 1}
                    </StepDot>
                    <StepLabel $active={deleteStep === i + 1}>{label}</StepLabel>
                  </Step>
                ))}
              </StepRow>

              {/* Step 1 — password */}
              {deleteStep === 1 && (
                <form onSubmit={handleDeleteStep1}>
                  <PasswordField
                    id="del-pw" label="Enter your current password to continue"
                    value={deletePassword}
                    onChange={e => setDeletePassword(e.target.value)}
                    disabled={deleteLoading} placeholder="Your account password"
                  />
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <OutlineDangerBtn type="button" onClick={cancelDelete} style={{ flex: 1 }}>
                      Cancel
                    </OutlineDangerBtn>
                    <DangerBtn type="submit" disabled={deleteLoading} style={{ flex: 1 }}>
                      {deleteLoading ? 'Verifying…' : 'Continue →'}
                    </DangerBtn>
                  </div>
                </form>
              )}

              {/* Step 2 — type "Delete" */}
              {deleteStep === 2 && (
                <form onSubmit={handleDeleteStep2}>
                  <FormGroup>
                    <Label htmlFor="del-confirm">
                      Type <strong style={{ color: '#dc2626', fontFamily: 'Courier New' }}>Delete</strong> to confirm
                    </Label>
                    <DeleteConfirmInput
                      id="del-confirm"
                      type="text"
                      placeholder='Type "Delete" here'
                      value={deleteConfirmText}
                      onChange={e => setDeleteConfirmText(e.target.value)}
                      autoComplete="off"
                    />
                  </FormGroup>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <OutlineDangerBtn type="button" onClick={cancelDelete} style={{ flex: 1 }}>
                      Cancel
                    </OutlineDangerBtn>
                    <DangerBtn
                      type="submit"
                      disabled={deleteConfirmText !== 'Delete'}
                      style={{ flex: 1 }}
                    >
                      Continue →
                    </DangerBtn>
                  </div>
                </form>
              )}

              {/* Step 3 — final confirmation */}
              {deleteStep === 3 && (
                <div>
                  <WarningBox>
                    <AlertTriangle />
                    <p>
                      You are about to <strong>permanently delete</strong> the account{' '}
                      <strong>@{user?.username}</strong>. This cannot be undone.
                      Click the button below to proceed.
                    </p>
                  </WarningBox>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <OutlineDangerBtn type="button" onClick={cancelDelete} style={{ flex: 1 }}>
                      Cancel
                    </OutlineDangerBtn>
                    <DangerBtn
                      type="button"
                      onClick={handleDeleteFinal}
                      disabled={deleteLoading}
                      style={{ flex: 1 }}
                    >
                      <Trash2 />
                      {deleteLoading ? 'Deleting…' : 'Delete permanently'}
                    </DangerBtn>
                  </div>
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </PageWrap>
  )
}

export default SettingsPage