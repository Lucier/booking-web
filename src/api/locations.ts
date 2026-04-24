import { apiClient } from './client'
import type { Location } from '@/types'

export const locationsApi = {
  list: () =>
    apiClient.get<Location[]>('/locations').then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Location>(`/locations/${id}`).then((r) => r.data),

  create: (name: string) =>
    apiClient.post<Location>('/locations', { name }).then((r) => r.data),

  delete: (id: string) =>
    apiClient.delete(`/locations/${id}`).then((r) => r.data),
}
