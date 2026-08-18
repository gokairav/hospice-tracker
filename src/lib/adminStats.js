import { isAdmittedThisMonth } from './leadConstants'

export function countBy(items, keyFn) {
  const counts = {}
  for (const item of items) {
    const key = keyFn(item)
    counts[key] = (counts[key] ?? 0) + 1
  }
  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
}

export function computeMarketerPerformance(leads, profiles) {
  const marketers = profiles.filter((p) => p.role === 'marketer')

  return marketers
    .map((m) => {
      const marketerLeads = leads.filter((l) => l.marketer_id === m.id)
      const totalLeads = marketerLeads.length
      const totalAdmits = marketerLeads.filter((l) => l.status === 'admitted').length
      const admitsThisMonth = marketerLeads.filter(isAdmittedThisMonth).length
      const conversionRate = totalLeads > 0 ? Math.round((totalAdmits / totalLeads) * 100) : 0

      return { id: m.id, name: m.full_name, totalLeads, admitsThisMonth, conversionRate }
    })
    .sort((a, b) => b.totalLeads - a.totalLeads)
}

export function getMonthlyAdmitsTrend(leads, monthsBack = 6) {
  const now = new Date()
  const months = []
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({ year: d.getFullYear(), month: d.getMonth(), label: d.toLocaleDateString(undefined, { month: 'short' }) })
  }

  return months.map(({ year, month, label }) => ({
    label,
    count: leads.filter((l) => {
      if (l.status !== 'admitted' || !l.admitted_date) return false
      const admittedDate = new Date(l.admitted_date)
      return admittedDate.getFullYear() === year && admittedDate.getMonth() === month
    }).length,
  }))
}
