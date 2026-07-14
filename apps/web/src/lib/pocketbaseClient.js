/**
 * MySQL-backed data client with a PocketBase-like surface so existing
 * pages/components keep working after the PB → MySQL migration.
 */
import { apiFetch, authStore, API_SERVER_URL, getStoredToken } from './apiServerClient';

function buildQuery(params = {}) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.set(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : '';
}

/** Expand PB-style {:name} filter helpers used in a few places */
function applyFilterParams(filter, params = {}) {
  if (!filter) return '';
  let out = filter;
  for (const [k, v] of Object.entries(params)) {
    out = out.replaceAll(`{:${k}}`, typeof v === 'string' ? `"${v}"` : String(v));
  }
  return out;
}

class CollectionClient {
  constructor(name) {
    this.name = name;
  }

  async getList(page = 1, perPage = 50, options = {}) {
    const filter = applyFilterParams(options.filter, options.filterParams || {});
    return apiFetch(
      `/data/${this.name}${buildQuery({
        page,
        perPage,
        filter,
        sort: options.sort || '-created',
      })}`,
    );
  }

  async getFullList(options = {}) {
    const filter = applyFilterParams(options.filter, options.filterParams || {});
    // Prefer list endpoint with large page for simpler ownership checks
    const result = await apiFetch(
      `/data/${this.name}${buildQuery({
        page: 1,
        perPage: 500,
        filter,
        sort: options.sort || '-created',
      })}`,
    );
    return result.items || [];
  }

  async getOne(id) {
    return apiFetch(`/data/${this.name}/${id}`);
  }

  async create(data, _options) {
    if (data instanceof FormData) {
      return apiFetch(`/data/${this.name}`, { method: 'POST', body: data });
    }

    const hasFile = Object.values(data || {}).some(
      (v) => typeof File !== 'undefined' && v instanceof File,
    );
    if (hasFile) {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        if (typeof v === 'object' && !(v instanceof File) && !(v instanceof Blob)) {
          fd.append(k, JSON.stringify(v));
        } else {
          fd.append(k, v);
        }
      });
      return apiFetch(`/data/${this.name}`, { method: 'POST', body: fd });
    }

    return apiFetch(`/data/${this.name}`, { method: 'POST', body: data });
  }

  async update(id, data) {
    if (data instanceof FormData) {
      return apiFetch(`/data/${this.name}/${id}`, { method: 'PATCH', body: data });
    }
    const hasFile = Object.values(data || {}).some(
      (v) => typeof File !== 'undefined' && v instanceof File,
    );
    if (hasFile) {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        if (typeof v === 'object' && !(v instanceof File) && !(v instanceof Blob)) {
          fd.append(k, JSON.stringify(v));
        } else {
          fd.append(k, v);
        }
      });
      return apiFetch(`/data/${this.name}/${id}`, { method: 'PATCH', body: fd });
    }
    return apiFetch(`/data/${this.name}/${id}`, { method: 'PATCH', body: data });
  }

  async delete(id) {
    return apiFetch(`/data/${this.name}/${id}`, { method: 'DELETE' });
  }

  async requestPasswordReset(email) {
    return apiFetch('/auth/forgot-password', { method: 'POST', body: { email } });
  }

  async authWithPassword() {
    throw new Error('Use AuthContext login() — password auth goes through /auth/login');
  }

  async authWithOAuth2() {
    throw new Error('Use AuthContext loginWithOAuth() — OAuth goes through /auth/oauth');
  }

  async listAuthMethods() {
    const data = await apiFetch('/auth/providers');
    return {
      oauth2: {
        enabled: (data.providers || []).length > 0,
        providers: (data.providers || []).map((name) => ({ name })),
      },
    };
  }
}

const client = {
  authStore,
  collection(name) {
    return new CollectionClient(name);
  },
  filter(template, params) {
    return applyFilterParams(template, params);
  },
  files: {
    getURL(record, filename) {
      if (!filename && record?.file) filename = record.file;
      if (!filename) return '';
      if (typeof filename === 'string' && (filename.startsWith('http') || filename.startsWith('/'))) {
        return filename;
      }
      // Prefer same-origin API uploads proxy
      return `${API_SERVER_URL}/uploads/${filename}`;
    },
    getUrl(record, filename, opts) {
      return this.getURL(record, filename, opts);
    },
  },
  autoCancellation() {},
};

export default client;
export { client as pocketbaseClient, authStore, getStoredToken };
