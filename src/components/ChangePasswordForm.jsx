import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function ChangePasswordForm() {
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  function close() {
    setOpen(false)
    setPassword('')
    setConfirmPassword('')
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSaving(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setSaving(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    close()
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  if (!open) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full rounded-lg border border-warm-300 py-2.5 text-sm font-medium text-warm-700 active:bg-warm-50"
        >
          Change password
        </button>
        {success && <p className="mt-2 text-sm text-sage-600 text-center">Password updated.</p>}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-warm-200 p-3 space-y-3">
      <div>
        <label htmlFor="new-password" className="block text-sm font-medium text-warm-700 mb-1">
          New password
        </label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-warm-300 px-3 py-2.5 text-base text-warm-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
      </div>
      <div>
        <label htmlFor="confirm-password" className="block text-sm font-medium text-warm-700 mb-1">
          Confirm new password
        </label>
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-lg border border-warm-300 px-3 py-2.5 text-base text-warm-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
      </div>

      {error && (
        <div className="rounded-lg bg-clay-50 border border-clay-100 px-3 py-2 text-sm text-clay-700">{error}</div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={close}
          className="flex-1 rounded-lg border border-warm-300 py-2.5 text-sm font-medium text-warm-700 active:bg-warm-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 rounded-lg bg-brand-600 text-white text-sm font-medium py-2.5 disabled:opacity-60 active:bg-brand-700"
        >
          {saving ? 'Saving…' : 'Save password'}
        </button>
      </div>
    </form>
  )
}
