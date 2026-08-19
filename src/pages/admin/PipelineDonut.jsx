import { LEAD_STATUSES } from '../../lib/leadConstants'

const RING_COLORS = {
  blue: 'oklch(60% 0.14 250)',
  purple: 'oklch(58% 0.15 300)',
  green: 'oklch(58% 0.10 150)',
  yellow: 'oklch(55% 0.10 70)',
  red: 'oklch(50% 0.15 25)',
  gray: 'oklch(72% 0.016 50)',
}

const LEGEND_DOT_CLASSES = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  green: 'bg-sage-500',
  yellow: 'bg-gold-600',
  red: 'bg-clay-600',
  gray: 'bg-warm-400',
}

export default function PipelineDonut({ leads }) {
  const total = leads.length

  const items = LEAD_STATUSES.map((s) => ({
    label: s.label,
    count: leads.filter((l) => l.status === s.value).length,
    color: RING_COLORS[s.color],
    dotClass: LEGEND_DOT_CLASSES[s.color],
  })).filter((i) => i.count > 0)

  if (total === 0) {
    return <p className="text-sm text-warm-400">No leads yet.</p>
  }

  const r = 58
  const strokeWidth = 15
  const circumference = 2 * Math.PI * r
  let cumulative = 0
  const segments = items.map((item) => {
    const length = (item.count / total) * circumference
    const seg = { ...item, dasharray: `${length} ${circumference - length}`, dashoffset: -cumulative }
    cumulative += length
    return seg
  })

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-[120px] h-[120px] shrink-0">
        <svg viewBox="0 0 150 150" width="120" height="120">
          {segments.map((seg) => (
            <circle
              key={seg.label}
              cx="75"
              cy="75"
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={seg.dasharray}
              strokeDashoffset={seg.dashoffset}
              transform="rotate(-90 75 75)"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-extrabold font-heading text-warm-900">{total}</span>
          <span className="text-[9px] font-semibold text-warm-500">Total Leads</span>
        </div>
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-xs">
            <span className={`w-2.5 h-2.5 rounded-sm shrink-0 ${item.dotClass}`} />
            <span className="text-warm-700 flex-1 min-w-0 truncate">{item.label}</span>
            <span className="text-warm-500 font-bold shrink-0">
              {item.count} ({Math.round((item.count / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
