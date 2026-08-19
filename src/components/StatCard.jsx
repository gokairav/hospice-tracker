import { IconTrendUp, IconTrendDown } from './icons'

const TINTS = {
  brand: { card: 'bg-brand-50 border-brand-100', icon: 'bg-brand-100 text-brand-600', value: 'text-brand-700' },
  sage: { card: 'bg-sage-50 border-sage-100', icon: 'bg-sage-100 text-sage-600', value: 'text-sage-600' },
  gold: { card: 'bg-gold-50 border-gold-100', icon: 'bg-gold-100 text-gold-600', value: 'text-gold-600' },
  clay: { card: 'bg-clay-50 border-clay-100', icon: 'bg-clay-100 text-clay-700', value: 'text-clay-700' },
}

// delta: { direction: 'up' | 'down', text: string } | { text: string } for a neutral note
export default function StatCard({ label, value, icon: Icon, tint = 'brand', delta }) {
  const t = TINTS[tint] ?? TINTS.brand

  return (
    <div className={`rounded-2xl border px-3.5 py-3.5 min-w-0 ${t.card}`}>
      {Icon && (
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2 ${t.icon}`}>
          <Icon size={15} strokeWidth={2.2} />
        </div>
      )}
      <p className={`text-2xl font-extrabold font-heading tracking-tight truncate ${t.value}`}>{value}</p>
      <p className="text-[11px] font-semibold text-warm-500 mt-1 leading-tight">{label}</p>
      {delta && (
        <p
          className={`text-[10.5px] font-bold mt-1.5 flex items-center gap-0.5 ${
            delta.direction === 'up' ? 'text-sage-600' : delta.direction === 'down' ? 'text-clay-700' : 'text-warm-500'
          }`}
        >
          {delta.direction === 'up' && <IconTrendUp size={9} />}
          {delta.direction === 'down' && <IconTrendDown size={9} />}
          {delta.text}
        </p>
      )}
    </div>
  )
}
