// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

let refreshPromise = null;

// ✅ ONLY axios performs refresh network call
export function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = api
      .post("/auth/refresh")
      .then(() => {
        // optional notify app
        window.dispatchEvent(new Event("auth:refreshed"));
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const originalRequest = error.config;
    if (!error.response) return Promise.reject(error);

    const status = error.response.status;
    const isRefreshCall = (originalRequest?.url || "").includes("/auth/refresh");

    if (status === 401 && !originalRequest._retry && !isRefreshCall) {
      originalRequest._retry = true;
      await refreshSession();        // ✅ axios refresh
      return api(originalRequest);   // retry
    }

    return Promise.reject(error);
  }
);

export default api;
