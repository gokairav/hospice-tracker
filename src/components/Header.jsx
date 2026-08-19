import logo from '../assets/logo.png'

export default function Header({ right }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-warm-200">
      <img src={logo} alt="Expert Hospice CRM" className="w-[120px] h-auto" />
      {right}
    </div>
  )
}
