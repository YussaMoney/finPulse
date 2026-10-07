const API_BASE = import.meta.env.VITE_API_URL.replace(/\/+$/, "");
const TOKEN_KEY = "finpulse_token";

let unauthorizedHandler = null;

export function onUnauthorized(handler) {
  unauthorizedHandler = handler;
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Storage can be unavailable (e.g. some private modes); the session just won't persist.
  }
}

export async function request(path, { method = "GET", body } = {}) {
  const token = getToken();

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Can't reach the server. Check your internet connection and try again.");
  }

  const data = await res.json().catch(() => ({}));

  if (res.status === 401 && token && unauthorizedHandler) {
    unauthorizedHandler(data.message);
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
}
