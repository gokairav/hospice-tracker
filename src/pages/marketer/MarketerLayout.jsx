import { Outlet } from 'react-router-dom'
import Header from '../../components/Header'
import BottomNav from './BottomNav'

export default function MarketerLayout() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Header />
      <Outlet />
      <BottomNav />
    </div>
  )
}
