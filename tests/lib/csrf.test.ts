import { describe, it, expect, vi, beforeEach } from 'vitest';

// We test the pure functions without mocking crypto —
// generateCsrfToken + verifyCsrfToken are deterministic given a secret.

vi.stubEnv('JWT_SECRET', 'test-secret-key-for-csrf-testing-32chars!');

// Import after env is set
import { generateCsrfToken, verifyCsrfToken, validateCsrf } from '@/lib/csrf';
import { NextRequest } from 'next/server';

describe('CSRF Utilities', () => {
  describe('generateCsrfToken', () => {
    it('generates a token with token.signature format', () => {
      const token = generateCsrfToken();
      expect(token).toContain('.');
      const parts = token.split('.');
      expect(parts).toHaveLength(2);
      expect(parts[0].length).toBe(64); // 32 bytes hex
      expect(parts[1].length).toBe(64); // HMAC-SHA256 hex
    });

    it('generates unique tokens each time', () => {
      const t1 = generateCsrfToken();
      const t2 = generateCsrfToken();
      expect(t1).not.toBe(t2);
    });
  });

  describe('verifyCsrfToken', () => {
    it('verifies a valid token', () => {
      const token = generateCsrfToken();
      expect(verifyCsrfToken(token)).toBe(true);
    });

    it('rejects a tampered token', () => {
      const token = generateCsrfToken();
      const [value] = token.split('.');
      const tampered = `${value}.0000000000000000000000000000000000000000000000000000000000000000`;
      expect(verifyCsrfToken(tampered)).toBe(false);
    });

    it('rejects empty string', () => {
      expect(verifyCsrfToken('')).toBe(false);
    });

    it('rejects token without separator', () => {
      expect(verifyCsrfToken('nodothere')).toBe(false);
    });

    it('rejects token with wrong length signature', () => {
      expect(verifyCsrfToken('abc.def')).toBe(false);
    });
  });

  describe('validateCsrf', () => {
    it('skips validation for GET requests', () => {
      const req = new NextRequest('http://localhost:3000/api/test', { method: 'GET' });
      expect(validateCsrf(req)).toEqual({ valid: true });
    });

    it('skips validation for HEAD requests', () => {
      const req = new NextRequest('http://localhost:3000/api/test', { method: 'HEAD' });
      expect(validateCsrf(req)).toEqual({ valid: true });
    });

    it('skips validation for OPTIONS requests', () => {
      const req = new NextRequest('http://localhost:3000/api/test', { method: 'OPTIONS' });
      expect(validateCsrf(req)).toEqual({ valid: true });
    });

    it('rejects POST when header token is missing', () => {
      const req = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      });
      const result = validateCsrf(req);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('missing');
    });

    it('rejects when header and cookie tokens do not match', () => {
      const token1 = generateCsrfToken();
      const token2 = generateCsrfToken();

      const req = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-csrf-token': token1,
          cookie: `csrf-token=${token2}`,
        },
      });
      const result = validateCsrf(req);
      expect(result.valid).toBe(false);
    });

    it('passes when header and cookie tokens match and are valid', () => {
      const token = generateCsrfToken();

      const req = new NextRequest('http://localhost:3000/api/test', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-csrf-token': token,
          cookie: `csrf-token=${token}`,
        },
      });
      const result = validateCsrf(req);
      expect(result.valid).toBe(true);
    });
  });
});
