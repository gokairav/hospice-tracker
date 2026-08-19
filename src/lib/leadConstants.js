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

export function getInitials(firstName, lastName) {
  const a = (firstName || '').trim().charAt(0)
  const b = (lastName || '').trim().charAt(0)
  return (a + b).toUpperCase() || '?'
}

// Shared by the add-lead form and the in-place lead editor
export function validateLeadCoreFields(form) {
  const errors = {}
  if (!form.patient_first_name.trim()) errors.patient_first_name = 'First name is required.'
  if (!form.patient_last_name.trim()) errors.patient_last_name = 'Last name is required.'
  if (!form.patient_dob) errors.patient_dob = 'Date of birth is required.'
  if (!form.primary_diagnosis.trim()) errors.primary_diagnosis = 'Primary diagnosis is required.'
  if (!form.location_name.trim()) errors.location_name = 'Location name is required.'
  if (!form.location_type) errors.location_type = 'Location type is required.'
  if (!form.referral_source_name.trim()) errors.referral_source_name = 'Referral source name is required.'
  if (!form.referral_source_type) errors.referral_source_type = 'Referral source type is required.'
  if (!form.referral_date) errors.referral_date = 'Referral date is required.'
  return errors
}
