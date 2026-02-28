import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react'
import type { AuthContextValue, User } from '../../types'
import { authService } from '../../services/auth.service'
import { setApiAuthFailureHandler } from '../../services/api'

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(() => authService.getStoredUser())
  const [isGuest, setIsGuest] = useState(false)

  const login = useCallback(async (identifier: string, password: string): Promise<User> => {
    const u = await authService.login(identifier, password)
    setUser(u)
    setIsGuest(false)
    return u
  }, [])

  const loginWithGoogle = useCallback(async (idToken: string): Promise<User> => {
    const u = await authService.loginWithGoogle(idToken)
    setUser(u)
    setIsGuest(false)
    return u
  }, [])

  const register = useCallback(async (name: string, email: string, password: string): Promise<User> => {
    const u = await authService.register(name, email, password)
    setUser(u)
    setIsGuest(false)
    return u
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
    setIsGuest(false)
  }, [])

  const continueAsGuest = useCallback(() => {
    setIsGuest(true)
    setUser(null)
  }, [])

  useEffect(() => {
    setApiAuthFailureHandler(() => {
      authService.logout()
      setUser(null)
      setIsGuest(false)
    })

    return () => {
      setApiAuthFailureHandler(null)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, isGuest, login, loginWithGoogle, register, logout, continueAsGuest }}>
      {children}
    </AuthContext.Provider>
  )
}
