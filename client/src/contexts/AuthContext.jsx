import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [requires2FA, setRequires2FA] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await authService.getMe()
        setUser(userData)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const login = async (username, password) => {
    const result = await authService.login({ username, password })
    
    // Check if 2FA is required
    if (result.requires2FA) {
      setRequires2FA(true)
      return { requires2FA: true }
    }

    // Normal login (no 2FA)
    setUser(result)
    toast.success('Logged in successfully')
    navigate('/dashboard')
    return result
  }

  const verify2FA = async ({ otp, backupCode }) => {
    const userData = await authService.verify2FALogin({ otp, backupCode })
    setUser(userData)
    setRequires2FA(false)
    toast.success('Logged in successfully')
    navigate('/dashboard')
  }

  const register = async ({ username, password, birthYear, email }) => {
    const userData = await authService.register({ username, password, birthYear, email })
    setUser(userData)
    toast.success('Account created successfully')
    navigate('/dashboard')
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch {
      // swallow — cookie will be cleared by backend regardless
    }
    setUser(null)
    toast.success('Logged out')
    navigate('/login')
  }

  // Refresh user data (e.g., after auth state changes)
  const refreshUser = async () => {
    try {
      const userData = await authService.getMe()
      setUser(userData)
    } catch {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, refreshUser, requires2FA, verify2FA }}>
      {children}
    </AuthContext.Provider>
  )
}