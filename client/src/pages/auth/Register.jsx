import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { UserPlus, User, Mail, Lock, Calendar, AlertCircle, CheckCircle, Loader, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import GoogleLoginButton from '../../components/common/GoogleLoginButton'

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
  max-width: 480px;
  background: white;
  border-radius: 16px;
  padding: 3rem 2.5rem;
  box-shadow: 0 10px 40px rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.1);
  @media (max-width: 768px) { padding: 2rem 1.5rem; max-width: 100%; }
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
  svg { color: #3b82f6; }
  @media (max-width: 768px) { font-size: 1.6rem; }
`

const FormSubtitle = styled.p`
  color: #64748b;
  font-size: 0.95rem;
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

const OptionalTag = styled.span`
  font-weight: 400;
  color: #94a3b8;
  font-size: 0.8rem;
  margin-left: 4px;
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

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`

const PasswordToggleButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;
  
  &:hover {
    color: #3b82f6;
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`

const ValidationMessage = styled.div`
  font-size: 0.85rem;
  margin-top: 0.4rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: ${({ type }) => type === 'error' ? '#dc2626' : '#16a34a'};
  
  svg {
    width: 14px;
    height: 14px;
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
  &:disabled { opacity: 0.6; cursor: not-allowed; }
  @media (max-width: 768px) { padding: 0.8rem 1.2rem; font-size: 0.95rem; }
`

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
  &::before, &::after { content: ''; flex: 1; height: 1px; background: rgba(59, 130, 246, 0.15); }
  span { color: #94a3b8; font-size: 0.85rem; white-space: nowrap; }
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

const SignInLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: #64748b;
  font-size: 0.95rem;
  a { color: #3b82f6; text-decoration: none; font-weight: 600; transition: color 0.3s ease; &:hover { color: #1e40af; } }
`

const GoogleButtonWrapper = styled.div`
  margin-top: 2rem;
`

// ── Component ─────────────────────────────────────────────────────────────────

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthYear: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    // Any other initialization can go here if needed
  }, [])

  // Validation functions
  const validateUsername = (username) => {
    if (!username) return 'Username is required'
    if (username.length < 3) return 'Username must be at least 3 characters'
    if (username.length > 19) return 'Username must be less than 20 characters'
    return ''
  }

  const validateEmail = (email) => {
    if (!email) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Invalid email format'
    return ''
  }

  const validatePassword = (password) => {
    if (!password) return 'Password is required'
    if (password.length < 6) return 'Password must be at least 6 characters'
    if (password.length > 19) return 'Password must be less than 20 characters'
    return ''
  }

  const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) return 'Confirm password is required'
    if (password !== confirmPassword) return 'Passwords do not match'
    return ''
  }

  const set = (field) => (e) => {
    const value = e.target.value
    setForm(prev => ({ ...prev, [field]: value }))
    
    // Real-time validation
    let error = ''
    if (field === 'username') {
      error = validateUsername(value)
    } else if (field === 'email') {
      error = validateEmail(value)
    } else if (field === 'password') {
      error = validatePassword(value)
      // Also validate confirm password if it exists
      if (form.confirmPassword && form.confirmPassword !== value) {
        setFieldErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }))
      } else if (form.confirmPassword && form.confirmPassword === value) {
        setFieldErrors(prev => ({ ...prev, confirmPassword: '' }))
      }
    } else if (field === 'confirmPassword') {
      error = validateConfirmPassword(form.password, value)
    }
    
    setFieldErrors(prev => ({ ...prev, [field]: error }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validate all fields
    const usernameError = validateUsername(form.username)
    const emailError = validateEmail(form.email)
    const passwordError = validatePassword(form.password)
    const confirmPasswordError = validateConfirmPassword(form.password, form.confirmPassword)

    setFieldErrors({
      username: usernameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    })

    if (usernameError || emailError || passwordError || confirmPasswordError) {
      setError('Please fix all errors before submitting')
      return
    }

    setLoading(true)
    try {
      await register({
        username:  form.username,
        password:  form.password,
        birthYear: form.birthYear || undefined,
        email:     form.email,
      })
      setSuccess('Account created successfully! Redirecting…')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.')
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
            <FormTitle><UserPlus size={32} /> Create Account</FormTitle>
            <FormSubtitle>Join PersonalDB and secure your digital identity</FormSubtitle>
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

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="username"><User size={18} /> Username</Label>
              <InputField
                id="username"
                type="text"
                placeholder="3-19 characters"
                value={form.username}
                onChange={set('username')}
                required
              />
              {fieldErrors.username && (
                <ValidationMessage type="error">
                  {fieldErrors.username}
                </ValidationMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="email">
                <Mail size={18} />
                Email
              </Label>
              <InputField
                id="email"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={set('email')}
                required
              />
              {fieldErrors.email && (
                <ValidationMessage type="error">
                  {fieldErrors.email}
                </ValidationMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password"><Lock size={18} /> Password</Label>
              <PasswordWrapper>
                <InputField
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="6-19 characters"
                  value={form.password}
                  onChange={set('password')}
                  required
                />
                <PasswordToggleButton
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </PasswordToggleButton>
              </PasswordWrapper>
              {fieldErrors.password && (
                <ValidationMessage type="error">
                  {fieldErrors.password}
                </ValidationMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="confirmPassword"><Lock size={18} /> Confirm Password</Label>
              <PasswordWrapper>
                <InputField
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  required
                />
                <PasswordToggleButton
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </PasswordToggleButton>
              </PasswordWrapper>
              {fieldErrors.confirmPassword && (
                <ValidationMessage type="error">
                  {fieldErrors.confirmPassword}
                </ValidationMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label htmlFor="birthYear">
                <Calendar size={18} />
                Birth Year <OptionalTag>(optional)</OptionalTag>
              </Label>
              <InputField
                id="birthYear"
                type="number"
                placeholder="e.g. 1995"
                value={form.birthYear}
                onChange={set('birthYear')}
                min="1900"
                max={new Date().getFullYear()}
              />
            </FormGroup>

            <SubmitButton 
              type="submit" 
              disabled={loading || Object.values(fieldErrors).some(err => err) || !form.username || !form.email || !form.password || !form.confirmPassword}
            >
              {loading ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <UserPlus size={18} />}
              {loading ? 'Creating Account…' : 'Create Account'}
            </SubmitButton>
          </form>

          <Divider>
            <span>Or continue with</span>
          </Divider>

          <GoogleButtonWrapper>
            <GoogleLoginButton text="Sign up with Google" className="w-full" />
          </GoogleButtonWrapper>

          <SignInLink>
            Already have an account? <Link to="/login">Sign in here</Link>
          </SignInLink>
        </FormContainer>
      </MainContent>
    </AuthContainer>
  )
}

export default Register