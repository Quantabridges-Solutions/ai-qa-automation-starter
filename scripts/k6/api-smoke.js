/**
 * Optional load smoke for public demo API.
 * Install k6: https://k6.io/docs/get-started/installation/
 * Run: k6 run scripts/k6/api-smoke.js
 * Override: K6_API_BASE=https://jsonplaceholder.typicode.com k6 run ...
 */
import http from 'k6/http';
import { check, sleep } from 'k6';

const base = (__ENV.K6_API_BASE || 'https://jsonplaceholder.typicode.com').replace(/\/$/, '');

export const options = {
  vus: 3,
  duration: '15s',
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<2000'],
  },
};

export default function () {
  const res = http.get(`${base}/posts/1`);
  check(res, {
    'status 200': (r) => r.status === 200,
    'has body': (r) => r.body && r.body.includes('userId'),
  });
  sleep(0.3);
}
