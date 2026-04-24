import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'

interface ProtectedRouteProps {
  adminOnly?: boolean
}

export function ProtectedRoute({ adminOnly }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
