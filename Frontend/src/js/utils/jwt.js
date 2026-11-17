/**
 * JWT Parser for Vanilla JS without external dependencies
 */
import { UserRole } from '../constants.js';

export function parseJwt(token) {
  if (!token || typeof token !== 'string') return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    // Base64Url decode with UTF-8 support
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);

    // Extract login / name
    const login =
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
      payload.unique_name ||
      payload.name ||
      payload.sub ||
      'Пользователь';

    // Extract role
    const rawRole =
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
      payload.role;

    let role = UserRole.Manager;
    if (rawRole === 'Admin' || rawRole === 1 || rawRole === '1') {
      role = UserRole.Admin;
    } else if (rawRole === 'Manager' || rawRole === 0 || rawRole === '0') {
      role = UserRole.Manager;
    }

    return {
      login,
      role,
      exp: payload.exp,
      raw: payload,
    };
  } catch (err) {
    console.error('Failed to parse JWT token:', err);
    return null;
  }
}

export function isTokenExpired(token) {
  const parsed = parseJwt(token);
  if (!parsed || !parsed.exp) return true;
  return parsed.exp * 1000 <= Date.now();
}
