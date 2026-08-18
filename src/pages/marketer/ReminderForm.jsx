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
          className="w-full rounded-lg border border-slate-300 py-2.5 text-sm font-medium text-slate-700 active:bg-slate-50"
        >
          Set follow-up reminder
        </button>
        {success && <p className="mt-2 text-sm text-green-700 text-center">Reminder saved.</p>}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-3 space-y-3">
      <div>
        <label htmlFor="reminderDate" className="block text-xs font-medium text-slate-500 mb-1">
          Reminder date
        </label>
        <input
          id="reminderDate"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
        />
      </div>
      <div>
        <label htmlFor="reminderNote" className="block text-xs font-medium text-slate-500 mb-1">
          Note
        </label>
        <textarea
          id="reminderNote"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 rounded-lg border border-slate-300 py-2.5 text-sm font-medium text-slate-700 active:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 rounded-lg bg-slate-900 text-white text-sm font-medium py-2.5 disabled:opacity-60 active:bg-slate-800"
        >
          {saving ? 'Saving…' : 'Save reminder'}
        </button>
      </div>
    </form>
  )
}
