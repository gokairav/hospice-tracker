import { useState } from 'react'
import RangeFilterPills from './RangeFilterPills'
import { IconChevronDown } from './icons'
import { getOutcomeDate, groupLeadsByMonth, isDateInRange } from '../lib/leadConstants'

export default function ResolvedLeadsHistory({
  leads,
  renderCard,
  listClassName = 'space-y-2.5',
  emptyLabel = 'No resolved leads yet.',
}) {
  const [range, setRange] = useState('month')
  const [openMonths, setOpenMonths] = useState(null)

  if (leads.length === 0) {
    return <p className="text-sm text-warm-400 text-center py-6">{emptyLabel}</p>
  }

  if (range === 'all') {
    const groups = groupLeadsByMonth(leads, getOutcomeDate)
    const open = openMonths ?? new Set(groups.length ? [groups[0].key] : [])

    function toggleMonth(key) {
      const next = new Set(open)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      setOpenMonths(next)
    }

    return (
      <div>
        <RangeFilterPills value={range} onChange={setRange} />
        <div className="mt-3 space-y-2">
          {groups.map((group) => {
            const admittedCount = group.leads.filter((l) => l.status === 'admitted').length
            const isOpen = open.has(group.key)
            return (
              <div key={group.key}>
                <button
                  type="button"
                  onClick={() => toggleMonth(group.key)}
                  className="w-full flex items-center gap-2 bg-warm-100 border border-warm-200 rounded-xl px-3 py-2.5"
                >
                  <IconChevronDown
                    size={13}
                    strokeWidth={2.4}
                    className={`text-warm-400 shrink-0 transition-transform ${isOpen ? '' : '-rotate-90'}`}
                  />
                  <span className="text-[12.5px] font-extrabold text-warm-700 flex-1 text-left">{group.label}</span>
                  {admittedCount > 0 && (
                    <span className="text-[11px] font-bold text-sage-600">{admittedCount} admitted</span>
                  )}
                  <span className="text-[11px] font-bold text-warm-500">{group.leads.length} total</span>
                </button>
                {isOpen && <div className={`mt-2 ${listClassName}`}>{group.leads.map(renderCard)}</div>}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const filtered = leads
    .filter((l) => isDateInRange(getOutcomeDate(l), range))
    .sort((a, b) => (getOutcomeDate(a) < getOutcomeDate(b) ? 1 : -1))

  return (
    <div>
      <RangeFilterPills value={range} onChange={setRange} />
      {filtered.length === 0 ? (
        <p className="text-sm text-warm-400 text-center py-6">Nothing in this range.</p>
      ) : (
        <div className={`mt-3 ${listClassName}`}>{filtered.map(renderCard)}</div>
      )}
    </div>
  )
}
