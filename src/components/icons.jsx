// Stroke-based line icons, 24x24 viewBox, consistent weight — replaces emoji
// throughout the app. Color comes from currentColor (set via text-* classes).

function base(props) {
  return {
    width: props.size ?? 20,
    height: props.size ?? 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: props.strokeWidth ?? 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: props.className,
  }
}

export function IconLeads(props) {
  return (
    <svg {...base(props)}>
      <path d="M9 2h6a1 1 0 0 1 1 1v2H8V3a1 1 0 0 1 1-1Z" />
      <rect x="5" y="4" width="14" height="18" rx="2" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  )
}

export function IconFollowUps(props) {
  return (
    <svg {...base(props)}>
      <path d="M12 8v4l2.5 2.5" />
      <circle cx="12" cy="13" r="8" />
      <path d="M9 2h6M12 2v3" />
    </svg>
  )
}

export function IconStats(props) {
  return (
    <svg {...base(props)}>
      <path d="M3 3v18h18" />
      <rect x="7" y="12" width="3" height="6" />
      <rect x="12.5" y="8" width="3" height="10" />
      <rect x="18" y="5" width="3" height="13" />
    </svg>
  )
}

export function IconProfile(props) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </svg>
  )
}

export function IconPlus(props) {
  return (
    <svg {...base({ ...props, strokeWidth: props.strokeWidth ?? 2.5 })}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function IconBell(props) {
  return (
    <svg {...base(props)}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

export function IconCheckBadge(props) {
  return (
    <svg {...base(props)}>
      <path d="M8 2v4M16 2v4M3 9h18" />
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <path d="M9 15.5l2 2 4-4.5" />
    </svg>
  )
}

export function IconPeople(props) {
  return (
    <svg {...base(props)}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

export function IconPhone(props) {
  return (
    <svg {...base(props)}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

export function IconTrendUp(props) {
  return (
    <svg {...base({ ...props, strokeWidth: props.strokeWidth ?? 3 })}>
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  )
}

export function IconChevronDown(props) {
  return (
    <svg {...base(props)}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

export function IconTrendDown(props) {
  return (
    <svg {...base({ ...props, strokeWidth: props.strokeWidth ?? 3 })}>
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  )
}
