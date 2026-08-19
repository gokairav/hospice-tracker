import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { CALL_LOG_TYPES } from '../../lib/leadConstants'

function formatLogDate(isoString) {
  return new Date(isoString).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function logTypeLabel(value) {
  return CALL_LOG_TYPES.find((t) => t.value === value)?.label ?? value
}

export default function CallLogSection({ leadId, marketerId, logs, onLogAdded }) {
  const [open, setOpen] = useState(false)
  const [logType, setLogType] = useState('call')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!note.trim()) {
      setError('Please add a note about this contact.')
      return
    }

    setSaving(true)
    const { data, error: insertError } = await supabase
      .from('call_logs')
      .insert({
        lead_id: leadId,
        marketer_id: marketerId,
        log_type: logType,
        note: note.trim(),
      })
      .select()
      .single()
    setSaving(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    onLogAdded(data)
    setLogType('call')
    setNote('')
    setOpen(false)
  }

  return (
    <div className="mt-4">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full rounded-lg border border-warm-300 py-2.5 text-sm font-medium text-warm-700 active:bg-warm-50"
        >
          Log a call or visit
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-warm-200 p-3 space-y-3">
          <div>
            <label htmlFor="logType" className="block text-xs font-medium text-warm-500 mb-1">
              Type
            </label>
            <select
              id="logType"
              value={logType}
              onChange={(e) => setLogType(e.target.value)}
              className="w-full rounded-lg border border-warm-300 px-3 py-2.5 text-base text-warm-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            >
              {CALL_LOG_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="logNote" className="block text-xs font-medium text-warm-500 mb-1">
              Note
            </label>
            <textarea
              id="logNote"
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
              {saving ? 'Saving…' : 'Save log'}
            </button>
          </div>
        </form>
      )}

      <div className="mt-4">
        <p className="text-xs font-medium text-warm-500 mb-2">Call & visit history</p>
        {logs.length === 0 ? (
          <p className="text-sm text-warm-400">No calls or visits logged yet.</p>
        ) : (
          <ul className="space-y-2">
            {logs.map((log) => (
              <li key={log.id} className="bg-white rounded-lg border border-warm-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-warm-700">{logTypeLabel(log.log_type)}</span>
                  <span className="text-xs text-warm-400">{formatLogDate(log.log_date)}</span>
                </div>
                {log.note && <p className="text-sm text-warm-600 mt-1">{log.note}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
