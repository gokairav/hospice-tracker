import { useAuth } from '../../context/AuthContext'

export default function Profile() {
  const { user, profile, signOut } = useAuth()

  return (
    <div className="px-4 py-4">
      <h1 className="font-heading text-lg font-extrabold text-warm-900 tracking-tight mb-4">Profile</h1>

      <div className="bg-white rounded-xl border border-warm-200 divide-y divide-warm-100">
        <Row label="Name" value={profile?.full_name} />
        <Row label="Email" value={user?.email} />
        <Row label="Role" value={profile?.role} />
      </div>

      <button
        onClick={signOut}
        className="mt-4 w-full rounded-lg border border-warm-300 py-2.5 text-sm font-medium text-warm-700 active:bg-warm-50"
      >
        Sign out
      </button>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="px-3 py-2.5">
      <p className="text-xs text-warm-400">{label}</p>
      <p className="text-sm text-warm-900 mt-0.5">{value || '—'}</p>
    </div>
  )
}
