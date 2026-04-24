import { z } from 'zod'

export const createBookingSchema = z.object({
  location_id: z.string().uuid('Selecione um local válido'),
  date: z.string().min(1, 'Data é obrigatória'),
  start_time: z.string().min(1, 'Hora de início é obrigatória'),
  end_time: z.string().min(1, 'Hora de término é obrigatória'),
}).refine((data) => {
  if (!data.start_time || !data.end_time) return true
  return data.start_time < data.end_time
}, {
  message: 'Hora de término deve ser após hora de início',
  path: ['end_time'],
})

export type CreateBookingFormData = z.infer<typeof createBookingSchema>
