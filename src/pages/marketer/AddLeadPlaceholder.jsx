import { Link } from 'react-router-dom'

export default function AddLeadPlaceholder() {
  return (
    <div className="px-4 py-6">
      <Link to="/marketer" className="text-sm text-slate-500">
        &larr; Back to leads
      </Link>
      <p className="mt-4 text-sm text-slate-500">The add lead form is coming in Step 5.</p>
    </div>
  )
}
