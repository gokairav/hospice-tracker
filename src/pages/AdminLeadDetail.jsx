import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import StatusBadge from '../components/StatusBadge'
import LeadCoreFieldsEditor from '../components/LeadCoreFieldsEditor'
import StatusEditor from './marketer/StatusEditor'
import { calculateAge } from '../lib/leadConstants'

export default function AdminLeadDetail() {
  const { id } = useParams()
  const { role } = useAuth()
  const navigate = useNavigate()
  const backPath = role === 'owner' ? '/owner' : '/admin'

  const [lead, setLead] = useState(null)
  const [rejectionReasons, setRejectionReasons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

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

  async function handleDelete() {
    if (!lead) return
    const confirmed = window.confirm(
      `Permanently delete ${lead.patient_first_name} ${lead.patient_last_name}? This also removes their follow-up reminders and call/visit history. This cannot be undone.`
    )
    if (!confirmed) return

    setDeleteError('')
    setDeleting(true)
    const { error: deleteErr } = await supabase.from('leads').delete().eq('id', lead.id)
    setDeleting(false)

    if (deleteErr) {
      setDeleteError(deleteErr.message)
      return
    }

    navigate(backPath)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-warm-200 border-t-brand-500" />
      </div>
    )
  }

  if (error || !lead) {
    return (
      <div className="px-4 py-6">
        <Link to={backPath} className="text-sm text-warm-500">
          &larr; Back
        </Link>
        <p className="mt-4 text-sm text-clay-700">{error || 'Lead not found.'}</p>
      </div>
    )
  }

  return (
    <div className="px-4 py-4 pb-10">
      <Link to={backPath} className="text-sm text-warm-500">
        &larr; Back
      </Link>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <h1 className="font-heading text-lg font-extrabold text-warm-900 tracking-tight">
            {lead.patient_first_name} {lead.patient_last_name}
          </h1>
          {lead.patient_dob && (
            <p className="text-sm text-warm-500">{calculateAge(lead.patient_dob)} years old</p>
          )}
        </div>
        <StatusBadge status={lead.status} />
      </div>

      <LeadCoreFieldsEditor lead={lead} canReassign onUpdated={setLead} />

      <StatusEditor lead={lead} rejectionReasons={rejectionReasons} onUpdated={setLead} />

      {role === 'owner' && (
        <div className="mt-6 pt-4 border-t border-warm-200">
          {deleteError && (
            <div className="mb-3 rounded-lg bg-clay-50 border border-clay-100 px-3 py-2 text-sm text-clay-700">
              {deleteError}
            </div>
          )}
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="w-full rounded-lg border border-clay-100 text-clay-700 font-semibold py-2.5 disabled:opacity-60 active:bg-clay-50"
          >
            {deleting ? 'Deleting…' : 'Delete lead'}
          </button>
        </div>
      )}
    </div>
  )
}
