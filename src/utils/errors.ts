import type { AxiosError } from 'axios'
import type { ApiError } from '@/types'

export function getApiErrorMessage(err: unknown, fallback = 'Ocorreu um erro. Tente novamente.'): string {
  const axiosError = err as AxiosError<ApiError>
  const data = axiosError?.response?.data
  if (!data) return fallback
  const msg = data.message
  if (Array.isArray(msg)) return msg[0] ?? fallback
  return msg ?? fallback
}
