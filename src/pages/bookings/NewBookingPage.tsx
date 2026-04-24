import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { ArrowLeft, Clock } from 'lucide-react'
import { createBookingSchema } from '@/schemas/booking.schema'
import type { CreateBookingFormData } from '@/schemas/booking.schema'
import { bookingsApi } from '@/api/bookings'
import { locationsApi } from '@/api/locations'
import { useApi } from '@/hooks/useApi'
import { useToast } from '@/contexts/ToastContext'
import { getApiErrorMessage } from '@/utils/errors'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Spinner } from '@/components/ui/Spinner'
import { Badge } from '@/components/ui/Badge'
import { todayISO, formatTime } from '@/utils/dates'

const TIME_SLOTS = [
  '07:00','08:00','09:00','10:00','11:00','12:00',
  '13:00','14:00','15:00','16:00','17:00','18:00',
  '19:00','20:00','21:00','22:00',
]

export function NewBookingPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const toast = useToast()
  const preselectedLocationId = params.get('locationId') ?? ''

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateBookingFormData>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      location_id: preselectedLocationId,
      date: todayISO(),
      start_time: '',
      end_time: '',
    },
  })

  const selectedLocationId = watch('location_id')
  const selectedDate = watch('date')

  const { data: locations, loading: loadingLoc } = useApi(() => locationsApi.list())

  const { data: availability, loading: loadingAvail } = useApi(
    () => bookingsApi.availability(selectedLocationId, selectedDate),
    [selectedLocationId, selectedDate],
    { enabled: !!selectedLocationId && !!selectedDate }
  )

  useEffect(() => {
    if (preselectedLocationId) {
      setValue('location_id', preselectedLocationId)
    }
  }, [preselectedLocationId, setValue])

  useEffect(() => {
    setValue('start_time', '', { shouldValidate: false })
    setValue('end_time', '', { shouldValidate: false })
  }, [selectedLocationId, selectedDate, setValue])

  const isAvailabilityReady = !loadingAvail && availability !== null

  const isOccupied = (time: string) => {
    if (!availability) return true
    return availability.some(
      (slot) => time >= formatTime(slot.start_time) && time < formatTime(slot.end_time)
    )
  }

  const onSubmit = async (data: CreateBookingFormData) => {
    try {
      await bookingsApi.create({
        location_id: data.location_id,
        date: data.date,
        start_time: data.start_time,
        end_time: data.end_time,
      })
      toast.success('Agendamento criado com sucesso!')
      navigate('/bookings/me')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Erro ao criar agendamento'))
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Link
          to="/bookings/me"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Meus Agendamentos
        </Link>
      </div>

      <Card>
        <Card.Header>
          <h2 className="font-semibold text-gray-900">Novo Agendamento</h2>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {loadingLoc ? (
              <div className="flex justify-center py-4">
                <Spinner />
              </div>
            ) : (
              <Select
                label="Auditório"
                placeholder="Selecione um auditório"
                options={(locations ?? []).map((l) => ({ value: l.id, label: l.name }))}
                error={errors.location_id?.message}
                {...register('location_id')}
              />
            )}

            <Input
              label="Data"
              type="date"
              min={todayISO()}
              error={errors.date?.message}
              {...register('date')}
            />

            {selectedLocationId && selectedDate && (
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <p className="text-sm font-medium text-gray-700">Disponibilidade</p>
                  {!isAvailabilityReady && <Spinner className="h-3.5 w-3.5" />}
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {TIME_SLOTS.filter((t) => !isOccupied(t)).map((t) => (
                    <div
                      key={t}
                      className="flex items-center justify-center rounded-md py-1 text-xs font-medium bg-green-100 text-green-700"
                    >
                      {t}
                    </div>
                  ))}
                  {TIME_SLOTS.every((t) => isOccupied(t)) && (
                    <p className="col-span-4 text-center text-xs text-gray-500 py-2">
                      Nenhum horário disponível nesta data.
                    </p>
                  )}
                </div>
                <div className="flex gap-4 mt-3">
                  <div className="flex items-center gap-1.5">
                    <div className="h-3 w-3 rounded-sm bg-green-100 border border-green-300" />
                    <span className="text-xs text-gray-500">Disponível</span>
                  </div>
                </div>
              </div>
            )}

            <input type="hidden" {...register('start_time')} />
            <input type="hidden" {...register('end_time')} />

            {selectedLocationId && selectedDate && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Hora de Início</label>
                  {!isAvailabilityReady ? (
                    <div className="flex justify-center py-3">
                      <Spinner />
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-1.5">
                      {TIME_SLOTS.slice(0, -1).filter((t) => !isOccupied(t)).map((t) => {
                        const selected = watch('start_time') === t
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setValue('start_time', t, { shouldValidate: true })}
                            className={`py-1.5 rounded-md text-xs font-medium transition-colors ${
                              selected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {t}
                          </button>
                        )
                      })}
                    </div>
                  )}
                  {errors.start_time && (
                    <p className="text-xs text-red-600">{errors.start_time.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Hora de Término</label>
                  {!isAvailabilityReady ? (
                    <div className="flex justify-center py-3">
                      <Spinner />
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-1.5">
                      {TIME_SLOTS.slice(1).filter((t) => !isOccupied(t)).map((t) => {
                        const startTime = watch('start_time')
                        const beforeStart = startTime ? t <= startTime : false
                        const selected = watch('end_time') === t
                        return (
                          <button
                            key={t}
                            type="button"
                            disabled={beforeStart}
                            onClick={() => setValue('end_time', t, { shouldValidate: true })}
                            className={`py-1.5 rounded-md text-xs font-medium transition-colors ${
                              beforeStart
                                ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                : selected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {t}
                          </button>
                        )
                      })}
                    </div>
                  )}
                  {errors.end_time && (
                    <p className="text-xs text-red-600">{errors.end_time.message}</p>
                  )}
                </div>
              </>
            )}

            <div className="flex gap-3 justify-end pt-2">
              <Button variant="outline" type="button" onClick={() => navigate(-1)}>
                Cancelar
              </Button>
              <Button type="submit" loading={isSubmitting}>
                Confirmar Agendamento
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>

      {availability && availability.length > 0 && (
        <Card>
          <Card.Header>
            <h3 className="text-sm font-semibold text-gray-900">Horários já reservados nesta data</h3>
          </Card.Header>
          <Card.Body className="p-0">
            <ul className="divide-y divide-gray-100">
              {availability.map((slot, i) => (
                <li key={i} className="flex items-center gap-2 px-6 py-3">
                  <Clock className="h-4 w-4 text-red-400 shrink-0" />
                  <span className="text-sm text-gray-700">
                    {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                  </span>
                  <Badge variant="danger" className="ml-auto">Reservado</Badge>
                </li>
              ))}
            </ul>
          </Card.Body>
        </Card>
      )}
    </div>
  )
}
