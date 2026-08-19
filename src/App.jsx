import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import SplashScreen from './components/SplashScreen'
import Login from './pages/Login'
import MarketerLayout from './pages/marketer/MarketerLayout'
import MarketerLeads from './pages/marketer/MarketerLeads'
import LeadDetail from './pages/marketer/LeadDetail'
import AddLead from './pages/AddLead'
import FollowUps from './pages/marketer/FollowUps'
import MarketerStats from './pages/marketer/MarketerStats'
import Profile from './pages/marketer/Profile'
import AdminDashboard from './pages/AdminDashboard'
import OwnerDashboard from './pages/OwnerDashboard'
import AdminLeadDetail from './pages/AdminLeadDetail'

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
            <MarketerLayout />
          </RequireRole>
        }
      >
        <Route index element={<MarketerLeads />} />
        <Route path="leads/new" element={<AddLead />} />
        <Route path="leads/:id" element={<LeadDetail />} />
        <Route path="follow-ups" element={<FollowUps />} />
        <Route path="stats" element={<MarketerStats />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route
        path="/admin"
        element={
          <RequireRole allowedRoles={['admin', 'owner']}>
            <AdminDashboard />
          </RequireRole>
        }
      />
      <Route
        path="/admin/leads/new"
        element={
          <RequireRole allowedRoles={['admin', 'owner']}>
            <AddLead />
          </RequireRole>
        }
      />
      <Route
        path="/admin/leads/:id"
        element={
          <RequireRole allowedRoles={['admin', 'owner']}>
            <AdminLeadDetail />
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
      <Route
        path="/owner/leads/new"
        element={
          <RequireRole allowedRoles={['owner']}>
            <AddLead />
          </RequireRole>
        }
      />
      <Route
        path="/owner/leads/:id"
        element={
          <RequireRole allowedRoles={['owner']}>
            <AdminLeadDetail />
          </RequireRole>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
