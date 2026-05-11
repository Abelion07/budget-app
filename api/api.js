import { store } from "../store/store.js";

const API_BASE = "http://192.168.100.195:3001";
// const API_BASE = "https://budgetapp-mc9i.onrender.com";
// const API_BASE = "http://localhost:3001";
const TOKEN_KEY = "budgetapp_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders(extra = {}) {
  const token = getToken();
  if (!token) return extra;
  return { ...extra, Authorization: `Bearer ${token}` };
}

function isServerError(status) {
  return status >= 500 && status <= 599;
}

async function apiFetch(url, options = {}) {
  if (store.backendStatus === "down" || store.backendStatus === "unknown") {
    store.setBackendStatus("waking");
  }

  try {
    const r = await fetch(url, options);
    if (isServerError(r.status)) {
      store.setBackendStatus("down");
    } else {
      store.setBackendStatus("ok");
    }
    return r;
  } catch (err) {
    store.setBackendStatus("down");
    throw err;
  }
}

export async function loadCurrentUser(userId) {
  const r = await apiFetch(
    `${API_BASE}/api/users/${userId}/transactions`,
    {
      credentials: "include",
      headers: authHeaders(),
    }
  );
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const data = await r.json();

  store.setUser(data);
  return data;
}

export async function loadCategories() {
  const q = await apiFetch(`${API_BASE}/api/allcategories`, {
    credentials: "include",
    headers: authHeaders(),
  });
  if (!q.ok) throw new Error(`HTTP ${q.status}`);
  const kat = await q.json();

  store.setCategories(kat);
  return kat;
}

export async function loginUser(email, password) {
  const r = await apiFetch(`${API_BASE}/api/login`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    const msg = err?.error || `HTTP ${r.status}`;
    throw new Error(msg);
  }

  const data = await r.json();
  if (data?.token) {
    setToken(data.token);
  } else {
    clearToken();
  }
  return data;
}

export async function logoutUser() {
  const r = await apiFetch(`${API_BASE}/api/logout`, {
    method: "POST",
    credentials: "include",
    headers: authHeaders(),
  });
  clearToken();
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

export async function getSessionUser() {
  const r = await apiFetch(`${API_BASE}/api/me`, {
    credentials: "include",
    headers: authHeaders(),
  });
  if (r.status === 401) return null;
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

export async function createTransaction(userId, payload) {
  const r = await apiFetch(
    `${API_BASE}/api/users/${userId}/transactions`,
    {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
      credentials: "include",
    }
  );

  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

export async function updateTransaction(userId, transactionId, payload) {
  const r = await apiFetch(
    `${API_BASE}/api/users/${userId}/transactions/${transactionId}`,
    {
      method: "PUT",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify(payload),
      credentials: "include",
    }
  );

  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

export async function deleteTransaction(userId, transactionId) {
  const r = await apiFetch(
    `${API_BASE}/api/users/${userId}/transactions/${transactionId}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: authHeaders(),
    }
  );

  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}
