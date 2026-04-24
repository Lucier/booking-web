import { apiClient } from './client'
import type { User } from '@/types'

export interface UpdateProfilePayload {
  name?: string
  email?: string
}

export const usersApi = {
  list: () =>
    apiClient.get<User[]>('/users').then((r) => r.data),

  me: () =>
    apiClient.get<User>('/users/me').then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<User>(`/users/${id}`).then((r) => r.data),

  updateMe: (payload: UpdateProfilePayload) =>
    apiClient.patch<User>('/users/me', payload).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/users/${id}`).then((r) => r.data),
}
