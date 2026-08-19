import { useId } from 'react'

export function TextField({ label, value, onChange, error, optional, type = 'text' }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-warm-700 mb-1">
        {label} {optional && <span className="text-warm-400 font-normal">(optional)</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-warm-300 px-3 py-2.5 text-base text-warm-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
      />
      {error && <p className="mt-1 text-xs text-clay-700">{error}</p>}
    </div>
  )
}

export function SelectField({ label, value, onChange, error, options }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-warm-700 mb-1">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-warm-300 px-3 py-2.5 text-base text-warm-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-clay-700">{error}</p>}
    </div>
  )
}

export function TextAreaField({ label, value, onChange, optional }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-warm-700 mb-1">
        {label} {optional && <span className="text-warm-400 font-normal">(optional)</span>}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-warm-300 px-3 py-2.5 text-base text-warm-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
      />
    </div>
  )
}
