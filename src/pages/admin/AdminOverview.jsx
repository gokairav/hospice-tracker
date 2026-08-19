import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import StatCard from '../../components/StatCard'
import StatusBadge from '../../components/StatusBadge'
import BreakdownList from '../../components/BreakdownList'
import Avatar from '../../components/Avatar'
import Section from './Section'
import PipelineDonut from './PipelineDonut'
import { countBy } from '../../lib/adminStats'
import {
  ACTIVE_STATUSES,
  isAdmittedThisMonth,
  isAdmittedLastMonth,
  isCreatedInLastDays,
} from '../../lib/leadConstants'
import { IconPeople, IconCheckBadge } from '../../components/icons'

export default function AdminOverview({ leads, profiles }) {
  const { role } = useAuth()
  const leadPathPrefix = role === 'owner' ? '/owner' : '/admin'
  const profileNameById = Object.fromEntries(profiles.map((p) => [p.id, p.full_name]))

  const activeLeadsCount = leads.filter((l) => ACTIVE_STATUSES.includes(l.status)).length
  const newThisWeek = leads.filter((l) => isCreatedInLastDays(l, 7)).length

  const admitsThisMonth = leads.filter(isAdmittedThisMonth).length
  const admitsLastMonth = leads.filter(isAdmittedLastMonth).length
  const admitsDelta =
    admitsThisMonth > admitsLastMonth
      ? { direction: 'up', text: `+${admitsThisMonth - admitsLastMonth} vs last month` }
      : admitsThisMonth < admitsLastMonth
        ? { direction: 'down', text: `${admitsThisMonth - admitsLastMonth} vs last month` }
        : { text: 'Same as last month' }

  const referralCounts = countBy(leads, (l) => l.referral_source_name || 'Unknown')
  const rejectionCounts = countBy(
    leads.filter((l) => l.rejection_reason),
    (l) => l.rejection_reason
  )

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Active leads (all marketers)"
          value={activeLeadsCount}
          icon={IconPeople}
          tint="brand"
          delta={newThisWeek > 0 ? { direction: 'up', text: `+${newThisWeek} this week` } : undefined}
        />
        <StatCard label="Admits this month" value={admitsThisMonth} icon={IconCheckBadge} tint="sage" delta={admitsDelta} />
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-4">
        <Section title="Pipeline Overview">
          <PipelineDonut leads={leads} />
        </Section>

        <Section title="Referral source breakdown">
          <BreakdownList items={referralCounts} emptyLabel="No referral sources yet." />
        </Section>
      </div>

      <Section title="Rejection reason breakdown">
        <BreakdownList items={rejectionCounts} emptyLabel="No rejections logged yet." />
      </Section>

      <div className="mt-6">
        <h2 className="text-sm font-semibold text-warm-700 mb-2">All leads</h2>
        {leads.length === 0 ? (
          <p className="text-sm text-warm-400">No leads yet.</p>
        ) : (
          <div className="lg:grid lg:grid-cols-2 lg:gap-2.5 space-y-2 lg:space-y-0">
            {leads.map((lead) => (
              <Link
                key={lead.id}
                to={`${leadPathPrefix}/leads/${lead.id}`}
                className="flex items-center gap-3 bg-white rounded-2xl border border-warm-200 shadow-sm shadow-warm-100 p-3 active:bg-warm-50"
              >
                <Avatar firstName={lead.patient_first_name} lastName={lead.patient_last_name} size={32} />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-warm-900 truncate text-[13.5px]">
                    {lead.patient_first_name} {lead.patient_last_name}
                  </p>
                  <p className="text-xs text-warm-400 truncate mt-0.5">
                    {lead.marketer_id ? (profileNameById[lead.marketer_id] ?? 'Unknown marketer') : 'Other'}
                  </p>
                </div>
                <StatusBadge status={lead.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
