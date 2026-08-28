import { useAuth } from '../../context/AuthContext'
import StatCard from '../../components/StatCard'
import BreakdownList from '../../components/BreakdownList'
import LeadTimelineCard from '../../components/LeadTimelineCard'
import ResolvedLeadsHistory from '../../components/ResolvedLeadsHistory'
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

const HISTORY_LIST_CLASSNAME = 'space-y-2 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-2.5'

export default function AdminOverview({ leads, profiles }) {
  const { role } = useAuth()
  const leadPathPrefix = role === 'owner' ? '/owner' : '/admin'
  const profileNameById = Object.fromEntries(profiles.map((p) => [p.id, p.full_name]))

  const activeLeads = leads.filter((l) => ACTIVE_STATUSES.includes(l.status))
  const activeLeadsCount = activeLeads.length
  const resolvedLeads = leads.filter((l) => !ACTIVE_STATUSES.includes(l.status))
  const newThisWeek = leads.filter((l) => isCreatedInLastDays(l, 7)).length

  function marketerNameFor(lead) {
    return lead.marketer_id ? (profileNameById[lead.marketer_id] ?? 'Unknown marketer') : 'Other'
  }

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
        <h2 className="text-sm font-semibold text-warm-700 mb-2">Active leads</h2>
        {leads.length === 0 ? (
          <p className="text-sm text-warm-400">No leads yet.</p>
        ) : activeLeads.length === 0 ? (
          <p className="text-sm text-warm-400">No active leads right now.</p>
        ) : (
          <div className={HISTORY_LIST_CLASSNAME}>
            {activeLeads.map((lead) => (
              <LeadTimelineCard
                key={lead.id}
                lead={lead}
                to={`${leadPathPrefix}/leads/${lead.id}`}
                marketerName={marketerNameFor(lead)}
                showMarketer
              />
            ))}
          </div>
        )}
      </div>

      {resolvedLeads.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-warm-700 mb-2">History</h2>
          <ResolvedLeadsHistory
            leads={resolvedLeads}
            listClassName={HISTORY_LIST_CLASSNAME}
            renderCard={(lead) => (
              <LeadTimelineCard
                key={lead.id}
                lead={lead}
                to={`${leadPathPrefix}/leads/${lead.id}`}
                marketerName={marketerNameFor(lead)}
                showMarketer
              />
            )}
          />
        </div>
      )}
    </div>
  )
}
