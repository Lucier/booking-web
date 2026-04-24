import { useState, useMemo } from 'react'
import { bookingsApi } from '@/api/bookings'
import { locationsApi } from '@/api/locations'
import { useApi } from '@/hooks/useApi'
import { Spinner } from '@/components/ui/Spinner'
import { BookingList } from '@/components/bookings/BookingList'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { todayISO } from '@/utils/dates'

export function BookingsPage() {
  const [locationFilter, setLocationFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  const { data: bookings, loading, error, refetch } = useApi(() => bookingsApi.list())
  const { data: locations } = useApi(() => locationsApi.list())

  const filtered = useMemo(() => {
    if (!bookings) return []
    return bookings.filter((b) => {
      if (locationFilter && b.location_id !== locationFilter) return false
      if (dateFilter && b.date !== dateFilter) return false
      return true
    })
  }, [bookings, locationFilter, dateFilter])

  const locationOptions = [
    { value: '', label: 'Todos os auditórios' },
    ...(locations ?? []).map((l) => ({ value: l.id, label: l.name })),
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-3">
        <div className="w-56">
          <Select
            options={locationOptions}
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            placeholder="Filtrar por auditório"
          />
        </div>
        <div className="w-48">
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            max={todayISO()}
          />
        </div>
        {(locationFilter || dateFilter) && (
          <button
            onClick={() => { setLocationFilter(''); setDateFilter('') }}
            className="text-sm text-indigo-600 hover:underline self-center"
          >
            Limpar filtros
          </button>
        )}
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
        <>
          <p className="text-sm text-gray-500">{filtered.length} agendamento(s) encontrado(s)</p>
          <BookingList
            bookings={filtered}
            onRefetch={refetch}
            showUser
            emptyTitle="Nenhum agendamento encontrado"
            emptyDescription="Ajuste os filtros para ver resultados."
          />
        </>
      )}
    </div>
  )
}
