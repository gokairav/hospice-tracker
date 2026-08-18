export const GOOGLE_REVIEW_URL = 'https://g.page/r/CRKGC8ahTOILEBM/review'

export function buildReviewMessage(contactName) {
  const greeting = contactName ? `Hi ${contactName},` : 'Hi,'
  return `${greeting} thank you for trusting Expert Hospice Care with your referral. If you have a moment, we'd really appreciate a quick Google review: ${GOOGLE_REVIEW_URL}`
}
