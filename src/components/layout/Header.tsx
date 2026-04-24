import { Menu } from 'lucide-react'
import { useLocation } from 'react-router-dom'

interface HeaderProps {
  onMenuClick: () => void
}

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/locations': 'Auditórios',
  '/bookings': 'Todos os Agendamentos',
  '/bookings/me': 'Meus Agendamentos',
  '/bookings/new': 'Novo Agendamento',
  '/profile': 'Meu Perfil',
  '/users': 'Usuários',
}

export function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation()

  const title = Object.entries(pageTitles).reduce((found, [path, label]) => {
    if (location.pathname === path) return label
    if (location.pathname.startsWith(path) && path !== '/') return label
    return found
  }, 'Página')

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 lg:px-6">
      <button
        onClick={onMenuClick}
        className="lg:hidden rounded-lg p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
    </header>
  )
}
