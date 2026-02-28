import { z } from 'zod'
import type { User } from '../types'
import api from './api'

const STORAGE_KEY = 'auth_user'

const AuthResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    role: z.enum(['student', 'admin']).optional(),
  }),
})

export const tokenStore = {
  get: () => localStorage.getItem('access_token'),
  set: (t: string) => localStorage.setItem('access_token', t),
  clear: () => localStorage.removeItem('access_token'),
}

const persistUser = (payload: z.infer<typeof AuthResponseSchema>): User => {
  const user: User = {
    id: payload.user.id,
    name: payload.user.name,
    email: payload.user.email,
    role: payload.user.role,
    token: payload.token,
  }

  tokenStore.set(payload.token)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  return user
}

export const authService = {
  loginWithGoogle: async (idToken: string): Promise<User> => {
    const res = await api.post('/auth/google', { idToken }, undefined, AuthResponseSchema)
    return persistUser(res)
  },

  login: async (email: string, password: string): Promise<User> => {
    const res = await api.post('/auth/login', { email, password }, undefined, AuthResponseSchema)
    return persistUser(res)
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    const res = await api.post('/auth/register', { name, email, password }, undefined, AuthResponseSchema)
    return persistUser(res)
  },

  logout: (): void => {
    tokenStore.clear()
    localStorage.removeItem(STORAGE_KEY)
  },

  getStoredUser: (): User | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null

      const parsed = JSON.parse(raw) as User
      return parsed && parsed.id && parsed.email && parsed.token ? parsed : null
    } catch {
      return null
    }
  },
}

export default authService
