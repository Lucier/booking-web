import { apiClient } from './client'
import type { LoginResponse, RegisterResponse } from '@/types'

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<LoginResponse>('/auth/login', { email, password }).then((r) => r.data),

  register: (name: string, email: string, password: string) =>
    apiClient.post<RegisterResponse>('/auth/register', { name, email, password }).then((r) => r.data),
}
