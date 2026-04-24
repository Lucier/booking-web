import { apiClient } from './client'
import type { Booking, AvailabilitySlot } from '@/types'
import { toApiDate } from '@/utils/dates'

export interface CreateBookingPayload {
  location_id: string
  date: string
  start_time: string
  end_time: string
}

export const bookingsApi = {
  list: () =>
    apiClient.get<Booking[]>('/bookings').then((r) => r.data),

  mine: () =>
    apiClient.get<Booking[]>('/bookings/me').then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Booking>(`/bookings/${id}`).then((r) => r.data),

  byLocation: (locationId: string) =>
    apiClient.get<Booking[]>(`/bookings/location/${locationId}`).then((r) => r.data),

  availability: (locationId: string, date: string) =>
    apiClient
      .get<AvailabilitySlot[]>('/bookings/availability', {
        params: { locationId, date: toApiDate(date) },
      })
      .then((r) => Array.isArray(r.data) ? r.data : []),

  create: (payload: CreateBookingPayload) =>
    apiClient
      .post<Booking>('/bookings', { ...payload, date: toApiDate(payload.date) })
      .then((r) => r.data),

  cancel: (id: string) =>
    apiClient.delete(`/bookings/${id}`).then((r) => r.data),
}
