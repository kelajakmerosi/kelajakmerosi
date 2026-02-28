import { z } from 'zod'
import api from './api'
import { tokenStore } from './auth.service'

export interface AdminUserSummary {
  id: string
  name: string
  email: string
  role?: string
}

export interface SystemInfo {
  uptime?: string
  version?: string
  env?: string
}

const SystemInfoSchema = z.object({
  uptime: z.string().optional(),
  version: z.string().optional(),
  env: z.string().optional(),
})

const AdminUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
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
}

export default adminService
