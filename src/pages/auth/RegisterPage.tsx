import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { registerSchema } from '@/schemas/auth.schema'
import type { RegisterFormData } from '@/schemas/auth.schema'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/auth.store'
import { useToast } from '@/contexts/ToastContext'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { getApiErrorMessage } from '@/utils/errors'

export function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const toast = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await authApi.register(data.name, data.email, data.password)
      const loginResponse = await authApi.login(data.email, data.password)
      login(loginResponse.access_token, loginResponse.user)
      toast.success('Conta criada com sucesso!')
      navigate('/')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Erro ao criar conta'))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 mb-4">
            <Building2 className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Criar sua conta</h1>
          <p className="mt-1 text-sm text-gray-500">
            Já tem conta?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Entrar
            </Link>
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input
              label="Nome"
              type="text"
              placeholder="Seu nome completo"
              autoComplete="name"
              error={errors.name?.message}
              {...register('name')}
            />
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Senha"
              type="password"
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label="Confirmar Senha"
              type="password"
              placeholder="Repita a senha"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            <Button type="submit" loading={isSubmitting} className="mt-2 w-full" size="lg">
              Criar conta
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
