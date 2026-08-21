import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import { useAllLeadsData } from '../hooks/useAllLeadsData'
import AdminOverview from './admin/AdminOverview'
import Section from './admin/Section'
import BreakdownList from '../components/BreakdownList'
import AdmitsTrendChart from './admin/AdmitsTrendChart'
import { computeMarketerPerformance, getMonthlyAdmitsTrend } from '../lib/adminStats'
import { BENEFIT_PERIODS } from '../lib/leadConstants'
import { IconProfile } from '../components/icons'

export default function OwnerDashboard() {
  const { profile, signOut } = useAuth()
  const { leads, profiles, loading, error } = useAllLeadsData()

  return (
    <div className="min-h-screen bg-warm-50 pb-10">
      <Header
        right={
          <div className="flex items-center gap-3">
            <Link to="/owner/profile" aria-label="Profile" className="text-warm-500 active:text-warm-700">
              <IconProfile size={20} />
            </Link>
            <button onClick={signOut} className="text-sm font-medium text-warm-500 active:text-warm-700">
              Sign out
            </button>
          </div>
        }
      />
      <div className="px-4 py-4 lg:max-w-4xl lg:mx-auto">
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <h1 className="font-heading text-lg font-extrabold text-warm-900 tracking-tight mb-1">Hi, {profile?.full_name ?? 'there'}</h1>
            <p className="text-sm text-warm-500">Owner dashboard</p>
          </div>
          <Link
            to="/owner/leads/new"
            className="shrink-0 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white text-sm font-bold px-3.5 py-2 shadow-sm shadow-brand-200 active:from-brand-600 active:to-brand-700"
          >
            + Add admit
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-warm-200 border-t-brand-500" />
          </div>
        ) : error ? (
          <div className="rounded-lg bg-clay-50 border border-clay-100 px-3 py-2 text-sm text-clay-700">{error}</div>
        ) : (
          <>
            <AdminOverview leads={leads} profiles={profiles} />

            <div className="lg:grid lg:grid-cols-3 lg:gap-4">
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
                <AdmitsTrendChart data={getMonthlyAdmitsTrend(leads)} />
              </Section>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function MarketerPerformanceTable({ data }) {
  if (data.length === 0) {
    return <p className="text-sm text-warm-400">No marketers yet.</p>
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="text-left">
          <th className="text-[10px] font-bold uppercase tracking-wide text-warm-500 pb-2">Marketer</th>
          <th className="text-[10px] font-bold uppercase tracking-wide text-warm-500 pb-2 text-right">Referrals</th>
          <th className="text-[10px] font-bold uppercase tracking-wide text-warm-500 pb-2 text-right">Admits</th>
          <th className="text-[10px] font-bold uppercase tracking-wide text-warm-500 pb-2 text-right">Conversion</th>
        </tr>
      </thead>
      <tbody>
        {data.map((m) => (
          <tr key={m.id} className="border-t border-warm-100">
            <td className="py-2 text-sm font-bold text-warm-900">{m.name}</td>
            <td className="py-2 text-sm text-warm-700 text-right">{m.totalLeads}</td>
            <td className="py-2 text-sm text-warm-700 text-right">{m.totalAdmits}</td>
            <td className="py-2 text-right">
              <span className="inline-block text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-sage-100 text-sage-600">
                {m.conversionRate}%
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
