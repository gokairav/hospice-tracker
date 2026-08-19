import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import StatCard from '../../components/StatCard'
import StatusBadge from '../../components/StatusBadge'
import BreakdownList from '../../components/BreakdownList'
import Section from './Section'
import { countBy } from '../../lib/adminStats'
import { ACTIVE_STATUSES, LEAD_STATUSES, isAdmittedThisMonth } from '../../lib/leadConstants'

export default function AdminOverview({ leads, profiles }) {
  const { role } = useAuth()
  const leadPathPrefix = role === 'owner' ? '/owner' : '/admin'
  const profileNameById = Object.fromEntries(profiles.map((p) => [p.id, p.full_name]))

  const activeLeadsCount = leads.filter((l) => ACTIVE_STATUSES.includes(l.status)).length
  const admitsThisMonth = leads.filter(isAdmittedThisMonth).length

  const statusCounts = LEAD_STATUSES.map((s) => ({
    label: s.label,
    count: leads.filter((l) => l.status === s.value).length,
  })).filter((s) => s.count > 0)

  const referralCounts = countBy(leads, (l) => l.referral_source_name || 'Unknown')
  const rejectionCounts = countBy(
    leads.filter((l) => l.rejection_reason),
    (l) => l.rejection_reason
  )

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Active leads (all marketers)" value={activeLeadsCount} />
        <StatCard label="Admits this month" value={admitsThisMonth} />
      </div>

      <Section title="Leads by status">
        <BreakdownList items={statusCounts} />
      </Section>

      <Section title="Referral source breakdown">
        <BreakdownList items={referralCounts} emptyLabel="No referral sources yet." />
      </Section>

      <Section title="Rejection reason breakdown">
        <BreakdownList items={rejectionCounts} emptyLabel="No rejections logged yet." />
      </Section>

      <div className="mt-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-2">All leads</h2>
        {leads.length === 0 ? (
          <p className="text-sm text-slate-400">No leads yet.</p>
        ) : (
          <ul className="space-y-2">
            {leads.map((lead) => (
              <li key={lead.id}>
                <Link
                  to={`${leadPathPrefix}/leads/${lead.id}`}
                  className="block bg-white rounded-lg border border-slate-200 p-3 active:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 truncate">
                        {lead.patient_first_name} {lead.patient_last_name}
                      </p>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {lead.marketer_id ? (profileNameById[lead.marketer_id] ?? 'Unknown marketer') : 'Other'}
                      </p>
                    </div>
                    <StatusBadge status={lead.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
