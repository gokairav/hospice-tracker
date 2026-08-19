import { useEffect, useId, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { LOCATION_TYPES } from '../lib/leadConstants'

const initialForm = {
  patient_first_name: '',
  patient_last_name: '',
  patient_dob: '',
  primary_diagnosis: '',
  secondary_diagnoses: '',
  location_name: '',
  location_type: '',
  referral_source_name: '',
  referral_source_type: '',
  referring_contact_name: '',
  referring_contact_phone: '',
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
  const [referralSourceTypes, setReferralSourceTypes] = useState([])
  const [marketers, setMarketers] = useState([])
  const [assignedTo, setAssignedTo] = useState('')
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let isMounted = true
    async function load() {
      const { data } = await supabase.from('referral_source_types').select('*').order('name')
      if (isMounted && data) setReferralSourceTypes(data)
    }
    load()
    return () => {
      isMounted = false
    }
  }, [])

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
    const newErrors = {}
    if (canAssign && !assignedTo) newErrors.assignedTo = 'Please assign this lead to a marketer or Other.'
    if (!form.patient_first_name.trim()) newErrors.patient_first_name = 'First name is required.'
    if (!form.patient_last_name.trim()) newErrors.patient_last_name = 'Last name is required.'
    if (!form.patient_dob) newErrors.patient_dob = 'Date of birth is required.'
    if (!form.primary_diagnosis.trim()) newErrors.primary_diagnosis = 'Primary diagnosis is required.'
    if (!form.location_name.trim()) newErrors.location_name = 'Location name is required.'
    if (!form.location_type) newErrors.location_type = 'Location type is required.'
    if (!form.referral_source_name.trim()) newErrors.referral_source_name = 'Referral source name is required.'
    if (!form.referral_source_type) newErrors.referral_source_type = 'Referral source type is required.'
    if (!form.referral_date) newErrors.referral_date = 'Referral date is required.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitError('')
    if (!validate()) return

    const marketerId = canAssign ? (assignedTo === 'other' ? null : assignedTo) : user.id

    setSaving(true)
    const { data, error } = await supabase
      .from('leads')
      .insert({
        marketer_id: marketerId,
        patient_first_name: form.patient_first_name.trim(),
        patient_last_name: form.patient_last_name.trim(),
        patient_dob: form.patient_dob,
        primary_diagnosis: form.primary_diagnosis.trim(),
        secondary_diagnoses: form.secondary_diagnoses.trim() || null,
        location_name: form.location_name.trim(),
        location_type: form.location_type,
        referral_source_name: form.referral_source_name.trim(),
        referral_source_type: form.referral_source_type,
        referring_contact_name: form.referring_contact_name.trim() || null,
        referring_contact_phone: form.referring_contact_phone.trim() || null,
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
      <Link to={backPath} className="text-sm text-slate-500">
        &larr; Back
      </Link>
      <h1 className="text-lg font-semibold text-slate-900 mt-3 mb-4">Add lead</h1>

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

        <TextField
          label="Date of birth"
          type="date"
          value={form.patient_dob}
          onChange={(v) => updateField('patient_dob', v)}
          error={errors.patient_dob}
        />

        <TextField
          label="Primary diagnosis"
          value={form.primary_diagnosis}
          onChange={(v) => updateField('primary_diagnosis', v)}
          error={errors.primary_diagnosis}
        />
        <TextField
          label="Secondary diagnoses"
          optional
          value={form.secondary_diagnoses}
          onChange={(v) => updateField('secondary_diagnoses', v)}
        />

        <TextField
          label="Location name"
          value={form.location_name}
          onChange={(v) => updateField('location_name', v)}
          error={errors.location_name}
        />
        <SelectField
          label="Location type"
          value={form.location_type}
          onChange={(v) => updateField('location_type', v)}
          error={errors.location_type}
          options={LOCATION_TYPES.map((t) => ({ value: t, label: t }))}
        />

        <TextField
          label="Referral source name"
          value={form.referral_source_name}
          onChange={(v) => updateField('referral_source_name', v)}
          error={errors.referral_source_name}
        />
        <SelectField
          label="Referral source type"
          value={form.referral_source_type}
          onChange={(v) => updateField('referral_source_type', v)}
          error={errors.referral_source_type}
          options={referralSourceTypes.map((t) => ({ value: t.name, label: t.name }))}
        />

        <TextField
          label="Referring contact name"
          optional
          value={form.referring_contact_name}
          onChange={(v) => updateField('referring_contact_name', v)}
        />
        <TextField
          label="Referring contact phone"
          optional
          type="tel"
          value={form.referring_contact_phone}
          onChange={(v) => updateField('referring_contact_phone', v)}
        />

        <TextField
          label="Referral date"
          type="date"
          value={form.referral_date}
          onChange={(v) => updateField('referral_date', v)}
          error={errors.referral_date}
        />

        <TextAreaField
          label="Notes"
          optional
          value={form.notes}
          onChange={(v) => updateField('notes', v)}
        />

        {submitError && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-slate-900 text-white font-medium py-2.5 disabled:opacity-60 active:bg-slate-800"
        >
          {saving ? 'Saving…' : 'Add lead'}
        </button>
      </form>
    </div>
  )
}

function TextField({ label, value, onChange, error, optional, type = 'text' }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label} {optional && <span className="text-slate-400 font-normal">(optional)</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

function SelectField({ label, value, onChange, error, options }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

function TextAreaField({ label, value, onChange, optional }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label} {optional && <span className="text-slate-400 font-normal">(optional)</span>}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
      />
    </div>
  )
}
