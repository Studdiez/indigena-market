const crypto = require('crypto');

const DEFAULT_PROVIDER = (process.env.TOURISM_PAYMENT_PROVIDER || 'simulated').trim().toLowerCase();
const STRIPE_SECRET_KEY = String(process.env.STRIPE_SECRET_KEY || '').trim();
const WEBHOOK_SECRET = String(process.env.TOURISM_PAYMENT_WEBHOOK_SECRET || '').trim();

function toMinorUnits(amount) {
  return Math.max(0, Math.round(Number(amount || 0) * 100));
}

function normalizeCurrency(currency) {
  return String(currency || 'USD').trim().toLowerCase() || 'usd';
}

async function stripeRequest(path, payload, idempotencyKey = '') {
  if (!STRIPE_SECRET_KEY) {
    throw new Error('Stripe secret key not configured');
  }

  const body = new URLSearchParams();
  Object.entries(payload || {}).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    body.append(k, String(v));
  });

  const headers = {
    Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  if (idempotencyKey) {
    headers['Idempotency-Key'] = idempotencyKey;
  }

  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method: 'POST',
    headers,
    body
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || `Stripe request failed (${res.status})`);
  }
  return data;
}

function getProvider() {
  if ((DEFAULT_PROVIDER === 'stripe' || DEFAULT_PROVIDER === 'stripe_live') && STRIPE_SECRET_KEY) {
    return 'stripe';
  }
  return 'simulated';
}

async function createPaymentIntent({
  bookingId,
  amount,
  currency,
  idempotencyKey = '',
  metadata = {}
}) {
  const provider = getProvider();
  if (provider === 'stripe') {
    const stripeIntent = await stripeRequest(
      '/payment_intents',
      {
        amount: toMinorUnits(amount),
        currency: normalizeCurrency(currency),
        'metadata[bookingId]': bookingId,
        ...Object.entries(metadata || {}).reduce((acc, [k, v]) => {
          acc[`metadata[${k}]`] = String(v);
          return acc;
        }, {})
      },
      idempotencyKey
    );
    return {
      provider,
      paymentIntentId: stripeIntent.id,
      clientSecret: stripeIntent.client_secret || '',
      status: stripeIntent.status || 'requires_confirmation',
      raw: stripeIntent
    };
  }

  return {
    provider: 'simulated',
    paymentIntentId: `pi-sim-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    clientSecret: '',
    status: 'requires_confirmation',
    raw: {}
  };
}

async function confirmPayment({ paymentIntentId, idempotencyKey = '' }) {
  const provider = getProvider();
  if (provider === 'stripe') {
    const stripeIntent = await stripeRequest(`/payment_intents/${paymentIntentId}/confirm`, {}, idempotencyKey);
    return {
      provider,
      paymentIntentId: stripeIntent.id,
      status: stripeIntent.status || 'requires_capture',
      captured: stripeIntent.status === 'succeeded',
      paymentReference: stripeIntent.latest_charge || stripeIntent.id,
      raw: stripeIntent
    };
  }

  return {
    provider: 'simulated',
    paymentIntentId,
    status: 'succeeded',
    captured: true,
    paymentReference: `pay-sim-${Date.now()}`,
    raw: {}
  };
}

function buildWebhookSignature(payloadText, timestamp) {
  if (!WEBHOOK_SECRET) return '';
  const base = `${timestamp}.${payloadText}`;
  return crypto.createHmac('sha256', WEBHOOK_SECRET).update(base).digest('hex');
}

function verifyWebhookSignature(headers, payload) {
  if (!WEBHOOK_SECRET) return false;
  const receivedSig = String(headers['x-tourism-signature'] || '').trim().toLowerCase();
  const timestamp = String(headers['x-tourism-timestamp'] || '').trim();
  if (!receivedSig || !timestamp) return false;

  const payloadText = JSON.stringify(payload || {});
  const expected = buildWebhookSignature(payloadText, timestamp);
  if (!expected) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(receivedSig));
}

module.exports = {
  getProvider,
  createPaymentIntent,
  confirmPayment,
  verifyWebhookSignature,
  buildWebhookSignature
};

