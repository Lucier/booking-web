import { format, parseISO, isToday, isFuture, isPast } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function formatDate(dateStr: string): string {
  try {
    const date = parseISO(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`)
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  } catch {
    return dateStr
  }
}

export function formatDateShort(dateStr: string): string {
  try {
    const date = parseISO(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`)
    return format(date, 'dd/MM/yyyy', { locale: ptBR })
  } catch {
    return dateStr
  }
}

export function formatDateTime(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  } catch {
    return dateStr
  }
}

export function formatTime(timeStr: string): string {
  if (!timeStr) return ''
  const match = timeStr.match(/(\d{2}):(\d{2})/)
  return match ? `${match[1]}:${match[2]}` : timeStr
}

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

// Converts YYYY-MM-DD (HTML input) to DD-MM-YYYY (API format)
export function toApiDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  return `${day}-${month}-${year}`
}

export function isBookingToday(dateStr: string): boolean {
  try {
    const date = parseISO(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`)
    return isToday(date)
  } catch {
    return false
  }
}

export function isBookingFuture(dateStr: string): boolean {
  try {
    const date = parseISO(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`)
    return isFuture(date) || isToday(date)
  } catch {
    return false
  }
}

export function isBookingPast(dateStr: string): boolean {
  try {
    const date = parseISO(dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`)
    return isPast(date) && !isToday(date)
  } catch {
    return false
  }
}
