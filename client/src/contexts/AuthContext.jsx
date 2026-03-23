import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
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
        const { data } = await api.get('/vault/auth/me')
        setUser(data)
      } catch {
        // not logged in
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const login = async (username, password) => {
    try {
      const { data } = await api.post('/vault/auth/login', { username, password })
      setUser(data)
      toast.success('Logged in successfully')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    }
  }

  const register = async (username, password, birthYear, placeAnswer, friendAnswer) => {
    try {
      const { data } = await api.post('/vault/auth/register', {
        username, password, birthYear, placeAnswer, friendAnswer,
      })
      setUser(data)
      toast.success('Account created')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    }
  }

  const logout = async () => {
    try {
      await api.post('/vault/auth/logout')
      setUser(null)
      toast.success('Logged out')
      navigate('/login')
    } catch {
      toast.error('Logout failed')
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
