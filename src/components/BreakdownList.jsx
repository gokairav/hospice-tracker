export default function BreakdownList({ items, emptyLabel = 'No data yet.' }) {
  if (items.length === 0) {
    return <p className="text-sm text-warm-400">{emptyLabel}</p>
  }

  const max = Math.max(...items.map((i) => i.count), 1)

  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item.label}>
          <div className="flex items-center justify-between text-sm mb-1 gap-2">
            <span className="text-warm-700 truncate">{item.label}</span>
            <span className="text-warm-500 font-medium shrink-0">{item.count}</span>
          </div>
          <div className="h-1.5 bg-warm-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-gold-500"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
