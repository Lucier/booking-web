import { useState } from 'react'
import { bookingsApi } from '@/api/bookings'
import { useApi } from '@/hooks/useApi'
import { LinkButton } from '@/components/ui/LinkButton'
import { Spinner } from '@/components/ui/Spinner'
import { BookingList } from '@/components/bookings/BookingList'
import { Plus } from 'lucide-react'

type Tab = 'upcoming' | 'past'

export function MyBookingsPage() {
  const [tab, setTab] = useState<Tab>('upcoming')
  const { data: bookings, loading, error, refetch } = useApi(() => bookingsApi.mine())

  const now = new Date().toISOString().slice(0, 10)
  const upcoming = bookings?.filter((b) => b.date >= now) ?? []
  const past = bookings?.filter((b) => b.date < now) ?? []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {(['upcoming', 'past'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                tab === t
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t === 'upcoming' ? `Futuros (${upcoming.length})` : `Passados (${past.length})`}
            </button>
          ))}
        </div>
        <LinkButton to="/bookings/new" icon={<Plus className="h-4 w-4" />} size="md">
          Novo
        </LinkButton>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <BookingList
          bookings={tab === 'upcoming' ? upcoming : past}
          onRefetch={refetch}
          emptyTitle={tab === 'upcoming' ? 'Nenhum agendamento futuro' : 'Nenhum agendamento passado'}
          emptyDescription={
            tab === 'upcoming'
              ? 'Clique em "Novo" para criar seu primeiro agendamento.'
              : undefined
          }
          emptyAction={
            tab === 'upcoming' ? (
              <LinkButton to="/bookings/new" icon={<Plus className="h-4 w-4" />}>
                Novo Agendamento
              </LinkButton>
            ) : undefined
          }
        />
      )}
    </div>
  )
}
