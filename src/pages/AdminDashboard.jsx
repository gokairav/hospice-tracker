import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import { useAllLeadsData } from '../hooks/useAllLeadsData'
import AdminOverview from './admin/AdminOverview'

export default function AdminDashboard() {
  const { profile, signOut } = useAuth()
  const { leads, profiles, loading, error } = useAllLeadsData()

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <Header
        right={
          <button onClick={signOut} className="text-sm font-medium text-slate-500 active:text-slate-700">
            Sign out
          </button>
        }
      />
      <div className="px-4 py-4">
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900 mb-1">Hi, {profile?.full_name ?? 'there'}</h1>
            <p className="text-sm text-slate-500">Admin dashboard</p>
          </div>
          <Link
            to="/admin/leads/new"
            className="shrink-0 rounded-lg bg-slate-900 text-white text-sm font-medium px-3 py-2 active:bg-slate-800"
          >
            + Add admit
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600" />
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>
        ) : (
          <AdminOverview leads={leads} profiles={profiles} />
        )}
      </div>
    </div>
  )
}
