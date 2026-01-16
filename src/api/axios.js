import axios from "axios";
import { useEffect } from "react";

// --- 1. GLOBAL STORE ---
let store = {
  accessToken: null,
  setAccessToken: null,
  onSessionExpired: null,
};

// --- 2. EXPORTED HELPER (New) ---
export const setClientToken = (token) => {
  store.accessToken = token;
};

// ✅ NEW: Getter to retrieve the fresh token after a refresh
export const getClientToken = () => {
  return store.accessToken;
};

// --- 3. REFRESH QUEUE ---
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// --- 4. THE HOOK (Exported) ---
export const useAxiosInterceptor = (accessToken, setAccessToken, logout) => {
  useEffect(() => {
    store.accessToken = accessToken;
    store.setAccessToken = setAccessToken;
    store.onSessionExpired = logout;
  }, [accessToken, setAccessToken, logout]);
};

// --- 5. AXIOS INSTANCE ---
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

// --- 6. REQUEST INTERCEPTOR ---
api.interceptors.request.use(
  (config) => {
    const token = store.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- 7. RESPONSE INTERCEPTOR ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("🔄 Access token expired. Refreshing...");

        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = response.data.accessToken;

        // Update Store, State & Storage
        store.accessToken = newToken;
        if (store.setAccessToken) store.setAccessToken(newToken);
        localStorage.setItem("accessToken", newToken);

        // Process Queue
        processQueue(null, newToken);

        // Update Header for this request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        console.log("✅ Refresh successful. Retrying original request.");
        return api(originalRequest);

      } catch (refreshError) {
        console.error("❌ Refresh failed. Session expired.");
        
        processQueue(refreshError, null);
        
        if (store.onSessionExpired) {
           store.onSessionExpired();
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;