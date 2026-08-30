import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { parseTypedDob, validateLeadCoreFields } from '../lib/leadConstants'
import { TextField, SelectField } from '../components/FormFields'
import LeadIntakeFields from '../components/LeadIntakeFields'

const initialForm = {
  patient_first_name: '',
  patient_last_name: '',
  patient_dob: '',
  primary_diagnosis: '',
  secondary_diagnoses: '',
  location_name: '',
  location_type: '',
  sameAsLocation: true,
  referral_source_name: '',
  referral_source_type: '',
  referring_contact_name: '',
  referral_date: new Date().toISOString().slice(0, 10),
  notes: '',
}

function dashboardPathForRole(role) {
  if (role === 'owner') return '/owner'
  if (role === 'admin') return '/admin'
  return '/marketer'
}

export default function AddLead() {
  const { user, role } = useAuth()
  const navigate = useNavigate()
  const canAssign = role === 'admin' || role === 'owner'
  const backPath = dashboardPathForRole(role)

  const [form, setForm] = useState(initialForm)
  const [marketers, setMarketers] = useState([])
  const [assignedTo, setAssignedTo] = useState('')
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!canAssign) return
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
  }, [canAssign])

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function validate() {
    const newErrors = validateLeadCoreFields(form)
    if (canAssign && !assignedTo) newErrors.assignedTo = 'Please assign this lead to a marketer or Other.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitError('')
    if (!validate()) return

    const marketerId = canAssign ? (assignedTo === 'other' ? null : assignedTo) : user.id
    const referralName = form.sameAsLocation ? form.location_name.trim() : form.referral_source_name.trim()
    const referralType = form.sameAsLocation ? form.location_type : form.referral_source_type

    setSaving(true)
    const { data, error } = await supabase
      .from('leads')
      .insert({
        marketer_id: marketerId,
        patient_first_name: form.patient_first_name.trim(),
        patient_last_name: form.patient_last_name.trim(),
        patient_dob: parseTypedDob(form.patient_dob),
        primary_diagnosis: form.primary_diagnosis.trim(),
        secondary_diagnoses: form.secondary_diagnoses.trim() || null,
        location_name: form.location_name.trim(),
        location_type: form.location_type,
        referral_source_name: referralName,
        referral_source_type: referralType,
        referring_contact_name: form.referring_contact_name.trim() || null,
        referral_date: form.referral_date,
        status: 'new_lead',
        notes: form.notes.trim() || null,
      })
      .select()
      .single()
    setSaving(false)

    if (error) {
      setSubmitError(error.message)
      return
    }

    navigate(role === 'marketer' ? `/marketer/leads/${data.id}` : backPath)
  }

  return (
    <div className="px-4 py-4 pb-10">
      <Link to={backPath} className="text-sm text-warm-500">
        &larr; Back
      </Link>
      <h1 className="font-heading text-lg font-extrabold text-warm-900 tracking-tight mt-3 mb-4">Add lead</h1>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {canAssign && (
          <SelectField
            label="Assign to"
            value={assignedTo}
            onChange={setAssignedTo}
            error={errors.assignedTo}
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

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-brand-600 text-white font-medium py-2.5 disabled:opacity-60 active:bg-brand-700"
        >
          {saving ? 'Saving…' : 'Add lead'}
        </button>
      </form>
    </div>
  )
}
