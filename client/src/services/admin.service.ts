import { z } from 'zod'
import api from './api'
import { tokenStore } from './auth.service'

export interface AdminUserSummary {
  id: string
  name: string
  email?: string | null
  phone?: string | null
  role?: string
}

export interface SystemInfo {
  uptime?: string
  version?: string
  env?: string
  adminAccess?: {
    emailCount?: number
    phoneCount?: number
  }
}

const SystemInfoSchema = z.object({
  uptime: z.string().optional(),
  version: z.string().optional(),
  env: z.string().optional(),
  adminAccess: z.object({
    emailCount: z.number().optional(),
    phoneCount: z.number().optional(),
  }).optional(),
})

const AdminUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  role: z.string().optional(),
})

const resolveToken = () => tokenStore.get() ?? undefined

export const adminService = {
  getSystemInfo: async (): Promise<SystemInfo> => {
    return api.get<SystemInfo>('/admin/info', resolveToken(), SystemInfoSchema)
  },

  getUsers: async (): Promise<AdminUserSummary[]> => {
    return api.get<AdminUserSummary[]>('/admin/users', resolveToken(), z.array(AdminUserSchema))
  },

  deleteUser: async (userId: string): Promise<void> => {
    await api.delete<{ deleted: boolean; userId: string }>(`/admin/users/${userId}`, resolveToken())
  },
}

export default adminService
