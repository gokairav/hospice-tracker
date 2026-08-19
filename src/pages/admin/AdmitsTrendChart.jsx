export default function AdmitsTrendChart({ data }) {
  const width = 600
  const height = 130
  const padX = 20
  const topPad = 15
  const bottomPad = 15
  const max = Math.max(...data.map((d) => d.count), 1)

  const usableWidth = width - padX * 2
  const usableHeight = height - topPad - bottomPad
  const step = data.length > 1 ? usableWidth / (data.length - 1) : 0

  const points = data.map((d, i) => {
    const x = padX + step * i
    const y = topPad + usableHeight - (d.count / max) * usableHeight
    return { x, y, ...d }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const areaPath = `${linePath} L${points[points.length - 1].x},${height - bottomPad} L${points[0].x},${height - bottomPad} Z`

  const last = points[points.length - 1]

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none">
        <defs>
          <linearGradient id="admitsTrendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(58% 0.10 150)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="oklch(58% 0.10 150)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#admitsTrendGradient)" />
        <path d={linePath} fill="none" stroke="oklch(58% 0.10 150)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={last.x} cy={last.y} r="4.5" fill="oklch(58% 0.10 150)" />
        <text x={last.x - 8} y={last.y - 8} fontSize="10" fontWeight="700" fill="currentColor" textAnchor="end" className="text-warm-700">
          {last.label}: {last.count}
        </text>
      </svg>
      <div className="flex justify-between mt-0.5 px-1">
        {data.map((d) => (
          <span key={d.label} className="text-[10.5px] font-semibold text-warm-400">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  )
}
