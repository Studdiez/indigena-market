/* eslint-disable no-console */
const crypto = require('crypto');

const BASE = (process.env.API_BASE_URL || 'http://127.0.0.1:5000').replace(/\/$/, '');
const USER_ACTION_SECRET = String(process.env.USER_ACTION_SECRET || process.env.E2E_USER_ACTION_SECRET || 'dev-user-secret').trim();
const WALLET = String(process.env.E2E_WALLET || 'demo-traveler-wallet').trim().toLowerCase();
const EMAIL = String(process.env.E2E_EMAIL || 'e2e.tester@example.com').trim().toLowerCase();
const ATTEMPTS = Math.max(2, Number(process.env.E2E_CONCURRENCY_ATTEMPTS || 8));

function userSignedHeaders(action, targetId, body = {}) {
  const timestamp = Date.now().toString();
  const nonce = crypto.randomBytes(12).toString('hex');
  const payload = JSON.stringify(body || {});
  const signature = crypto
    .createHmac('sha256', USER_ACTION_SECRET)
    .update(`${timestamp}:${nonce}:${action}:${targetId}:${WALLET}:${payload}`)
    .digest('hex');
  return {
    'Content-Type': 'application/json',
    'x-wallet-address': WALLET,
    'x-user-action-timestamp': timestamp,
    'x-user-action-nonce': nonce,
    'x-user-action-signature': signature
  };
}

async function request(method, path, body, headers = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  let json = {};
  try {
    json = await res.json();
  } catch {
    json = {};
  }
  return { ok: res.ok, status: res.status, json };
}

async function main() {
  const listRes = await request('GET', '/api/cultural-tourism/experiences?limit=5');
  if (!listRes.ok) throw new Error(`Failed to list experiences (${listRes.status})`);
  const exp = listRes.json?.data?.items?.[0];
  if (!exp?.id) throw new Error('No tourism experience available');

  const sessionId = exp.sessions?.[0]?.sessionId || 'default';
  const date = exp.availableNextDate;
  if (!date) throw new Error('No available date on seed experience');

  const availabilityRes = await request(
    'GET',
    `/api/cultural-tourism/experiences/${exp.id}/availability?date=${date}&guests=1&sessionId=${encodeURIComponent(sessionId)}`
  );
  if (!availabilityRes.ok) throw new Error(`Failed to read availability (${availabilityRes.status})`);
  const capacity = Number(availabilityRes.json?.data?.capacity || 1);
  const guests = Math.max(1, capacity);

  const attempts = Array.from({ length: ATTEMPTS }).map(async (_, idx) => {
    const payload = {
      experienceId: exp.id,
      date,
      sessionId,
      sessionLabel: exp.sessions?.[0]?.label || 'General Admission',
      guests,
      travelerName: `Concurrency Tester ${idx + 1}`,
      travelerEmail: EMAIL,
      protocolAccepted: true,
      protocolAcknowledgements: exp.consentChecklist || []
    };
    const idempotencyKey = `concurrency-${Date.now()}-${idx}`;
    const result = await request('POST', '/api/cultural-tourism/bookings', payload, {
      ...userSignedHeaders('create_booking', 'new', payload),
      'x-idempotency-key': idempotencyKey
    });
    return { idx, status: result.status, ok: result.ok, payload: result.json };
  });

  const results = await Promise.all(attempts);
  const success = results.filter((r) => r.ok);
  const conflicts = results.filter((r) => r.status === 409);

  if (success.length !== 1) {
    console.error('Expected exactly one successful lock winner.');
    console.error(results.map((r) => ({ idx: r.idx, status: r.status, message: r.payload?.message || '' })));
    throw new Error(`Concurrency lock failed, success=${success.length}`);
  }
  if (conflicts.length < ATTEMPTS - 1) {
    console.error(results.map((r) => ({ idx: r.idx, status: r.status, message: r.payload?.message || '' })));
    throw new Error('Expected remaining attempts to be rejected with 409');
  }

  console.log('Concurrency lock test passed:', {
    experienceId: exp.id,
    date,
    sessionId,
    attempts: ATTEMPTS,
    success: success.length,
    conflicts: conflicts.length
  });
}

main().catch((error) => {
  console.error('Concurrency lock test failed:', error.message || error);
  process.exitCode = 1;
});
