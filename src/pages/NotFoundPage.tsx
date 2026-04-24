import { Link } from 'react-router-dom'
import { Building2 } from 'lucide-react'
import { LinkButton } from '@/components/ui/LinkButton'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-6xl font-bold text-indigo-600 mb-2">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Página não encontrada</h1>
        <p className="text-gray-500 mb-8">A página que você está procurando não existe.</p>
        <LinkButton to="/" icon={<Building2 className="h-4 w-4" />}>
          Voltar ao início
        </LinkButton>
      </div>
    </div>
  )
}
