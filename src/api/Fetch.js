// src/api/fetchClient.js
import { refreshSession } from "./axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:7001";

export async function apiFetch(path, options = {}, retry = true) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers || {}),
    },
  });

  if (res.ok) {
    if (res.status === 204) return null;
    const ct = res.headers.get("content-type") || "";
    return ct.includes("application/json") ? res.json() : res.text();
  }

  // ✅ If 401, ask AXIOS to refresh (fetch never calls /auth/refresh)
  if (res.status === 401 && retry && !path.includes("/auth/refresh")) {
    await refreshSession();                 // axios does refresh
    return apiFetch(path, options, false);  // retry once
  }

  let message = "Request failed";
  try {
    const data = await res.json();
    message = data?.message || message;
  } catch (_) {}

  const err = new Error(message);
  err.status = res.status;
  throw err;
}

export { API_URL };
