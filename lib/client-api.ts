'use client';

let csrfInFlight: Promise<string | null> | null = null;

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null;
}

export async function ensureCsrfToken(): Promise<string | null> {
  const existing = readCookie('csrf-token');
  if (existing) return existing;

  if (!csrfInFlight) {
    csrfInFlight = (async () => {
      try {
        const res = await fetch('/api/csrf', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data?.csrfToken || readCookie('csrf-token');
      } catch {
        return null;
      } finally {
        csrfInFlight = null;
      }
    })();
  }

  return csrfInFlight;
}

interface ApiFetchOptions extends RequestInit {
  skipCsrf?: boolean;
}

export async function apiFetch(input: RequestInfo | URL, init: ApiFetchOptions = {}) {
  const method = (init.method || 'GET').toUpperCase();
  const shouldAttachCsrf =
    !init.skipCsrf && !['GET', 'HEAD', 'OPTIONS'].includes(method);

  const headers = new Headers(init.headers || {});
  if (shouldAttachCsrf) {
    const token = await ensureCsrfToken();
    if (token) headers.set('x-csrf-token', token);
  }

  return fetch(input, {
    credentials: 'include',
    ...init,
    headers,
  });
}
