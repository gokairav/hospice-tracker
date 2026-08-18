import { NavLink } from 'react-router-dom'

const TABS = [
  { to: '/marketer', label: 'Leads', icon: '📋', end: true },
  { to: '/marketer/follow-ups', label: 'Follow-ups', icon: '⏰' },
  { to: '/marketer/stats', label: 'My Stats', icon: '📊' },
  { to: '/marketer/profile', label: 'Profile', icon: '👤' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 flex pb-[env(safe-area-inset-bottom)]">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium ${
              isActive ? 'text-slate-900' : 'text-slate-400'
            }`
          }
        >
          <span className="text-lg leading-none">{tab.icon}</span>
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
