import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { ACTIVE_STATUSES, isAdmittedThisMonth } from '../../lib/leadConstants'
import StatCard from '../../components/StatCard'

export default function MarketerStats() {
  const { user } = useAuth()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    let isMounted = true

    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('leads')
        .select('status, admitted_date')
        .eq('marketer_id', user.id)

      if (!isMounted) return
      if (error) setError(error.message)
      else setLeads(data)
      setLoading(false)
    }

    load()
    return () => {
      isMounted = false
    }
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 py-6">
        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>
      </div>
    )
  }

  const total = leads.length
  const active = leads.filter((l) => ACTIVE_STATUSES.includes(l.status)).length
  const admittedTotal = leads.filter((l) => l.status === 'admitted').length
  const admitsThisMonth = leads.filter(isAdmittedThisMonth).length
  const conversionRate = total > 0 ? Math.round((admittedTotal / total) * 100) : 0

  return (
    <div className="px-4 py-4">
      <h1 className="text-lg font-semibold text-slate-900 mb-4">My Stats</h1>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total leads" value={total} />
        <StatCard label="Active leads" value={active} />
        <StatCard label="Admits this month" value={admitsThisMonth} />
        <StatCard label="Total admits" value={admittedTotal} />
      </div>

      <div className="mt-3 bg-white rounded-xl border border-slate-200 p-4">
        <p className="text-2xl font-semibold text-slate-900">{conversionRate}%</p>
        <p className="text-xs text-slate-500 mt-0.5">Conversion rate (admits / total leads)</p>
      </div>
    </div>
  )
}
