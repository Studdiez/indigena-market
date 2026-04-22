/* eslint-disable no-console */
const crypto = require('crypto');
const BASE = (process.env.API_BASE_URL || 'http://127.0.0.1:5000').replace(/\/$/, '');
const USER_ACTION_SECRET = String(process.env.USER_ACTION_SECRET || process.env.E2E_USER_ACTION_SECRET || 'dev-user-secret').trim();
const WALLET = String(process.env.E2E_WALLET || 'demo-traveler-wallet').trim().toLowerCase();
const EMAIL = String(process.env.E2E_EMAIL || 'e2e.tester@example.com').trim().toLowerCase();

function userSignedHeaders(action, targetId, body = {}) {
  const timestamp = Date.now().toString();
  const nonce = crypto.randomBytes(12).toString('hex');
  const payload = JSON.stringify(body || {});
  const signature = crypto
    .createHmac('sha256', USER_ACTION_SECRET)
    .update(`${timestamp}:${nonce}:${action}:${targetId}:${WALLET}:${payload}`)
    .digest('hex');
  return {
    'x-wallet-address': WALLET,
    'x-user-action-timestamp': timestamp,
    'x-user-action-nonce': nonce,
    'x-user-action-signature': signature
  };
}

async function http(method, path, body, headers = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let json = {};
  try {
    json = await res.json();
  } catch {
    json = {};
  }
  if (!res.ok) {
    throw new Error(`${method} ${path} -> ${res.status}: ${json.message || 'request failed'}`);
  }
  return json.data ?? json;
}

async function main() {
  const list = await http('GET', '/api/cultural-tourism/experiences?limit=5');
  const experience = list.items?.[0];
  if (!experience?.id) throw new Error('No tourism experience available for e2e flow.');

  const availability = await http('GET', `/api/cultural-tourism/experiences/${experience.id}/availability?date=${experience.availableNextDate}&guests=1`);
  if (!availability.canBook) throw new Error('Selected experience cannot be booked in e2e flow.');

  const bookingPayload = {
    experienceId: experience.id,
    date: experience.availableNextDate,
    sessionId: experience.sessions?.[0]?.sessionId || 'default',
    sessionLabel: experience.sessions?.[0]?.label || 'General Admission',
    guests: 1,
    travelerName: 'E2E Tester',
    travelerEmail: EMAIL,
    protocolAccepted: true,
    protocolAcknowledgements: experience.consentChecklist || []
  };
  const booking = await http('POST', '/api/cultural-tourism/bookings', bookingPayload, {
    ...userSignedHeaders('create_booking', 'new', bookingPayload),
    'x-idempotency-key': `e2e-${Date.now()}`
  });

  const intentPayload = {
    idempotencyKey: `e2e-intent-${booking.bookingId}`
  };
  const intent = await http('POST', `/api/cultural-tourism/bookings/${booking.bookingId}/payment-intent`, intentPayload, {
    ...userSignedHeaders('create_payment_intent', booking.bookingId, intentPayload),
    'x-idempotency-key': intentPayload.idempotencyKey
  });
  const confirmPayload = {
    idempotencyKey: `e2e-confirm-${booking.bookingId}`,
    paymentReference: intent.paymentIntentId
  };
  const confirmed = await http('POST', `/api/cultural-tourism/bookings/${booking.bookingId}/payment-confirm`, confirmPayload, {
    ...userSignedHeaders('confirm_payment', booking.bookingId, confirmPayload),
    'x-idempotency-key': confirmPayload.idempotencyKey
  });
  if (confirmed.status !== 'confirmed') {
    throw new Error(`Expected confirmed booking, got ${confirmed.status}`);
  }

  const ticket = await http(
    'GET',
    `/api/cultural-tourism/bookings/${booking.bookingId}/ticket`,
    undefined,
    userSignedHeaders('get_booking_ticket', booking.bookingId, {})
  );
  if (!ticket.ticketId) throw new Error('Expected ticket id after payment confirmation');

  const reviewPayload = {
    travelerEmail: EMAIL,
    rating: 5,
    comment: 'Great experience. Strong protocols and clear communication.'
  };
  const review = await http('POST', `/api/cultural-tourism/bookings/${booking.bookingId}/reviews`, reviewPayload, {
    ...userSignedHeaders('submit_booking_review', booking.bookingId, reviewPayload)
  });
  if (!review.reviewId) throw new Error('Expected review id after review submission');

  console.log('E2E tourism flow passed:', {
    bookingId: booking.bookingId,
    ticketId: ticket.ticketId,
    reviewId: review.reviewId,
    experienceId: experience.id
  });
}

main().catch((error) => {
  console.error('E2E tourism flow failed:', error.message || error);
  process.exitCode = 1;
});
