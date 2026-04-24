import { z } from 'zod'

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').optional(),
  email: z.string().email('E-mail inválido').optional(),
})

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>
