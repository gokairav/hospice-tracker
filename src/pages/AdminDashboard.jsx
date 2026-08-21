import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import { useAllLeadsData } from '../hooks/useAllLeadsData'
import AdminOverview from './admin/AdminOverview'
import { IconProfile } from '../components/icons'

export default function AdminDashboard() {
  const { profile, signOut } = useAuth()
  const { leads, profiles, loading, error } = useAllLeadsData()

  return (
    <div className="min-h-screen bg-warm-50 pb-10">
      <Header
        right={
          <div className="flex items-center gap-3">
            <Link to="/admin/profile" aria-label="Profile" className="text-warm-500 active:text-warm-700">
              <IconProfile size={20} />
            </Link>
            <button onClick={signOut} className="text-sm font-medium text-warm-500 active:text-warm-700">
              Sign out
            </button>
          </div>
        }
      />
      <div className="px-4 py-4 lg:max-w-4xl lg:mx-auto">
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <h1 className="font-heading text-lg font-extrabold text-warm-900 tracking-tight mb-1">Hi, {profile?.full_name ?? 'there'}</h1>
            <p className="text-sm text-warm-500">Admin dashboard</p>
          </div>
          <Link
            to="/admin/leads/new"
            className="shrink-0 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white text-sm font-bold px-3.5 py-2 shadow-sm shadow-brand-200 active:from-brand-600 active:to-brand-700"
          >
            + Add admit
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-warm-200 border-t-brand-500" />
          </div>
        ) : error ? (
          <div className="rounded-lg bg-clay-50 border border-clay-100 px-3 py-2 text-sm text-clay-700">{error}</div>
        ) : (
          <AdminOverview leads={leads} profiles={profiles} />
        )}
      </div>
    </div>
  )
}
