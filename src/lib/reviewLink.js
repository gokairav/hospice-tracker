// TODO: swap for the direct "write a review" deep link once we have the
// Google Business Profile Place ID (https://search.google.com/local/writereview?placeid=...)
export const GOOGLE_REVIEW_URL = 'https://www.google.com/search?q=Expert+Hospice+Care'

export function buildReviewMessage(contactName) {
  const greeting = contactName ? `Hi ${contactName},` : 'Hi,'
  return `${greeting} thank you for trusting Expert Hospice Care with your referral. If you have a moment, we'd really appreciate a quick Google review: ${GOOGLE_REVIEW_URL}`
}
