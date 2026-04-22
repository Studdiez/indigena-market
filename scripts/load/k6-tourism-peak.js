import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE = (__ENV.BASE_URL || 'http://127.0.0.1:5000').replace(/\/$/, '');

export const options = {
  scenarios: {
    tourism_reads: {
      executor: 'ramping-vus',
      startVUs: 20,
      stages: [
        { duration: '1m', target: 200 },
        { duration: '3m', target: 450 },
        { duration: '1m', target: 0 }
      ],
      gracefulRampDown: '30s'
    },
    tourism_mutations: {
      executor: 'constant-vus',
      vus: 80,
      duration: '3m',
      startTime: '30s'
    }
  },
  thresholds: {
    http_req_failed: ['rate<0.03'],
    http_req_duration: ['p(95)<1500', 'p(99)<3000']
  }
};

const kinds = ['guided-tours', 'workshops', 'culinary', 'virtual', 'adventure'];

function randomKind() {
  return kinds[Math.floor(Math.random() * kinds.length)];
}

export default function () {
  const readPath = `/api/cultural-tourism/experiences?kind=${encodeURIComponent(randomKind())}&limit=12&sort=relevance`;
  const readRes = http.get(`${BASE}${readPath}`, { timeout: '10s', tags: { endpoint: 'tourism_list' } });
  check(readRes, {
    'tourism list ok': (r) => r.status === 200 || r.status === 503
  });

  if (__VU % 4 === 0) {
    const payload = {
      event: 'tourism_search',
      kind: randomKind(),
      metadata: { k6: true, vu: __VU, iter: __ITER }
    };
    const eventRes = http.post(`${BASE}/api/cultural-tourism/analytics/event`, JSON.stringify(payload), {
      headers: { 'Content-Type': 'application/json' },
      timeout: '8s',
      tags: { endpoint: 'tourism_event' }
    });
    check(eventRes, {
      'tourism event accepted': (r) => r.status >= 200 && r.status < 500
    });
  }

  sleep(Math.random());
}
