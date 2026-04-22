import type { NextRequest } from 'next/server';

function isTruthy(value: string | undefined) {
  const normalized = String(value || '').trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes' || normalized === 'on';
}

function isLocalHost(host: string) {
  const normalized = host.trim().toLowerCase();
  return (
    normalized.includes('127.0.0.1') ||
    normalized.includes('localhost') ||
    normalized.includes('::1')
  );
}

export function isServerFullAccessEnabled(req?: NextRequest | null) {
  if (isTruthy(process.env.INDIGENA_FULL_ACCESS) || isTruthy(process.env.NEXT_PUBLIC_INDIGENA_FULL_ACCESS)) {
    return true;
  }

  if (process.env.NODE_ENV === 'production') {
    return false;
  }

  const host = req?.headers.get('host') || '';
  return isLocalHost(host);
}

export function isClientFullAccessEnabled() {
  if (typeof window === 'undefined') return false;
  const publicFlag =
    String(process.env.NEXT_PUBLIC_INDIGENA_FULL_ACCESS || '').trim().toLowerCase();
  if (publicFlag === 'true' || publicFlag === '1') {
    return true;
  }
  return isLocalHost(window.location.host);
}
