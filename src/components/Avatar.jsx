import { getInitials } from '../lib/leadConstants'

const GRADIENTS = [
  'from-brand-500 to-brand-700',
  'from-sage-500 to-sage-600',
  'from-gold-500 to-gold-600',
  'from-clay-600 to-clay-700',
]

function gradientFor(seed) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length]
}

export default function Avatar({ firstName, lastName, size = 36 }) {
  const initials = getInitials(firstName, lastName)
  const gradient = gradientFor(`${firstName ?? ''}${lastName ?? ''}`)

  return (
    <div
      className={`shrink-0 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  )
}
