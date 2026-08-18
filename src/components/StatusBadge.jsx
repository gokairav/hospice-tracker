import { getStatusMeta } from '../lib/leadConstants'

const COLOR_CLASSES = {
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  green: 'bg-green-100 text-green-700',
  yellow: 'bg-yellow-100 text-yellow-800',
  red: 'bg-red-100 text-red-700',
  gray: 'bg-slate-100 text-slate-600',
}

export default function StatusBadge({ status }) {
  const meta = getStatusMeta(status)
  const classes = COLOR_CLASSES[meta.color] ?? COLOR_CLASSES.gray

  return (
    <span className={`inline-flex shrink-0 items-center px-2 py-0.5 rounded-full text-xs font-medium ${classes}`}>
      {meta.label}
    </span>
  )
}
