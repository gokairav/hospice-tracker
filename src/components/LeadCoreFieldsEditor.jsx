import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { formatDobForInput, parseTypedDob, validateLeadCoreFields } from '../lib/leadConstants'
import { TextField, SelectField } from './FormFields'
import LeadIntakeFields from './LeadIntakeFields'

function fieldsFromLead(lead) {
  return {
    patient_first_name: lead.patient_first_name ?? '',
    patient_last_name: lead.patient_last_name ?? '',
    patient_dob: formatDobForInput(lead.patient_dob),
    primary_diagnosis: lead.primary_diagnosis ?? '',
    secondary_diagnoses: lead.secondary_diagnoses ?? '',
    location_name: lead.location_name ?? '',
    location_type: lead.location_type ?? '',
    sameAsLocation:
      !!lead.location_name &&
      lead.referral_source_name === lead.location_name &&
      lead.referral_source_type === lead.location_type,
    referral_source_name: lead.referral_source_name ?? '',
    referral_source_type: lead.referral_source_type ?? '',
    referring_contact_name: lead.referring_contact_name ?? '',
    referral_date: lead.referral_date ?? '',
    notes: lead.notes ?? '',
  }
}

// In-place editor for a lead's core intake fields, embedded in a lead
// detail screen. Marketers can edit their own leads' fields; when
// canReassign is set (admin/owner), a marketer picker is shown too.
export default function LeadCoreFieldsEditor({ lead, canReassign, onUpdated }) {
  const [form, setForm] = useState(() => fieldsFromLead(lead))
  const [assignedTo, setAssignedTo] = useState(lead.marketer_id ?? 'other')
  const [marketers, setMarketers] = useState([])
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setForm(fieldsFromLead(lead))
    setAssignedTo(lead.marketer_id ?? 'other')
  }, [lead])

  useEffect(() => {
    if (!canReassign) return
    let isMounted = true
    async function load() {
      const { data } = await supabase
        .from('users_profiles')
        .select('id, full_name')
        .eq('role', 'marketer')
        .order('full_name')
      if (isMounted && data) setMarketers(data)
    }
    load()
    return () => {
      isMounted = false
    }
  }, [canReassign])

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const original = fieldsFromLead(lead)
  const isDirty =
    Object.keys(original).some((key) => form[key] !== original[key]) ||
    (canReassign && assignedTo !== (lead.marketer_id ?? 'other'))

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitError('')

    const newErrors = validateLeadCoreFields(form)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    const updates = {
      patient_first_name: form.patient_first_name.trim(),
      patient_last_name: form.patient_last_name.trim(),
      patient_dob: parseTypedDob(form.patient_dob),
      primary_diagnosis: form.primary_diagnosis.trim(),
      secondary_diagnoses: form.secondary_diagnoses.trim() || null,
      location_name: form.location_name.trim(),
      location_type: form.location_type,
      referral_source_name: form.sameAsLocation ? form.location_name.trim() : form.referral_source_name.trim(),
      referral_source_type: form.sameAsLocation ? form.location_type : form.referral_source_type,
      referring_contact_name: form.referring_contact_name.trim() || null,
      referral_date: form.referral_date,
      notes: form.notes.trim() || null,
    }

    if (canReassign) {
      updates.marketer_id = assignedTo === 'other' ? null : assignedTo
    }

    setSaving(true)
    const { data, error } = await supabase.from('leads').update(updates).eq('id', lead.id).select().single()
    setSaving(false)

    if (error) {
      setSubmitError(error.message)
      return
    }

    onUpdated(data)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-4 bg-white rounded-xl border border-warm-200 p-3 space-y-4">
      {canReassign && (
        <SelectField
          label="Assigned to"
          value={assignedTo}
          onChange={setAssignedTo}
          options={[
            ...marketers.map((m) => ({ value: m.id, label: m.full_name })),
            { value: 'other', label: 'Other' },
          ]}
        />
      )}

      <div className="grid grid-cols-2 gap-3">
        <TextField
          label="First name"
          value={form.patient_first_name}
          onChange={(v) => updateField('patient_first_name', v)}
          error={errors.patient_first_name}
        />
        <TextField
          label="Last name"
          value={form.patient_last_name}
          onChange={(v) => updateField('patient_last_name', v)}
          error={errors.patient_last_name}
        />
      </div>

      <LeadIntakeFields form={form} errors={errors} updateField={updateField} />

      {submitError && (
        <div className="rounded-lg bg-clay-50 border border-clay-100 px-3 py-2 text-sm text-clay-700">
          {submitError}
        </div>
      )}

      {isDirty && (
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-brand-600 text-white font-medium py-2.5 disabled:opacity-60 active:bg-brand-700"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      )}

      {success && <p className="text-sm text-sage-600 text-center">Saved.</p>}
    </form>
  )
}
