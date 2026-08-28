import { Link } from 'react-router-dom'
import Avatar from './Avatar'
import StatusBadge from './StatusBadge'
import {
  ACTIVE_STALE_DAYS,
  ACTIVE_STATUSES,
  calculateAge,
  daysBetween,
  formatShortDate,
  getOutcomeDate,
  getStatusMeta,
} from '../lib/leadConstants'

export default function LeadTimelineCard({ lead, to, marketerName, showMarketer = false }) {
  const isActive = ACTIVE_STATUSES.includes(lead.status)
  const referredLabel = formatShortDate(lead.created_at)

  return (
    <Link
      to={to}
      className="block bg-white rounded-2xl border border-warm-200 shadow-sm shadow-warm-100 p-3 active:bg-warm-50"
    >
      <div className="flex items-center gap-3">
        <Avatar firstName={lead.patient_first_name} lastName={lead.patient_last_name} size={32} />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-warm-900 truncate text-[13.5px]">
            {lead.patient_first_name} {lead.patient_last_name}
            {lead.patient_dob && (
              <span className="text-warm-400 font-medium"> · {calculateAge(lead.patient_dob)}y</span>
            )}
          </p>
          <p className="text-xs text-warm-500 truncate mt-0.5">
            {showMarketer ? (marketerName ?? 'Other') : `${lead.primary_diagnosis || '—'} · ${lead.location_name || '—'}`}
          </p>
        </div>
        <StatusBadge status={lead.status} />
      </div>

      <div className="mt-2 pt-2 border-t border-warm-100 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[10.5px] font-semibold text-warm-500">
        {isActive ? (
          <>
            <span>Referred {referredLabel}</span>
            {(() => {
              const days = daysBetween(lead.created_at, new Date().toISOString())
              return (
                <span className={`ml-auto font-bold ${days > ACTIVE_STALE_DAYS ? 'text-clay-600' : 'text-warm-400'}`}>
                  {days} day{days === 1 ? '' : 's'} in pipeline
                </span>
              )
            })()}
          </>
        ) : (
          <>
            <span>Referred {referredLabel}</span>
            <span className="text-warm-300">&rarr;</span>
            <span className="text-warm-700 font-bold">
              {getStatusMeta(lead.status).label} {formatShortDate(getOutcomeDate(lead))}
            </span>
            <span className="ml-auto text-warm-400 font-bold">
              {daysBetween(lead.created_at, getOutcomeDate(lead))}d
            </span>
          </>
        )}
      </div>
    </Link>
  )
}
