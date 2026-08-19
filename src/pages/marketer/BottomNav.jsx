import { NavLink } from 'react-router-dom'
import { IconLeads, IconFollowUps, IconStats, IconProfile } from '../../components/icons'

const TABS = [
  { to: '/marketer', label: 'Leads', Icon: IconLeads, end: true },
  { to: '/marketer/follow-ups', label: 'Follow-ups', Icon: IconFollowUps },
  { to: '/marketer/stats', label: 'My Stats', Icon: IconStats },
  { to: '/marketer/profile', label: 'Profile', Icon: IconProfile },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-warm-200 flex pb-[env(safe-area-inset-bottom)]">
      {TABS.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10.5px] font-semibold ${
              isActive ? 'text-brand-600' : 'text-warm-400'
            }`
          }
        >
          <tab.Icon size={21} strokeWidth={2} />
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
