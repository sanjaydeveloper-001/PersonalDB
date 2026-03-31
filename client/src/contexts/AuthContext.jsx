import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await authService.getMe()
        setUser(userData)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const login = async (username, password) => {
    try {
      const userData = await authService.login({ username, password })
      setUser(userData)
      toast.success('Logged in successfully')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    }
  }

  const register = async (username, password, birthYear, placeAnswer, friendAnswer) => {
    try {
      const userData = await authService.register({
        username, password, birthYear, placeAnswer, friendAnswer,
      })
      setUser(userData)
      toast.success('Account created')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
      toast.success('Logged out')
      navigate('/login')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}