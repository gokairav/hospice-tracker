import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { LEAD_STATUSES, BENEFIT_PERIODS } from '../../lib/leadConstants'

export default function StatusEditor({ lead, rejectionReasons, onUpdated }) {
  const [status, setStatus] = useState(lead.status)
  const [rejectionReason, setRejectionReason] = useState(lead.rejection_reason ?? '')
  const [rejectionNotes, setRejectionNotes] = useState(lead.rejection_notes ?? '')
  const [admittedDate, setAdmittedDate] = useState(lead.admitted_date ?? '')
  const [benefitPeriod, setBenefitPeriod] = useState(lead.benefit_period ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const isDeclinedOrRejected = status === 'rejected' || status === 'patient_declined'
  const isAdmitted = status === 'admitted'
  const isDirty =
    status !== lead.status ||
    rejectionReason !== (lead.rejection_reason ?? '') ||
    rejectionNotes !== (lead.rejection_notes ?? '') ||
    admittedDate !== (lead.admitted_date ?? '') ||
    benefitPeriod !== (lead.benefit_period ?? '')

  async function handleSave(e) {
    e.preventDefault()
    setError('')

    const updates = { status }

    if (isDeclinedOrRejected) {
      if (!rejectionReason) {
        setError('Please select a rejection reason.')
        return
      }
      updates.rejection_reason = rejectionReason
      updates.rejection_notes = rejectionNotes.trim() || null
    } else {
      updates.rejection_reason = null
      updates.rejection_notes = null
    }

    if (isAdmitted) {
      if (!admittedDate || !benefitPeriod) {
        setError('Please enter both admission date and benefit period.')
        return
      }
      updates.admitted_date = admittedDate
      updates.benefit_period = benefitPeriod
    } else {
      updates.admitted_date = null
      updates.benefit_period = null
    }

    setSaving(true)
    const { data, error: updateError } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', lead.id)
      .select()
      .single()
    setSaving(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    onUpdated(data)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)
  }

  return (
    <form onSubmit={handleSave} className="mt-4 bg-white rounded-xl border border-slate-200 p-3">
      <label htmlFor="status" className="block text-xs font-medium text-slate-500 mb-1">
        Status
      </label>
      <select
        id="status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
      >
        {LEAD_STATUSES.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      {isDeclinedOrRejected && (
        <div className="mt-3 space-y-3">
          <div>
            <label htmlFor="rejectionReason" className="block text-xs font-medium text-slate-500 mb-1">
              Reason
            </label>
            <select
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            >
              <option value="">Select a reason…</option>
              {rejectionReasons.map((r) => (
                <option key={r.id} value={r.reason_text}>
                  {r.reason_text}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="rejectionNotes" className="block text-xs font-medium text-slate-500 mb-1">
              Notes
            </label>
            <textarea
              id="rejectionNotes"
              value={rejectionNotes}
              onChange={(e) => setRejectionNotes(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {isAdmitted && (
        <div className="mt-3 space-y-3">
          <div>
            <label htmlFor="admittedDate" className="block text-xs font-medium text-slate-500 mb-1">
              Admission date
            </label>
            <input
              id="admittedDate"
              type="date"
              value={admittedDate}
              onChange={(e) => setAdmittedDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="benefitPeriod" className="block text-xs font-medium text-slate-500 mb-1">
              Benefit period
            </label>
            <select
              id="benefitPeriod"
              value={benefitPeriod}
              onChange={(e) => setBenefitPeriod(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            >
              <option value="">Select…</option>
              {BENEFIT_PERIODS.map((bp) => (
                <option key={bp} value={bp}>
                  {bp}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      {isDirty && (
        <button
          type="submit"
          disabled={saving}
          className="mt-3 w-full rounded-lg bg-slate-900 text-white font-medium py-2.5 disabled:opacity-60 active:bg-slate-800"
        >
          {saving ? 'Saving…' : 'Save status'}
        </button>
      )}

      {success && <p className="mt-2 text-sm text-green-700 text-center">Status updated.</p>}
    </form>
  )
}
