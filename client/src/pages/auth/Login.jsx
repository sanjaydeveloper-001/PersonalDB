import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { LogIn, Mail, Lock, AlertCircle, CheckCircle, Loader, Eye, EyeOff } from 'lucide-react'
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
  max-width: 450px;
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

const FooterLinks = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  a { color: #3b82f6; text-decoration: none; font-weight: 500; font-size: 0.9rem; transition: color 0.3s ease; &:hover { color: #1e40af; } }
`

const SignUpLink = styled.div`
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

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    // Any other initialization can go here if needed
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!username || !password) {
      setError('Please enter both username and password')
      return
    }

    setLoading(true)
    try {
      await login(username, password)
      setSuccess('Login successful! Redirecting...')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please check your credentials.')
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
          <Link to="/register">Sign Up</Link>
        </HeaderLinks>
      </Header>

      <MainContent>
        <FormContainer>
          <FormHeader>
            <FormTitle><LogIn size={32} /> Sign In</FormTitle>
            <FormSubtitle>Access your PersonalDB account</FormSubtitle>
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
              <Label htmlFor="username"><Mail size={18} /> Username</Label>
              <InputField
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password"><Lock size={18} /> Password</Label>
              <PasswordWrapper>
                <InputField
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </FormGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <LogIn size={18} />}
              {loading ? 'Signing in…' : 'Sign In'}
            </SubmitButton>
          </form>

          <Divider>
            <span>Or continue with</span>
          </Divider>

          <GoogleButtonWrapper>
            <GoogleLoginButton text="Sign in with Google" className="w-full" />
          </GoogleButtonWrapper>

          <FooterLinks>
            <Link to="/forgot-password">Forgot password?</Link>
            <Link to="/register">Create account</Link>
          </FooterLinks>

          <SignUpLink>
            Don't have an account? <Link to="/register">Sign up here</Link>
          </SignUpLink>
        </FormContainer>
      </MainContent>
    </AuthContainer>
  )
}

export default Login