import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import { useAllLeadsData } from '../hooks/useAllLeadsData'
import AdminOverview from './admin/AdminOverview'
import Section from './admin/Section'
import BreakdownList from '../components/BreakdownList'
import MonthlyTrendChart from './admin/MonthlyTrendChart'
import { computeMarketerPerformance, getMonthlyAdmitsTrend } from '../lib/adminStats'
import { BENEFIT_PERIODS } from '../lib/leadConstants'

export default function OwnerDashboard() {
  const { profile, signOut } = useAuth()
  const { leads, profiles, loading, error } = useAllLeadsData()

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <Header
        right={
          <button onClick={signOut} className="text-sm font-medium text-slate-500 active:text-slate-700">
            Sign out
          </button>
        }
      />
      <div className="px-4 py-4">
        <h1 className="text-lg font-semibold text-slate-900 mb-1">Hi, {profile?.full_name ?? 'there'}</h1>
        <p className="text-sm text-slate-500 mb-4">Owner dashboard</p>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600" />
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>
        ) : (
          <>
            <AdminOverview leads={leads} profiles={profiles} />

            <Section title="Marketer performance">
              <MarketerPerformanceTable data={computeMarketerPerformance(leads, profiles)} />
            </Section>

            <Section title="Benefit period breakdown">
              <BreakdownList
                items={BENEFIT_PERIODS.map((bp) => ({
                  label: bp,
                  count: leads.filter((l) => l.benefit_period === bp).length,
                })).filter((item) => item.count > 0)}
                emptyLabel="No admitted patients yet."
              />
            </Section>

            <Section title="Admits trend (last 6 months)">
              <MonthlyTrendChart data={getMonthlyAdmitsTrend(leads)} />
            </Section>
          </>
        )}
      </div>
    </div>
  )
}

function MarketerPerformanceTable({ data }) {
  if (data.length === 0) {
    return <p className="text-sm text-slate-400">No marketers yet.</p>
  }

  return (
    <ul className="divide-y divide-slate-100">
      {data.map((m) => (
        <li key={m.id} className="py-2 first:pt-0 last:pb-0">
          <p className="text-sm font-medium text-slate-900">{m.name}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {m.totalLeads} lead{m.totalLeads === 1 ? '' : 's'} · {m.admitsThisMonth} admit
            {m.admitsThisMonth === 1 ? '' : 's'} this month · {m.conversionRate}% conversion
          </p>
        </li>
      ))}
    </ul>
  )
}
