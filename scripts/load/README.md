# k6 Load Testing

## Prerequisite
- Install k6: https://k6.io/docs/getting-started/installation/

## Smoke test (mixed read/write)
- `k6 run scripts/load/k6-marketplace-smoke.js`

## Target a deployed API
- `k6 run -e BASE_URL=https://api.indigena.global scripts/load/k6-marketplace-smoke.js`

## What it covers
- health/readiness endpoints
- digital art listings and search
- physical and freelancing marketplace list endpoints
- courses catalog and seva stats
- low-volume write probe to analytics event endpoint

## Pass/Fail defaults
- request failure rate under 2%
- p95 under 1200ms
- p99 under 2500ms
