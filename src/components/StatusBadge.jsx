import { getStatusMeta } from '../lib/leadConstants'

const COLOR_CLASSES = {
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  green: 'bg-sage-100 text-sage-600',
  yellow: 'bg-gold-100 text-gold-600',
  red: 'bg-clay-100 text-clay-700',
  gray: 'bg-warm-100 text-warm-500',
}

export default function StatusBadge({ status }) {
  const meta = getStatusMeta(status)
  const classes = COLOR_CLASSES[meta.color] ?? COLOR_CLASSES.gray

  return (
    <span className={`inline-flex shrink-0 items-center px-2.5 py-1 rounded-full text-xs font-bold ${classes}`}>
      {meta.label}
    </span>
  )
}
