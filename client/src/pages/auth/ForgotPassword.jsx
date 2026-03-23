import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { KeyRound, Mail, Calendar, MapPin, Users, Lock, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import api from '../../services/api'

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

  &:hover {
    color: #1e3a8a;
  }
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

    &:hover {
      background: #eff6ff;
      color: #1e40af;
    }
  }
`

const MainContent = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const FormContainer = styled.div`
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 16px;
  padding: 3rem 2.5rem;
  box-shadow: 0 10px 40px rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.1);

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    max-width: 100%;
  }
`

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
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

  svg {
    color: #3b82f6;
  }

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
`

const StepIndicator = styled.div`
  text-align: center;
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 1rem;
  font-weight: 500;
`

const FormSubtitle = styled.p`
  color: #64748b;
  font-size: 0.95rem;
`

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.6rem;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: #3b82f6;
    width: 18px;
    height: 18px;
  }
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

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: #eff6ff;
  }

  &::placeholder {
    color: #94a3b8;
  }

  @media (max-width: 768px) {
    padding: 0.65rem 0.9rem;
    font-size: 0.9rem;
  }
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
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
    background: linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 0.8rem 1.2rem;
    font-size: 0.95rem;
  }
`

const AlertBox = styled.div`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.9rem;
  background: ${props => props.type === 'error' ? '#fef2f2' : '#f0fdf4'};
  border: 1px solid ${props => props.type === 'error' ? '#fecaca' : '#86efac'};
  color: ${props => props.type === 'error' ? '#991b1b' : '#166534'};

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    color: ${props => props.type === 'error' ? '#dc2626' : '#22c55e'};
    margin-top: 2px;
  }
`

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  margin-top: 1.5rem;
  transition: all 0.3s ease;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    color: #1e40af;
    transform: translateX(-4px);
  }
`

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    username: '',
    birthYear: '',
    placeAnswer: '',
    friendAnswer: '',
    newPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const set = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setError('')
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.username || !form.birthYear || !form.placeAnswer || !form.friendAnswer) {
      setError('All fields are required')
      return
    }

    setLoading(true)
    try {
      await api.post('/vault/auth/verify-security', {
        username: form.username,
        birthYear: form.birthYear,
        placeAnswer: form.placeAnswer,
        friendAnswer: form.friendAnswer,
      })
      setSuccess('Identity verified successfully!')
      setTimeout(() => setStep(2), 1000)
    } catch (err) {
      setError(err.response?.data?.message || 'Identity verification failed. Please check your information.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.newPassword) {
      setError('Please enter a new password')
      return
    }

    if (form.newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setLoading(true)
    try {
      await api.post('/vault/auth/reset-password', {
        username: form.username,
        newPassword: form.newPassword
      })
      setSuccess('Password reset successfully! Redirecting to login...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed. Please try again.')
    } finally {
      setLoading(false)
    }
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
            <FormTitle>
              <KeyRound size={32} />
              Reset Password
            </FormTitle>
            <StepIndicator>Step {step} of 2</StepIndicator>
            <FormSubtitle>
              {step === 1
                ? 'Verify your identity using your security questions'
                : 'Create your new password'}
            </FormSubtitle>
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

          {step === 1 ? (
            <form onSubmit={handleVerify}>
              <FormGroup>
                <Label htmlFor="username">
                  <Mail size={18} />
                  Username
                </Label>
                <InputField
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={set('username')}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="birthYear">
                  <Calendar size={18} />
                  Birth Year
                </Label>
                <InputField
                  id="birthYear"
                  type="number"
                  placeholder="e.g. 1995"
                  value={form.birthYear}
                  onChange={set('birthYear')}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="placeAnswer">
                  <MapPin size={18} />
                  Where were you born?
                </Label>
                <InputField
                  id="placeAnswer"
                  type="text"
                  placeholder="Enter your birthplace"
                  value={form.placeAnswer}
                  onChange={set('placeAnswer')}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="friendAnswer">
                  <Users size={18} />
                  Best friend's name?
                </Label>
                <InputField
                  id="friendAnswer"
                  type="text"
                  placeholder="Enter your best friend's name"
                  value={form.friendAnswer}
                  onChange={set('friendAnswer')}
                  required
                />
              </FormGroup>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify Identity'}
              </SubmitButton>
            </form>
          ) : (
            <form onSubmit={handleReset}>
              <FormGroup>
                <Label htmlFor="newPassword">
                  <Lock size={18} />
                  New Password
                </Label>
                <InputField
                  id="newPassword"
                  type="password"
                  placeholder="Enter at least 6 characters"
                  value={form.newPassword}
                  onChange={set('newPassword')}
                  required
                />
              </FormGroup>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </SubmitButton>
            </form>
          )}

          <BackLink to="/login">
            <ArrowLeft />
            Back to login
          </BackLink>
        </FormContainer>
      </MainContent>
    </AuthContainer>
  )
}

export default ForgotPassword
