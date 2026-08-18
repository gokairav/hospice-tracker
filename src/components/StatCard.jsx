export default function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 px-3 py-3 min-w-0">
      <p className="text-2xl font-semibold text-slate-900 truncate">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  )
}
