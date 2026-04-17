import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

/**
 * OAuth Success Callback Page
 * This page is redirected to after successful Google OAuth
 * It extracts the JWT token and user data from URL params
 */
export default function OAuthSuccessPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setUser } = useAuth()

  useEffect(() => {
    try {
      const token = searchParams.get('token')
      const userJson = searchParams.get('user')

      if (!token || !userJson) {
        throw new Error('Missing token or user data')
      }

      // Parse and store user data
      const userData = JSON.parse(decodeURIComponent(userJson))

      // Store JWT token in localStorage
      localStorage.setItem('token', token)

      // Update auth context
      setUser(userData)

      toast.success('Google login successful!')
      navigate('/dashboard')
    } catch (error) {
      console.error('OAuth callback error:', error)
      toast.error('Authentication failed')
      navigate('/login')
    }
  }, [searchParams, setUser, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-gray-600">Completing sign-in...</p>
      </div>
    </div>
  )
}
