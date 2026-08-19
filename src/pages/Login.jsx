import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/Spinner'
import logo from '../assets/logo.png'

export default function Login() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please enter your email and password.')
      return
    }

    setSubmitting(true)
    const { error: signInError } = await signIn(email.trim(), password)
    setSubmitting(false)

    if (signInError) {
      const message = signInError.message.toLowerCase()
      if (message.includes('invalid login credentials')) {
        setError('Incorrect email or password. Please try again.')
      } else if (message.includes('fetch') || message.includes('network')) {
        setError('Could not reach the server. Please check your connection and try again.')
      } else {
        setError(signInError.message)
      }
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-warm-50 px-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Expert Hospice CRM" className="w-[180px] h-auto" />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-warm-200 p-6">
          <h1 className="font-heading text-lg font-extrabold text-warm-900 mb-1">Sign in</h1>
          <p className="text-sm text-warm-500 mb-6">Enter your credentials to access your dashboard.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-warm-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-warm-200 px-3 py-2.5 text-base text-warm-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div className="mb-5">
              <label htmlFor="password" className="block text-sm font-medium text-warm-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-warm-200 px-3 py-2.5 text-base text-warm-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-clay-100 border border-clay-100 px-3 py-2 text-sm text-clay-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white font-semibold py-2.5 shadow-sm shadow-brand-200 disabled:opacity-60 active:from-brand-600 active:to-brand-700"
            >
              {submitting && <Spinner />}
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
