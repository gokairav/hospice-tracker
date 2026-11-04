import { useState } from 'react'
import { IconChevronDown } from '../../components/icons'

export default function Section({ title, children, id, collapsible = false, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)

  if (!collapsible) {
    return (
      <div className="mt-6" id={id}>
        <h2 className="text-sm font-semibold text-warm-700 mb-2">{title}</h2>
        <div className="bg-white rounded-xl border border-warm-200 p-3">{children}</div>
      </div>
    )
  }

  return (
    <div className="mt-6" id={id}>
      <button type="button" onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-warm-700">{title}</h2>
        <IconChevronDown
          size={14}
          strokeWidth={2.4}
          className={`text-warm-400 transition-transform ${open ? '' : '-rotate-90'}`}
        />
      </button>
      {open && <div className="bg-white rounded-xl border border-warm-200 p-3">{children}</div>}
    </div>
  )
}
