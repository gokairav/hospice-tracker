import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'

export default function OwnerDashboard() {
  const { profile, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        right={
          <button
            onClick={signOut}
            className="text-sm font-medium text-slate-500 active:text-slate-700"
          >
            Sign out
          </button>
        }
      />
      <div className="px-4 py-6">
        <h1 className="text-lg font-semibold text-slate-900 mb-1">
          Hi, {profile?.full_name ?? 'there'}
        </h1>
        <p className="text-sm text-slate-500 mb-6">Owner dashboard</p>
        <p className="text-sm text-slate-500">
          The full owner dashboard (marketer performance, benefit period breakdown, admits trend) is coming in Step 8.
        </p>
      </div>
    </div>
  )
}
