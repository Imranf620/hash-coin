// Hook for client-side authentication
// hooks/useAuth.ts
import { useState, useEffect } from 'react'
import AuthService from '@/lib/auth'
import { User } from '@/types/User'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const authService = AuthService.getInstance()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    if (authService.isAuthenticated()) {
      setUser(authService.getUser())
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }

  const login = async (walletAddress: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await authService.login(walletAddress)
      
      if (result.success && result.data) {
        setUser(result.data.user)
        return { success: true }
      } else {
        setError(result.error || 'Login failed')
        return { success: false, error: result.error }
      }
    } catch (error) {
      const errorMessage = 'Login failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    setError(null)
  }

  const updateUser = async (updates: Partial<User>) => {
    try {
      const result = await authService.updateUser(updates)
      
      if (result.success && result.data) {
        setUser(result.data)
        return { success: true, data: result.data }
      } else {
        setError(result.error || 'Update failed')
        return { success: false, error: result.error }
      }
    } catch (error) {
      const errorMessage = 'Update failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const refreshUser = async () => {
    try {
      const result = await authService.fetchUser()
      
      if (result.success && result.data) {
        setUser(result.data)
        setError(null)
        return { success: true, data: result.data }
      } else {
        setError(result.error || 'Refresh failed')
        return { success: false, error: result.error }
      }
    } catch (error) {
      const errorMessage = 'Refresh failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    updateUser,
    refreshUser,
    isAuthenticated: authService.isAuthenticated(),
  }
}