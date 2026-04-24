import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, MapPin, Plus } from 'lucide-react'
import { locationsApi } from '@/api/locations'
import { bookingsApi } from '@/api/bookings'
import { useApi } from '@/hooks/useApi'
import { Card } from '@/components/ui/Card'
import { LinkButton } from '@/components/ui/LinkButton'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDateShort, formatTime, isBookingFuture, isBookingToday, todayISO } from '@/utils/dates'

export function LocationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [availDate, setAvailDate] = useState(todayISO())

  const { data: location, loading: loadingLoc } = useApi(
    () => locationsApi.getById(id!),
    [id]
  )
  const { data: bookings, loading: loadingBookings } = useApi(
    () => bookingsApi.byLocation(id!),
    [id]
  )
  const { data: availability, loading: loadingAvail } = useApi(
    () => bookingsApi.availability(id!, availDate),
    [id, availDate]
  )

  if (loadingLoc) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    )
  }

  if (!location) {
    return (
      <div className="text-center py-20 text-gray-500">Auditório não encontrado</div>
    )
  }

  const upcoming = bookings?.filter((b) => isBookingFuture(b.date)) ?? []
  const past = bookings?.filter((b) => !isBookingFuture(b.date) && !isBookingToday(b.date)) ?? []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          to="/locations"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Auditórios
        </Link>
      </div>

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
            <MapPin className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{location.name}</h2>
            <p className="text-sm text-gray-500">
              {bookings?.length ?? 0} agendamento(s) no total
            </p>
          </div>
        </div>
        <LinkButton to={`/bookings/new?locationId=${location.id}`} icon={<Plus className="h-4 w-4" />}>
          Agendar
        </LinkButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <h3 className="font-semibold text-gray-900">Verificar Disponibilidade</h3>
          </Card.Header>
          <Card.Body>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Data</label>
                <input
                  type="date"
                  value={availDate}
                  min={todayISO()}
                  onChange={(e) => setAvailDate(e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {loadingAvail ? (
                <div className="flex justify-center py-6">
                  <Spinner />
                </div>
              ) : !availability || availability.length === 0 ? (
                <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700 text-center">
                  Nenhum agendamento nesta data — auditório disponível!
                </div>
              ) : (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Horários já reservados:</p>
                  <div className="flex flex-col gap-2">
                    {availability.map((slot, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 px-3 py-2"
                      >
                        <Clock className="h-4 w-4 text-red-500 shrink-0" />
                        <span className="text-sm text-red-700">
                          {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                        </span>
                        <Badge variant="danger" className="ml-auto">Ocupado</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h3 className="font-semibold text-gray-900">Próximos Agendamentos</h3>
            <Badge variant="info">{upcoming.length}</Badge>
          </Card.Header>
          <Card.Body className="p-0">
            {loadingBookings ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : upcoming.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="Sem agendamentos futuros"
                className="py-8"
              />
            ) : (
              <ul className="divide-y divide-gray-100">
                {upcoming.slice(0, 8).map((booking) => (
                  <li key={booking.id} className="flex items-center justify-between px-6 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDateShort(booking.date)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTime(booking.start_time)} – {formatTime(booking.end_time)}
                      </p>
                    </div>
                    {isBookingToday(booking.date) && <Badge variant="info">Hoje</Badge>}
                  </li>
                ))}
              </ul>
            )}
          </Card.Body>
          {past.length > 0 && (
            <Card.Footer>
              <p className="text-xs text-gray-500">{past.length} agendamento(s) passado(s)</p>
            </Card.Footer>
          )}
        </Card>
      </div>
    </div>
  )
}
