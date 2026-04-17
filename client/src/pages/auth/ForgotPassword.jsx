import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { KeyRound, Mail, ShieldCheck, Lock, AlertCircle, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import { authService } from '../../services/authService'

// ── Styled components ─────────────────────────────────────────────────────────

const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #ffffff 0%, #f0f4f8 100%);
`

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Logo = styled(Link)`
  font-weight: 700;
  font-size: 1.5rem;
  color: #1e40af;
  text-decoration: none;
  transition: color 0.3s ease;
  &:hover { color: #1e3a8a; }
`

const HeaderLinks = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  a {
    text-decoration: none;
    color: #3b82f6;
    font-weight: 500;
    padding: 8px 16px;
    border-radius: 6px;
    transition: all 0.3s ease;
    &:hover { background: #eff6ff; color: #1e40af; }
  }
`

const MainContent = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  @media (max-width: 768px) { padding: 1rem; }
`

const FormContainer = styled.div`
  width: 100%;
  max-width: 460px;
  background: white;
  border-radius: 16px;
  padding: 3rem 2.5rem;
  box-shadow: 0 10px 40px rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.1);
  @media (max-width: 768px) { padding: 2rem 1.5rem; max-width: 100%; }
`

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`

const FormTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  svg { color: #3b82f6; }
  @media (max-width: 768px) { font-size: 1.6rem; }
`

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin: 1rem 0 0.75rem;
`

const StepDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ active }) => active ? '#3b82f6' : '#e2e8f0'};
  transition: background 0.3s ease;
`

const FormSubtitle = styled.p`
  color: #64748b;
  font-size: 0.95rem;
  margin-top: 0.25rem;
`

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.6rem;
  font-size: 0.95rem;
  svg { color: #3b82f6; width: 18px; height: 18px; }
`

const InputField = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  font-size: 0.95rem;
  color: #0f172a;
  background: white;
  transition: all 0.3s ease;
  font-family: inherit;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: #eff6ff;
  }
  &::placeholder { color: #94a3b8; }
  @media (max-width: 768px) { padding: 0.65rem 0.9rem; font-size: 0.9rem; }
`

const OtpInput = styled(InputField)`
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: 0.4em;
  padding: 1rem;
  color: #1e40af;
`

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.9rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
    background: linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%);
  }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
  @media (max-width: 768px) { padding: 0.8rem 1.2rem; font-size: 0.95rem; }
`

const ResendButton = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0;
  margin: 1rem auto 0;
  transition: color 0.3s ease;
  &:hover:not(:disabled) { color: #1e40af; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
  svg { width: 16px; height: 16px; }
`

const AlertBox = styled.div`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.9rem;
  background: ${({ type }) => type === 'error' ? '#fef2f2' : '#f0fdf4'};
  border: 1px solid ${({ type }) => type === 'error' ? '#fecaca' : '#86efac'};
  color: ${({ type }) => type === 'error' ? '#991b1b' : '#166534'};
  svg { width: 20px; height: 20px; flex-shrink: 0; color: ${({ type }) => type === 'error' ? '#dc2626' : '#22c55e'}; margin-top: 2px; }
`

const InfoBox = styled.div`
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 0.875rem 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  color: #1e40af;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
`

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  svg { width: 16px; height: 16px; }
  &:hover { color: #1e40af; transform: translateX(-4px); }
`

// ── Component ─────────────────────────────────────────────────────────────────

const STEPS = {
  EMAIL: 1,
  OTP: 2,
  RESET: 3,
}

const ForgotPassword = () => {
  const navigate = useNavigate()

  const [step, setStep] = useState(STEPS.EMAIL)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [resetToken, setResetToken] = useState(null)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const clearMessages = () => { setError(''); setSuccess('') }

  // Step 1 — send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault()
    clearMessages()
    if (!email) { setError('Please enter your email address'); return }

    setLoading(true)
    try {
      await authService.sendOtp(email)
      setSuccess('OTP sent! Check your inbox (and spam folder).')
      setTimeout(() => { setSuccess(''); setStep(STEPS.OTP) }, 1200)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2 — verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    clearMessages()
    if (!otp || otp.length !== 6) { setError('Please enter the 6-digit OTP'); return }

    setLoading(true)
    try {
      const data = await authService.verifyOtp(email, otp)
      setResetToken(data.resetToken)
      setSuccess('OTP verified! Set your new password.')
      setTimeout(() => { setSuccess(''); setStep(STEPS.RESET) }, 1000)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Step 3 — reset password
  const handleResetPassword = async (e) => {
    e.preventDefault()
    clearMessages()
    if (!newPassword) { setError('Please enter a new password'); return }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return }

    setLoading(true)
    try {
      await authService.resetPassword(newPassword, resetToken)
      setSuccess('Password reset successfully! Redirecting to login…')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed. Please start over.')
    } finally {
      setLoading(false)
    }
  }

  const stepSubtitles = {
    [STEPS.EMAIL]: 'Enter the email linked to your account',
    [STEPS.OTP]:   `We sent a 6-digit code to ${email}`,
    [STEPS.RESET]: 'Choose a strong new password',
  }

  return (
    <AuthContainer>
      <Header>
        <Logo to="/">PersonalDB</Logo>
        <HeaderLinks>
          <Link to="/">Home</Link>
          <Link to="/login">Sign In</Link>
        </HeaderLinks>
      </Header>

      <MainContent>
        <FormContainer>
          <FormHeader>
            <FormTitle><KeyRound size={32} /> Reset Password</FormTitle>
            <StepIndicator>
              {[STEPS.EMAIL, STEPS.OTP, STEPS.RESET].map(s => (
                <StepDot key={s} active={step >= s} />
              ))}
            </StepIndicator>
            <FormSubtitle>{stepSubtitles[step]}</FormSubtitle>
          </FormHeader>

          {error && (
            <AlertBox type="error">
              <AlertCircle />
              {error}
            </AlertBox>
          )}

          {success && (
            <AlertBox type="success">
              <CheckCircle />
              {success}
            </AlertBox>
          )}

          {/* ── Step 1: Email ────────────────────────────────────────────── */}
          {step === STEPS.EMAIL && (
            <form onSubmit={handleSendOtp}>
              <FormGroup>
                <Label htmlFor="email"><Mail size={18} /> Email Address</Label>
                <InputField
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearMessages() }}
                  required
                  autoFocus
                />
              </FormGroup>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? 'Sending OTP…' : 'Send OTP'}
              </SubmitButton>
            </form>
          )}

          {/* ── Step 2: OTP ──────────────────────────────────────────────── */}
          {step === STEPS.OTP && (
            <>
              <InfoBox>
                <ShieldCheck size={16} style={{ flexShrink: 0, marginTop: 2 }} />
                The OTP is valid for <strong>&nbsp;10 minutes</strong>. Enter it below.
              </InfoBox>

              <form onSubmit={handleVerifyOtp}>
                <FormGroup>
                  <Label htmlFor="otp"><ShieldCheck size={18} /> One-Time Password</Label>
                  <OtpInput
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '')); clearMessages() }}
                    required
                    autoFocus
                  />
                </FormGroup>

                <SubmitButton type="submit" disabled={loading || otp.length !== 6}>
                  {loading ? 'Verifying…' : 'Verify OTP'}
                </SubmitButton>
              </form>

              <ResendButton
                type="button"
                disabled={loading}
                onClick={async () => {
                  clearMessages()
                  setLoading(true)
                  try {
                    await authService.sendOtp(email)
                    setSuccess('New OTP sent!')
                    setTimeout(() => setSuccess(''), 3000)
                  } catch (err) {
                    setError(err.response?.data?.message || 'Failed to resend OTP.')
                  } finally {
                    setLoading(false)
                  }
                }}
              >
                <RefreshCw />
                Resend OTP
              </ResendButton>
            </>
          )}

          {/* ── Step 3: New password ─────────────────────────────────────── */}
          {step === STEPS.RESET && (
            <form onSubmit={handleResetPassword}>
              <FormGroup>
                <Label htmlFor="newPassword"><Lock size={18} /> New Password</Label>
                <InputField
                  id="newPassword"
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); clearMessages() }}
                  required
                  autoFocus
                />
              </FormGroup>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? 'Resetting…' : 'Reset Password'}
              </SubmitButton>
            </form>
          )}

          <div>
            <BackLink to="/login">
              <ArrowLeft />
              Back to login
            </BackLink>
          </div>
        </FormContainer>
      </MainContent>
    </AuthContainer>
  )
}

export default ForgotPassword