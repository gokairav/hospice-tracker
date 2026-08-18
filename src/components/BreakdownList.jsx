export default function BreakdownList({ items, emptyLabel = 'No data yet.' }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-400">{emptyLabel}</p>
  }

  const max = Math.max(...items.map((i) => i.count), 1)

  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item.label}>
          <div className="flex items-center justify-between text-sm mb-1 gap-2">
            <span className="text-slate-700 truncate">{item.label}</span>
            <span className="text-slate-500 font-medium shrink-0">{item.count}</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-900 rounded-full"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
