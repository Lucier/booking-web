import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  MapPin,
  Calendar,
  CalendarDays,
  Users,
  User,
  LogOut,
  Building2,
  X,
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { useAuthStore } from '@/store/auth.store'
import { Badge } from '@/components/ui/Badge'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

interface NavItem {
  to: string
  label: string
  icon: React.ElementType
  adminOnly?: boolean
}

const navItems: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/locations', label: 'Auditórios', icon: MapPin },
  { to: '/bookings/me', label: 'Meus Agendamentos', icon: Calendar },
  { to: '/bookings', label: 'Todos os Agendamentos', icon: CalendarDays },
  { to: '/users', label: 'Usuários', icon: Users, adminOnly: true },
  { to: '/profile', label: 'Meu Perfil', icon: User },
]

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuthStore()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-gray-200 transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-base">BookingApp</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-0.5">
            {navItems.map(({ to, label, icon: Icon, adminOnly }) => {
              if (adminOnly && user?.role !== 'ADMIN') return null
              return (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      )
                    }
                  >
                    <Icon className="h-4.5 w-4.5 shrink-0" />
                    {label}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm shrink-0">
              {user?.name?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
              <div className="mt-0.5">
                <Badge variant={user?.role === 'ADMIN' ? 'admin' : 'default'}>
                  {user?.role === 'ADMIN' ? 'Admin' : 'Usuário'}
                </Badge>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>
    </>
  )
}
