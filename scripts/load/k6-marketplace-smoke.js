import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE = __ENV.BASE_URL || 'http://127.0.0.1:5000';

export const options = {
  scenarios: {
    health_and_reads: {
      executor: 'ramping-vus',
      startVUs: 10,
      stages: [
        { duration: '30s', target: 50 },
        { duration: '1m', target: 120 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '20s',
    },
    write_mix: {
      executor: 'constant-vus',
      vus: 30,
      duration: '2m',
      startTime: '20s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.02'],
    http_req_duration: ['p(95)<1200', 'p(99)<2500'],
  },
};

function randomQuery() {
  const q = ['beadwork', 'lakota', 'navajo', 'weaving', 'language'];
  return q[Math.floor(Math.random() * q.length)];
}

export default function () {
  const readEndpoints = [
    '/healthz',
    '/readyz',
    '/api/digital-arts/listings?page=1&limit=12',
    '/api/physical-items/items?page=1&limit=12',
    '/api/freelancers/marketplace/services?page=1&limit=12',
    '/api/courses/catalog?page=1&limit=12',
    '/api/seva/stats',
    '/api/digital-arts/search?q=' + encodeURIComponent(randomQuery()) + '&type=listings&page=1&limit=10',
  ];

  const target = readEndpoints[Math.floor(Math.random() * readEndpoints.length)];
  const res = http.get(BASE + target, {
    tags: { endpoint: target },
    timeout: '10s',
  });

  check(res, {
    'read status acceptable': (r) => r.status === 200 || r.status === 404 || r.status === 503,
  });

  if (__VU % 3 === 0) {
    const eventRes = http.post(
      BASE + '/api/digital-arts/analytics/event',
      JSON.stringify({ event: 'k6_probe', metadata: { vu: __VU, iter: __ITER } }),
      { headers: { 'Content-Type': 'application/json' }, timeout: '10s', tags: { endpoint: 'analytics_event' } }
    );

    check(eventRes, {
      'write status acceptable': (r) => r.status >= 200 && r.status < 500,
    });
  }

  sleep(Math.random() * 1.2);
}
