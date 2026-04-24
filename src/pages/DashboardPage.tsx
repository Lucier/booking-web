import { Calendar, MapPin, CalendarDays, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { bookingsApi } from '@/api/bookings'
import { locationsApi } from '@/api/locations'
import { useApi } from '@/hooks/useApi'
import { Card } from '@/components/ui/Card'
import { LinkButton } from '@/components/ui/LinkButton'
import { Spinner } from '@/components/ui/Spinner'
import { Badge } from '@/components/ui/Badge'
import { formatDateShort, formatTime, isBookingFuture, isBookingToday } from '@/utils/dates'

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType
  label: string
  value: number | string
  color: string
}) {
  return (
    <Card>
      <Card.Body className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </Card.Body>
    </Card>
  )
}

export function DashboardPage() {
  const { user } = useAuthStore()
  const { data: myBookings, loading: loadingMine } = useApi(() => bookingsApi.mine())
  const { data: locations, loading: loadingLoc } = useApi(() => locationsApi.list())
  const { data: allBookings, loading: loadingAll } = useApi(() => bookingsApi.list())

  const upcoming = myBookings?.filter((b) => isBookingFuture(b.date)) ?? []
  const today = myBookings?.filter((b) => isBookingToday(b.date)) ?? []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Olá, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Veja o resumo dos seus agendamentos
          </p>
        </div>
        <LinkButton to="/bookings/new" icon={<Calendar className="h-4 w-4" />}>
          Novo Agendamento
        </LinkButton>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Calendar}
          label="Meus Agendamentos"
          value={loadingMine ? '—' : (myBookings?.length ?? 0)}
          color="bg-indigo-500"
        />
        <StatCard
          icon={Clock}
          label="Agendamentos Hoje"
          value={loadingMine ? '—' : today.length}
          color="bg-blue-500"
        />
        <StatCard
          icon={CalendarDays}
          label="Próximos"
          value={loadingMine ? '—' : upcoming.length}
          color="bg-emerald-500"
        />
        <StatCard
          icon={MapPin}
          label="Auditórios"
          value={loadingLoc ? '—' : (locations?.length ?? 0)}
          color="bg-violet-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <h3 className="font-semibold text-gray-900">Meus Próximos Agendamentos</h3>
            <Link to="/bookings/me" className="text-xs text-indigo-600 hover:underline font-medium">
              Ver todos
            </Link>
          </Card.Header>
          <Card.Body className="p-0">
            {loadingMine ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : upcoming.length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-500">
                Nenhum agendamento futuro
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {upcoming.slice(0, 5).map((booking) => (
                  <li key={booking.id} className="flex items-center justify-between px-6 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {booking.location?.name ?? 'Auditório'}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatDateShort(booking.date)} •{' '}
                        {formatTime(booking.start_time)} – {formatTime(booking.end_time)}
                      </p>
                    </div>
                    {isBookingToday(booking.date) && (
                      <Badge variant="info">Hoje</Badge>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h3 className="font-semibold text-gray-900">Auditórios Disponíveis</h3>
            <Link to="/locations" className="text-xs text-indigo-600 hover:underline font-medium">
              Ver todos
            </Link>
          </Card.Header>
          <Card.Body className="p-0">
            {loadingLoc || loadingAll ? (
              <div className="flex justify-center py-10">
                <Spinner />
              </div>
            ) : !locations?.length ? (
              <div className="py-10 text-center text-sm text-gray-500">
                Nenhum auditório cadastrado
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {locations.slice(0, 5).map((location) => {
                  const count = allBookings?.filter((b) => b.location_id === location.id).length ?? 0
                  return (
                    <li key={location.id} className="flex items-center justify-between px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
                          <MapPin className="h-4 w-4 text-indigo-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">{location.name}</p>
                      </div>
                      <Badge variant="default">{count} reservas</Badge>
                    </li>
                  )
                })}
              </ul>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}
