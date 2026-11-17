/**
 * Base HTTP API Client with Bearer Token Injection
 * Strictly requires active Backend connection (no offline mocks)
 */
import { TOKEN_STORAGE_KEY } from '../constants.js';
import { showToast } from '../utils/toast.js';

export class ApiError extends Error {
  constructor(status, message, fieldErrors = null, isNetworkError = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
    this.isNetworkError = isNetworkError;
  }
}

/**
 * Health check helper to verify if the Backend API and Database are reachable
 * Returns database state: 'connected' | 'disconnected' | 'unreachable'
 */
export async function checkBackendConnection() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const response = await fetch('/api/health', {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      return {
        online: true,
        database: data.database === 'Connected' ? 'connected' : 'disconnected',
        status: response.status,
      };
    }

    if (response.status === 503) {
      return {
        online: true,
        database: 'disconnected',
        status: 503,
      };
    }

    if (response.status === 502 || response.status === 504) {
      return { online: false, database: 'unreachable', status: response.status };
    }

    return { online: response.status < 500, database: 'unknown', status: response.status };
  } catch (err) {
    return { online: false, database: 'unreachable', error: err };
  }
}

async function extractErrorInfo(response) {
  let raw = '';
  try {
    raw = await response.text();
  } catch {}

  let parsed = null;
  if (raw) {
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = raw;
    }
  }

  let message = '';
  let fieldErrors = null;

  if (typeof parsed === 'string') {
    if (
      parsed.includes('<html') ||
      parsed.includes('<!DOCTYPE') ||
      parsed.includes('502 Bad Gateway') ||
      parsed.includes('504 Gateway')
    ) {
      message = 'Сервер бэкенда недоступен (Bad Gateway). Проверьте запуск Docker-образа или сервера на порту 5000.';
    } else {
      message = parsed;
    }
  } else if (parsed && typeof parsed === 'object') {
    fieldErrors = parsed.errors || null;
    message = parsed.detail || parsed.message || '';

    // If no explicit detail/message, but fieldErrors are present, combine them
    if (!message && fieldErrors && typeof fieldErrors === 'object') {
      const msgs = Object.values(fieldErrors)
        .flatMap((v) => (Array.isArray(v) ? v : [v]))
        .filter(Boolean);
      if (msgs.length > 0) {
        message = msgs.join('. ');
      }
    }

    if (!message) {
      message = parsed.title || '';
    }
  }

  return {
    message: message || `Ошибка HTTP ${response.status}`,
    fieldErrors,
  };
}

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response = null;

  try {
    response = await fetch(endpoint, {
      ...options,
      headers,
    });
  } catch (netErr) {
    console.error('Network connection error:', netErr);
    throw new ApiError(
      0,
      'Сервер бэкенда недоступен. Проверьте, запущен ли Docker-образ или бэкенд на http://localhost:5000.',
      null,
      true
    );
  }

  // Check if proxy/gateway returned 502/503/504 because backend is down
  if (response.status === 502 || response.status === 503 || response.status === 504) {
    throw new ApiError(
      response.status,
      `Сервер бэкенда недоступен (${response.status} Bad Gateway). Убедитесь, что запущен Docker-контейнер backend или сервер на порту 5000.`,
      null,
      true
    );
  }

  // Check Vite dev-server proxy ECONNREFUSED
  if (response.status === 500) {
    const clone = response.clone();
    try {
      const text = await clone.text();
      if (
        text.includes('ECONNREFUSED') ||
        text.includes('Proxy error') ||
        text.includes('connect error')
      ) {
        throw new ApiError(
          500,
          'Сервер бэкенда недоступен (ECONNREFUSED). Проверьте, запущен ли Docker-образ или локальный сервер на порту 5000.',
          null,
          true
        );
      }
    } catch (e) {
      if (e instanceof ApiError) throw e;
    }
  }

  // 204 No Content
  if (response.status === 204) {
    return {};
  }

  // 401 Unauthorized
  if (response.status === 401) {
    const lowerEndpoint = endpoint.toLowerCase();
    if (lowerEndpoint.includes('/authorization') || lowerEndpoint.includes('/users/authorization')) {
      const { message } = await extractErrorInfo(response);
      throw new ApiError(401, message || 'Неверный логин или пароль');
    }

    localStorage.removeItem(TOKEN_STORAGE_KEY);
    showToast('Сессия недействительна. Авторизуйтесь снова', 'error');
    setTimeout(() => {
      window.location.href = '/index.html';
    }, 1000);
    throw new ApiError(401, 'Требуется авторизация');
  }

  // 403 Forbidden
  if (response.status === 403) {
    showToast('Недостаточно прав (требуется роль Admin)', 'error');
    throw new ApiError(403, 'Доступ запрещен');
  }

  // 400 Bad Request, 409 Conflict, 422 Unprocessable Entity
  if (response.status === 400 || response.status === 409 || response.status === 422) {
    const { message, fieldErrors } = await extractErrorInfo(response);
    throw new ApiError(response.status, message, fieldErrors);
  }

  // 404 Not Found
  if (response.status === 404) {
    const { message } = await extractErrorInfo(response);
    const displayMsg =
      message && !message.includes('404') ? message : 'Запрошенный ресурс не найден';
    showToast(displayMsg, 'error');
    throw new ApiError(404, displayMsg);
  }

  // Real 500+ from Backend
  if (response.status >= 500) {
    const { message } = await extractErrorInfo(response);
    showToast(`Ошибка сервера: ${message}`, 'error');
    throw new ApiError(response.status, message);
  }

  if (!response.ok) {
    throw new ApiError(response.status, `HTTP Error ${response.status}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return await response.text();
}

export const api = {
  get: (url) => apiRequest(url, { method: 'GET' }),
  post: (url, body) =>
    apiRequest(url, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  put: (url, body) =>
    apiRequest(url, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  delete: (url) => apiRequest(url, { method: 'DELETE' }),
};
