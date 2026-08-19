import { useState } from 'react'
import { GOOGLE_REVIEW_URL, buildReviewMessage } from '../lib/reviewLink'

// Sends a Google review request to a referral contact — via direct text
// (when we have their number), the device share sheet, or a copy-to-clipboard
// fallback. The contact is the one leaving the review, not the marketer.
export default function RequestReviewButton({ contactName, phone, className = '' }) {
  const [copied, setCopied] = useState(false)
  const message = buildReviewMessage(contactName)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  async function handlePrimaryAction() {
    if (phone) {
      window.location.href = `sms:${phone}?body=${encodeURIComponent(message)}`
      return
    }

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Expert Hospice Care', text: message, url: GOOGLE_REVIEW_URL })
        return
      } catch (err) {
        if (err.name === 'AbortError') return
      }
    }

    await handleCopy()
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handlePrimaryAction}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-gold-500 text-white font-medium py-2.5 active:bg-gold-600"
      >
        ⭐ Request a Google review
      </button>
      <button
        type="button"
        onClick={handleCopy}
        className="w-full text-center text-xs text-warm-500 mt-2 active:text-warm-700"
      >
        {copied ? 'Copied to clipboard!' : 'Or copy the review link'}
      </button>
    </div>
  )
}
