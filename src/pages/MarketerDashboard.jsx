import { useAuth } from '../context/AuthContext'

export default function MarketerDashboard() {
  const { profile, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Hi, {profile?.full_name ?? 'there'}
          </h1>
          <p className="text-sm text-slate-500">Marketer dashboard</p>
        </div>
        <button
          onClick={signOut}
          className="text-sm font-medium text-slate-500 active:text-slate-700"
        >
          Sign out
        </button>
      </div>
      <p className="text-sm text-slate-500">
        The full marketer dashboard (stat cards, lead list, follow-up reminders) is coming in Step 3.
      </p>
    </div>
  )
}
