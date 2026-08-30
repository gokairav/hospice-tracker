export const LEAD_STATUSES = [
  { value: 'new_lead', label: 'New Lead', color: 'blue' },
  { value: 'eval_scheduled', label: 'Eval Scheduled', color: 'purple' },
  { value: 'admitted', label: 'Admitted', color: 'green' },
  { value: 'not_ready', label: 'Not Ready', color: 'yellow' },
  { value: 'patient_declined', label: 'Patient Declined', color: 'red' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
  { value: 'lost_expired', label: 'Lost/Expired', color: 'gray' },
  { value: 'ama', label: 'AMA', color: 'gray' },
]

// Statuses that count as a lead still being actively worked
export const ACTIVE_STATUSES = ['new_lead', 'eval_scheduled', 'not_ready']

// An active lead that's been sitting this long without resolving gets flagged
export const ACTIVE_STALE_DAYS = 14

export const RANGE_PRESETS = [
  { key: 'last2w', label: 'Last 2 Weeks' },
  { key: 'month', label: 'This Month' },
  { key: 'lastMonth', label: 'Last Month' },
  { key: 'all', label: 'All Time' },
]

export const BENEFIT_PERIODS = ['BP1', 'BP2', 'BP3', 'BP4', 'BP5+']

export const LOCATION_TYPES = ['Home', 'ALF', 'Residential Care Home', 'SNF', 'Other']

export const CALL_LOG_TYPES = [
  { value: 'call', label: 'Call' },
  { value: 'visit', label: 'Visit' },
  { value: 'email', label: 'Email' },
  { value: 'other', label: 'Other' },
]

export function getStatusMeta(status) {
  return LEAD_STATUSES.find((s) => s.value === status) ?? { value: status, label: status, color: 'gray' }
}

export function calculateAge(dob) {
  if (!dob) return null
  const birthDate = new Date(dob)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

export function isAdmittedThisMonth(lead) {
  if (lead.status !== 'admitted' || !lead.admitted_date) return false
  const d = new Date(lead.admitted_date)
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
}

export function isAdmittedLastMonth(lead) {
  if (lead.status !== 'admitted' || !lead.admitted_date) return false
  const d = new Date(lead.admitted_date)
  const now = new Date()
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  return d.getFullYear() === lastMonth.getFullYear() && d.getMonth() === lastMonth.getMonth()
}

export function isCreatedInLastDays(lead, days) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return new Date(lead.created_at) >= cutoff
}

// The date a resolved lead reached its current status. Admitted leads use the
// admission date the marketer enters; everything else falls back to
// status_changed_at (auto-stamped by a DB trigger), then created_at for
// leads created before that column existed.
export function getOutcomeDate(lead) {
  if (lead.status === 'admitted' && lead.admitted_date) return lead.admitted_date
  if (lead.status_changed_at) return lead.status_changed_at.slice(0, 10)
  return lead.created_at.slice(0, 10)
}

export function formatShortDate(dateStr) {
  if (!dateStr) return '—'
  const isoDate = dateStr.length === 10 ? `${dateStr}T00:00:00` : dateStr
  return new Date(isoDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function daysBetween(startStr, endStr) {
  const start = new Date(`${startStr.slice(0, 10)}T00:00:00`)
  const end = new Date(`${endStr.slice(0, 10)}T00:00:00`)
  return Math.max(0, Math.round((end - start) / 86400000))
}

export function isDateInRange(dateStr, presetKey) {
  if (!dateStr) return false
  if (presetKey === 'all') return true

  const d = new Date(`${dateStr.slice(0, 10)}T00:00:00`)
  const now = new Date()

  if (presetKey === 'last2w') {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 14)
    cutoff.setHours(0, 0, 0, 0)
    return d >= cutoff
  }
  if (presetKey === 'month') {
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  }
  if (presetKey === 'lastMonth') {
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    return d.getFullYear() === lastMonth.getFullYear() && d.getMonth() === lastMonth.getMonth()
  }
  return true
}

// Groups leads into {key, label, leads} buckets by month, newest first.
export function groupLeadsByMonth(leads, dateFn) {
  const groups = {}
  for (const lead of leads) {
    const dateStr = dateFn(lead)
    if (!dateStr) continue
    const d = new Date(`${dateStr.slice(0, 10)}T00:00:00`)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!groups[key]) {
      groups[key] = { key, label: d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }), leads: [] }
    }
    groups[key].leads.push(lead)
  }
  return Object.values(groups).sort((a, b) => (a.key < b.key ? 1 : -1))
}

export function getInitials(firstName, lastName) {
  const a = (firstName || '').trim().charAt(0)
  const b = (lastName || '').trim().charAt(0)
  return (a + b).toUpperCase() || '?'
}

// Parses a typed date like "9/12/43" or "09/12/1943" into an ISO date
// string, or null if it's empty or doesn't parse. Every patient here is an
// adult, so a 2-digit year always resolves to 19XX rather than 20XX.
export function parseTypedDob(input) {
  const v = (input || '').trim()
  if (!v) return null

  const m = v.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/)
  if (!m) return null

  const mo = Number(m[1])
  const day = Number(m[2])
  let yr = Number(m[3])
  if (yr < 100) yr += 1900
  if (mo < 1 || mo > 12 || day < 1 || day > 31) return null

  const d = new Date(yr, mo - 1, day)
  if (d.getFullYear() !== yr || d.getMonth() !== mo - 1 || d.getDate() !== day) return null

  return `${yr}-${String(mo).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

// ISO date -> the typed format the DOB field displays, for pre-filling an
// existing lead's date of birth into the editable text input.
export function formatDobForInput(isoDate) {
  if (!isoDate) return ''
  const [yr, mo, day] = isoDate.split('-').map(Number)
  return `${mo}/${day}/${yr}`
}

// Shared by the add-lead form and the in-place lead editor
export function validateLeadCoreFields(form) {
  const errors = {}
  if (!form.patient_first_name.trim()) errors.patient_first_name = 'First name is required.'
  if (!form.patient_last_name.trim()) errors.patient_last_name = 'Last name is required.'
  if (form.patient_dob.trim() && !parseTypedDob(form.patient_dob)) {
    errors.patient_dob = "Doesn't look like a date — try 9/12/43."
  }
  if (!form.primary_diagnosis.trim()) errors.primary_diagnosis = 'Primary diagnosis is required.'
  if (!form.location_name.trim()) errors.location_name = 'Location name is required.'
  if (!form.location_type) errors.location_type = 'Location type is required.'
  if (!form.sameAsLocation) {
    if (!form.referral_source_name.trim()) errors.referral_source_name = 'Referral source name is required.'
    if (!form.referral_source_type) errors.referral_source_type = 'Referral source type is required.'
  }
  if (!form.referral_date) errors.referral_date = 'Referral date is required.'
  return errors
}
