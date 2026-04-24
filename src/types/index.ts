export type UserRole = 'USER' | 'ADMIN'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Location {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  user_id: string
  location_id: string
  date: string
  start_time: string
  end_time: string
  created_at: string
  updated_at: string
  user?: User
  location?: Location
}

export interface LoginResponse {
  access_token: string
  user: User
}

export interface RegisterResponse {
  id: string
  name: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface AvailabilitySlot {
  start_time: string
  end_time: string
}

export interface ApiError {
  message: string | string[]
  error?: string
  statusCode: number
}
