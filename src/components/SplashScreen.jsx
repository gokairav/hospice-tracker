import logo from '../assets/logo.png'

export default function SplashScreen() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white">
      <img src={logo} alt="Expert Hospice CRM" className="w-[180px] h-auto" />
      <div className="mt-6 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600" />
    </div>
  )
}
