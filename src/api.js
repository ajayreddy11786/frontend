// Thin REST client for the Spring Boot backend.
// Set VITE_API_BASE (in a .env file locally, or as a Render env var at build time)
// to point at wherever the backend is deployed.
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...(options.headers || {}),
    },
  });

  if (res.status === 204) return null;

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      body?.error ||
      (body && typeof body === "object" ? Object.values(body)[0] : null) ||
      `Request failed (${res.status})`;
    throw new Error(message);
  }
  return body;
}

export const authApi = {
  register: (data) => request("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data) => request("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),
};

export const profileApi = {
  get: () => request("/api/profile"),
  update: (data) => request("/api/profile", { method: "PUT", body: JSON.stringify(data) }),
};

export const matchesApi = {
  list: () => request("/api/matches"),
  stats: () => request("/api/matches/stats"),
  create: (data) => request("/api/matches", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/api/matches/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/api/matches/${id}`, { method: "DELETE" }),
};

export const adminApi = {
  listUsers: () => request("/api/admin/users"),
  updateUser: (id, data) => request(`/api/admin/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteUser: (id) => request(`/api/admin/users/${id}`, { method: "DELETE" }),
};
