export default function MonthlyTrendChart({ data }) {
  const max = Math.max(...data.map((d) => d.count), 1)

  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center justify-end h-full">
          <span className="text-xs text-slate-600 font-medium mb-1">{d.count}</span>
          <div
            className={`w-full rounded-t ${d.count > 0 ? 'bg-slate-900' : 'bg-slate-200'}`}
            style={{ height: `${(d.count / max) * 100}%`, minHeight: '4px' }}
          />
          <span className="text-[10px] text-slate-400 mt-1">{d.label}</span>
        </div>
      ))}
    </div>
  )
}
