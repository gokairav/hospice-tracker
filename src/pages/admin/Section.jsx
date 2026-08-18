export default function Section({ title, children }) {
  return (
    <div className="mt-6">
      <h2 className="text-sm font-semibold text-slate-700 mb-2">{title}</h2>
      <div className="bg-white rounded-xl border border-slate-200 p-3">{children}</div>
    </div>
  )
}
