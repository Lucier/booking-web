import { useState } from 'react'
import { Calendar, Clock, MapPin, Trash2 } from 'lucide-react'
import type { Booking } from '@/types'
import { bookingsApi } from '@/api/bookings'
import { useAuthStore } from '@/store/auth.store'
import { useToast } from '@/contexts/ToastContext'
import { getApiErrorMessage } from '@/utils/errors'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { formatDateShort, formatTime, isBookingToday, isBookingFuture } from '@/utils/dates'

interface BookingListProps {
  bookings: Booking[]
  onRefetch: () => void
  showUser?: boolean
  emptyTitle?: string
  emptyDescription?: string
  emptyAction?: React.ReactNode
}

function BookingStatusBadge({ date }: { date: string }) {
  if (isBookingToday(date)) return <Badge variant="info">Hoje</Badge>
  if (isBookingFuture(date)) return <Badge variant="success">Futuro</Badge>
  return <Badge variant="default">Passado</Badge>
}

export function BookingList({
  bookings,
  onRefetch,
  showUser,
  emptyTitle = 'Nenhum agendamento',
  emptyDescription,
  emptyAction,
}: BookingListProps) {
  const { user } = useAuthStore()
  const toast = useToast()
  const [cancelId, setCancelId] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState(false)

  const canCancel = (booking: Booking) =>
    user?.role === 'ADMIN' || booking.user_id === user?.id

  const handleCancel = async () => {
    if (!cancelId) return
    setCancelling(true)
    try {
      await bookingsApi.cancel(cancelId)
      toast.success('Agendamento cancelado')
      setCancelId(null)
      onRefetch()
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Erro ao cancelar agendamento'))
    } finally {
      setCancelling(false)
    }
  }

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={Calendar}
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    )
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <Card.Body className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 shrink-0">
                <Calendar className="h-6 w-6 text-indigo-600" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {booking.location && (
                    <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                      <MapPin className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                      {booking.location.name}
                    </div>
                  )}
                  <BookingStatusBadge date={booking.date} />
                </div>

                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {formatDateShort(booking.date)}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {formatTime(booking.start_time)} – {formatTime(booking.end_time)}
                  </span>
                  {showUser && booking.user && (
                    <span className="text-xs text-gray-400">
                      por {booking.user.name}
                    </span>
                  )}
                </div>
              </div>

              {canCancel(booking) && isBookingFuture(booking.date) && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Trash2 className="h-4 w-4" />}
                  onClick={() => setCancelId(booking.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"
                >
                  Cancelar
                </Button>
              )}
            </Card.Body>
          </Card>
        ))}
      </div>

      <ConfirmDialog
        open={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={handleCancel}
        title="Cancelar agendamento"
        description="Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita."
        confirmLabel="Cancelar Agendamento"
        loading={cancelling}
      />
    </>
  )
}
