export default function SplashScreen() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white">
      {/* Logo will be dropped in here once the file is provided */}
      <div className="w-[180px] flex items-center justify-center text-slate-400 text-sm text-center">
        Expert Hospice CRM
      </div>
      <div className="mt-6 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600" />
    </div>
  )
}
