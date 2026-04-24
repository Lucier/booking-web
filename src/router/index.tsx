import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from './ProtectedRoute'
import { GuestRoute } from './GuestRoute'
import { Spinner } from '@/components/ui/Spinner'

const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage })))
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const LocationsPage = lazy(() => import('@/pages/locations/LocationsPage').then((m) => ({ default: m.LocationsPage })))
const LocationDetailPage = lazy(() => import('@/pages/locations/LocationDetailPage').then((m) => ({ default: m.LocationDetailPage })))
const MyBookingsPage = lazy(() => import('@/pages/bookings/MyBookingsPage').then((m) => ({ default: m.MyBookingsPage })))
const BookingsPage = lazy(() => import('@/pages/bookings/BookingsPage').then((m) => ({ default: m.BookingsPage })))
const NewBookingPage = lazy(() => import('@/pages/bookings/NewBookingPage').then((m) => ({ default: m.NewBookingPage })))
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })))
const UsersPage = lazy(() => import('@/pages/users/UsersPage').then((m) => ({ default: m.UsersPage })))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))

function PageLoader() {
  return (
    <div className="flex h-full min-h-64 items-center justify-center">
      <Spinner />
    </div>
  )
}

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

export const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      { path: '/login', element: <Lazy><LoginPage /></Lazy> },
      { path: '/register', element: <Lazy><RegisterPage /></Lazy> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/', element: <Lazy><DashboardPage /></Lazy> },
          { path: '/locations', element: <Lazy><LocationsPage /></Lazy> },
          { path: '/locations/:id', element: <Lazy><LocationDetailPage /></Lazy> },
          { path: '/bookings/me', element: <Lazy><MyBookingsPage /></Lazy> },
          { path: '/bookings/new', element: <Lazy><NewBookingPage /></Lazy> },
          { path: '/bookings', element: <Lazy><BookingsPage /></Lazy> },
          { path: '/profile', element: <Lazy><ProfilePage /></Lazy> },
          {
            element: <ProtectedRoute adminOnly />,
            children: [
              { path: '/users', element: <Lazy><UsersPage /></Lazy> },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <Lazy><NotFoundPage /></Lazy> },
])
