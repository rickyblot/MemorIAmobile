const API_SERVER_URL = '/hcgi/api';
const TOKEN_KEY = 'mm_auth_token';
const USER_KEY = 'mm_auth_user';
const REMEMBER_KEY = 'mm_auth_remember';

function readRememberPreference() {
  try {
    const flag = localStorage.getItem(REMEMBER_KEY);
    // Default to persistent if unset (existing sessions used localStorage)
    return flag !== '0';
  } catch {
    return true;
  }
}

function getPrimaryStore(remember = readRememberPreference()) {
  return remember ? localStorage : sessionStorage;
}

function getSecondaryStore(remember = readRememberPreference()) {
  return remember ? sessionStorage : localStorage;
}

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * @param {string} token
 * @param {object} user
 * @param {{ remember?: boolean }} [options]
 */
export function setAuthSession(token, user, options = {}) {
  const remember = options.remember !== undefined ? Boolean(options.remember) : readRememberPreference();
  try {
    localStorage.setItem(REMEMBER_KEY, remember ? '1' : '0');
  } catch {
    // ignore
  }

  const primary = getPrimaryStore(remember);
  const secondary = getSecondaryStore(remember);

  primary.setItem(TOKEN_KEY, token);
  primary.setItem(USER_KEY, JSON.stringify(user));
  secondary.removeItem(TOKEN_KEY);
  secondary.removeItem(USER_KEY);

  authStore.save(token, user);
}

export function clearAuthSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  } catch {
    // ignore
  }
  authStore.clear();
}

const listeners = new Set();

export const authStore = {
  token: getStoredToken(),
  model: getStoredUser(),
  get isValid() {
    return Boolean(this.token && this.model);
  },
  save(token, model) {
    this.token = token;
    this.model = model;
    listeners.forEach((fn) => fn(token, model));
  },
  clear() {
    this.token = null;
    this.model = null;
    listeners.forEach((fn) => fn(null, null));
  },
  onChange(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },
};

async function parseJsonSafe(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { error: text };
  }
}

/**
 * Authenticated fetch against the Express API (`/hcgi/api`).
 */
export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getStoredToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`${API_SERVER_URL}${path}`, {
    ...options,
    headers,
    body:
      options.body && !(options.body instanceof FormData) && typeof options.body === 'object'
        ? JSON.stringify(options.body)
        : options.body,
  });

  const data = await parseJsonSafe(res);
  if (!res.ok) {
    const err = new Error(data?.error || data?.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

const apiServerClient = {
  fetch: async (url, options = {}) => {
    const headers = new Headers(options.headers || {});
    const token = getStoredToken();
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return window.fetch(API_SERVER_URL + url, { ...options, headers });
  },
};

export default apiServerClient;
export { apiServerClient, API_SERVER_URL };
