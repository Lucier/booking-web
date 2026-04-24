import { z } from 'zod'

export const createLocationSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(100, 'Nome muito longo'),
})

export type CreateLocationFormData = z.infer<typeof createLocationSchema>
