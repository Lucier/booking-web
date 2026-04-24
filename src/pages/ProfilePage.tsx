import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { User, Mail, Shield } from 'lucide-react'
import { usersApi } from '@/api/users'
import { useAuthStore } from '@/store/auth.store'
import { useToast } from '@/contexts/ToastContext'
import { updateProfileSchema } from '@/schemas/user.schema'
import type { UpdateProfileFormData } from '@/schemas/user.schema'
import { getApiErrorMessage } from '@/utils/errors'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { formatDateTime } from '@/utils/dates'

export function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const toast = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
    },
  })

  const onSubmit = async (data: UpdateProfileFormData) => {
    try {
      const updated = await usersApi.updateMe(data)
      updateUser(updated)
      toast.success('Perfil atualizado com sucesso!')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Erro ao atualizar perfil'))
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <Card>
        <Card.Body>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 text-2xl font-bold shrink-0">
              {user?.name?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <div className="mt-1">
                <Badge variant={user?.role === 'ADMIN' ? 'admin' : 'default'}>
                  {user?.role === 'ADMIN' ? 'Administrador' : 'Usuário'}
                </Badge>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h3 className="font-semibold text-gray-900">Editar Perfil</h3>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input
              label="Nome"
              placeholder="Seu nome"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <div className="flex justify-end">
              <Button type="submit" loading={isSubmitting} disabled={!isDirty}>
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h3 className="font-semibold text-gray-900">Informações da Conta</h3>
        </Card.Header>
        <Card.Body>
          <dl className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-400 shrink-0" />
              <div>
                <dt className="text-xs text-gray-500">ID do usuário</dt>
                <dd className="text-sm font-mono text-gray-700 mt-0.5">{user?.id}</dd>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-400 shrink-0" />
              <div>
                <dt className="text-xs text-gray-500">E-mail</dt>
                <dd className="text-sm text-gray-700 mt-0.5">{user?.email}</dd>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-4 w-4 text-gray-400 shrink-0" />
              <div>
                <dt className="text-xs text-gray-500">Perfil de acesso</dt>
                <dd className="mt-0.5">
                  <Badge variant={user?.role === 'ADMIN' ? 'admin' : 'default'}>
                    {user?.role === 'ADMIN' ? 'Administrador' : 'Usuário comum'}
                  </Badge>
                </dd>
              </div>
            </div>
            {user?.created_at && (
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 shrink-0" />
                <div>
                  <dt className="text-xs text-gray-500">Membro desde</dt>
                  <dd className="text-sm text-gray-700 mt-0.5">{formatDateTime(user.created_at)}</dd>
                </div>
              </div>
            )}
          </dl>
        </Card.Body>
      </Card>
    </div>
  )
}
