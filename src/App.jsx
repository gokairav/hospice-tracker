import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import SplashScreen from './components/SplashScreen'
import Login from './pages/Login'
import MarketerDashboard from './pages/MarketerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import OwnerDashboard from './pages/OwnerDashboard'

function dashboardPathForRole(role) {
  if (role === 'owner') return '/owner'
  if (role === 'admin') return '/admin'
  if (role === 'marketer') return '/marketer'
  return null
}

function RequireRole({ allowedRoles, children }) {
  const { session, role, loading } = useAuth()

  if (loading) return <SplashScreen />
  if (!session) return <Navigate to="/login" replace />

  const dashboardPath = dashboardPathForRole(role)
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={dashboardPath ?? '/login'} replace />
  }

  return children
}

function LoginRoute() {
  const { session, role, loading } = useAuth()

  if (loading) return <SplashScreen />
  if (session) {
    const dashboardPath = dashboardPathForRole(role)
    if (dashboardPath) return <Navigate to={dashboardPath} replace />
  }

  return <Login />
}

function RootRoute() {
  const { session, role, loading } = useAuth()

  if (loading) return <SplashScreen />
  if (!session) return <Navigate to="/login" replace />

  const dashboardPath = dashboardPathForRole(role)
  return <Navigate to={dashboardPath ?? '/login'} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRoute />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route
        path="/marketer"
        element={
          <RequireRole allowedRoles={['marketer']}>
            <MarketerDashboard />
          </RequireRole>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireRole allowedRoles={['admin', 'owner']}>
            <AdminDashboard />
          </RequireRole>
        }
      />
      <Route
        path="/owner"
        element={
          <RequireRole allowedRoles={['owner']}>
            <OwnerDashboard />
          </RequireRole>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
