import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { loginSchema } from '@/schemas/auth.schema'
import type { LoginFormData } from '@/schemas/auth.schema'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/auth.store'
import { useToast } from '@/contexts/ToastContext'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { getApiErrorMessage } from '@/utils/errors'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const toast = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await authApi.login(data.email, data.password)
      login(response.access_token, response.user)
      toast.success(`Bem-vindo, ${response.user.name}!`)
      navigate('/')
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'E-mail ou senha incorretos'))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 mb-4">
            <Building2 className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Entrar na sua conta</h1>
          <p className="mt-1 text-sm text-gray-500">
            Não tem conta?{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Cadastre-se
            </Link>
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
              placeholder="••••••"
              autoComplete="current-password"
              error={errors.password?.message}
              {...register('password')}
            />
            <Button type="submit" loading={isSubmitting} className="mt-2 w-full" size="lg">
              Entrar
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
