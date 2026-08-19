import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import StatusBadge from '../components/StatusBadge'
import LeadCoreFieldsEditor from '../components/LeadCoreFieldsEditor'
import StatusEditor from './marketer/StatusEditor'
import { calculateAge } from '../lib/leadConstants'

export default function AdminLeadDetail() {
  const { id } = useParams()
  const { role } = useAuth()
  const backPath = role === 'owner' ? '/owner' : '/admin'

  const [lead, setLead] = useState(null)
  const [rejectionReasons, setRejectionReasons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function load() {
      setLoading(true)
      setError('')

      const [leadResult, reasonsResult] = await Promise.all([
        supabase.from('leads').select('*').eq('id', id).single(),
        supabase.from('rejection_reasons').select('*').order('id'),
      ])

      if (!isMounted) return

      if (leadResult.error) {
        setError(leadResult.error.message)
      } else {
        setLead(leadResult.data)
      }

      if (!reasonsResult.error) setRejectionReasons(reasonsResult.data)
      setLoading(false)
    }

    load()
    return () => {
      isMounted = false
    }
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600" />
      </div>
    )
  }

  if (error || !lead) {
    return (
      <div className="px-4 py-6">
        <Link to={backPath} className="text-sm text-slate-500">
          &larr; Back
        </Link>
        <p className="mt-4 text-sm text-red-600">{error || 'Lead not found.'}</p>
      </div>
    )
  }

  return (
    <div className="px-4 py-4 pb-10">
      <Link to={backPath} className="text-sm text-slate-500">
        &larr; Back
      </Link>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            {lead.patient_first_name} {lead.patient_last_name}
          </h1>
          {lead.patient_dob && (
            <p className="text-sm text-slate-500">{calculateAge(lead.patient_dob)} years old</p>
          )}
        </div>
        <StatusBadge status={lead.status} />
      </div>

      <LeadCoreFieldsEditor lead={lead} canReassign onUpdated={setLead} />

      <StatusEditor lead={lead} rejectionReasons={rejectionReasons} onUpdated={setLead} />
    </div>
  )
}
