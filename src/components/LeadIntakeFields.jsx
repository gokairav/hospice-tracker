import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { LOCATION_TYPES, calculateAge, parseTypedDob } from '../lib/leadConstants'
import { TextField, SelectField, TextAreaField } from './FormFields'

function dobPreview(input) {
  const iso = parseTypedDob(input)
  if (!iso) return null
  const age = calculateAge(iso)
  const label = new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  return `${label} (age ${age})`
}

// The shared middle section of the add-lead form and the in-place lead
// editor: everything from date of birth through notes. Expects a single
// controlled `form` object (including a `sameAsLocation` boolean) plus
// `errors` and `updateField(field, value)`, matching the pattern the rest
// of these forms already use.
export default function LeadIntakeFields({ form, errors, updateField }) {
  const [referralSourceTypes, setReferralSourceTypes] = useState([])

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

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-warm-700 mb-1">
          Date of birth <span className="text-warm-400 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          inputMode="numeric"
          placeholder="9/12/43"
          value={form.patient_dob}
          onChange={(e) => updateField('patient_dob', e.target.value)}
          className="w-full rounded-lg border border-warm-300 px-3 py-2.5 text-base text-warm-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
        {errors.patient_dob ? (
          <p className="mt-1 text-xs text-clay-700">{errors.patient_dob}</p>
        ) : (
          <p className="mt-1 text-xs text-warm-500">
            {dobPreview(form.patient_dob) ?? "Type it however's easiest — e.g. 9/12/43."}
          </p>
        )}
      </div>

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

      <label className="flex items-start gap-2.5 bg-brand-50 border border-brand-100 rounded-lg px-3 py-2.5">
        <input
          type="checkbox"
          checked={form.sameAsLocation}
          onChange={(e) => updateField('sameAsLocation', e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-brand-600 shrink-0"
        />
        <span className="text-sm">
          <span className="block font-medium text-warm-900">Referral source is the same as location</span>
          <span className="block text-warm-600 text-xs mt-0.5">
            {form.location_name.trim()
              ? `${form.location_name.trim()}${form.location_type ? ` (${form.location_type})` : ''} will be used as the referral source too.`
              : 'The location above will be used as the referral source too.'}
          </span>
        </span>
      </label>

      {!form.sameAsLocation && (
        <div className="space-y-4 pl-3 border-l-2 border-warm-200">
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
        </div>
      )}

      <TextField
        label="Referring contact name"
        optional
        value={form.referring_contact_name}
        onChange={(v) => updateField('referring_contact_name', v)}
      />

      <TextField
        label="Referral date"
        type="date"
        value={form.referral_date}
        onChange={(v) => updateField('referral_date', v)}
        error={errors.referral_date}
      />

      <TextAreaField label="Notes" optional value={form.notes} onChange={(v) => updateField('notes', v)} />
    </>
  )
}
