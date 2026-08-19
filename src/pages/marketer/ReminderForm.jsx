import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function ReminderForm({ leadId, marketerId }) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!date) {
      setError('Please choose a reminder date.')
      return
    }

    setSaving(true)
    const { error: insertError } = await supabase.from('follow_up_reminders').insert({
      lead_id: leadId,
      marketer_id: marketerId,
      reminder_date: date,
      note: note.trim() || null,
    })
    setSaving(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    setDate('')
    setNote('')
    setOpen(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2500)
  }

  if (!open) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full rounded-lg border border-warm-300 py-2.5 text-sm font-medium text-warm-700 active:bg-warm-50"
        >
          Set follow-up reminder
        </button>
        {success && <p className="mt-2 text-sm text-sage-600 text-center">Reminder saved.</p>}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-warm-200 p-3 space-y-3">
      <div>
        <label htmlFor="reminderDate" className="block text-xs font-medium text-warm-500 mb-1">
          Reminder date
        </label>
        <input
          id="reminderDate"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border border-warm-300 px-3 py-2.5 text-base text-warm-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
      </div>
      <div>
        <label htmlFor="reminderNote" className="block text-xs font-medium text-warm-500 mb-1">
          Note
        </label>
        <textarea
          id="reminderNote"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-warm-300 px-3 py-2.5 text-base text-warm-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-clay-50 border border-clay-100 px-3 py-2 text-sm text-clay-700">{error}</div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 rounded-lg border border-warm-300 py-2.5 text-sm font-medium text-warm-700 active:bg-warm-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 rounded-lg bg-brand-600 text-white text-sm font-medium py-2.5 disabled:opacity-60 active:bg-brand-700"
        >
          {saving ? 'Saving…' : 'Save reminder'}
        </button>
      </div>
    </form>
  )
}
