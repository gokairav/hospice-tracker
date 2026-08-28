import { RANGE_PRESETS } from '../lib/leadConstants'

export default function RangeFilterPills({ value, onChange }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto">
      {RANGE_PRESETS.map((preset) => (
        <button
          key={preset.key}
          type="button"
          onClick={() => onChange(preset.key)}
          className={`shrink-0 whitespace-nowrap text-[11.5px] font-bold px-3 py-1.5 rounded-full border ${
            value === preset.key
              ? 'bg-brand-600 border-brand-600 text-white'
              : 'bg-white border-warm-200 text-warm-600'
          }`}
        >
          {preset.label}
        </button>
      ))}
    </div>
  )
}
