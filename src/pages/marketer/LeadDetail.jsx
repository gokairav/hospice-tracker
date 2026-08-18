import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import StatusBadge from '../../components/StatusBadge'
import RequestReviewButton from '../../components/RequestReviewButton'
import StatusEditor from './StatusEditor'
import ReminderForm from './ReminderForm'
import CallLogSection from './CallLogSection'
import { calculateAge } from '../../lib/leadConstants'

export default function LeadDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [lead, setLead] = useState(null)
  const [rejectionReasons, setRejectionReasons] = useState([])
  const [callLogs, setCallLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function load() {
      setLoading(true)
      setError('')

      const [leadResult, reasonsResult, logsResult] = await Promise.all([
        supabase.from('leads').select('*').eq('id', id).single(),
        supabase.from('rejection_reasons').select('*').order('id'),
        supabase.from('call_logs').select('*').eq('lead_id', id).order('log_date', { ascending: false }),
      ])

      if (!isMounted) return

      if (leadResult.error) {
        setError(leadResult.error.message)
      } else {
        setLead(leadResult.data)
      }

      if (!reasonsResult.error) setRejectionReasons(reasonsResult.data)
      if (!logsResult.error) setCallLogs(logsResult.data)

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
        <Link to="/marketer" className="text-sm text-slate-500">
          &larr; Back to leads
        </Link>
        <p className="mt-4 text-sm text-red-600">{error || 'Lead not found.'}</p>
      </div>
    )
  }

  return (
    <div className="px-4 py-4 pb-10">
      <Link to="/marketer" className="text-sm text-slate-500">
        &larr; Back to leads
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

      <div className="mt-4 bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        <Field label="Primary diagnosis" value={lead.primary_diagnosis} />
        <Field label="Secondary diagnoses" value={lead.secondary_diagnoses} />
        <Field label="Location" value={lead.location_name} />
        <Field label="Location type" value={lead.location_type} />
        <Field label="Referral source" value={lead.referral_source_name} />
        <Field label="Referral source type" value={lead.referral_source_type} />
        <Field label="Referring contact" value={lead.referring_contact_name} />
        <Field label="Referring contact phone" value={lead.referring_contact_phone} />
        <Field label="Referral date" value={lead.referral_date} />
        {lead.status === 'admitted' && <Field label="Admission date" value={lead.admitted_date} />}
        {lead.status === 'admitted' && <Field label="Benefit period" value={lead.benefit_period} />}
        {(lead.status === 'rejected' || lead.status === 'patient_declined') && (
          <>
            <Field label="Rejection reason" value={lead.rejection_reason} />
            <Field label="Rejection notes" value={lead.rejection_notes} />
          </>
        )}
        <Field label="Notes" value={lead.notes} />
      </div>

      <StatusEditor lead={lead} rejectionReasons={rejectionReasons} onUpdated={setLead} />

      <div className="mt-4">
        <ReminderForm leadId={lead.id} marketerId={user.id} />
      </div>

      {(lead.referring_contact_name || lead.referring_contact_phone) && (
        <div className="mt-4">
          <RequestReviewButton
            contactName={lead.referring_contact_name}
            phone={lead.referring_contact_phone}
          />
        </div>
      )}

      <CallLogSection
        leadId={lead.id}
        marketerId={user.id}
        logs={callLogs}
        onLogAdded={(log) => setCallLogs((prev) => [log, ...prev])}
      />
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div className="px-3 py-2.5">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm text-slate-900 mt-0.5">{value || '—'}</p>
    </div>
  )
}
