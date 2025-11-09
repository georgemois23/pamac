// src/api/axios.js
import axios from "axios";
import { AuthContext } from "../AuthContext";
import React from "react";

let store = {
  accessToken: null,
  setAccessToken: null,
};

// Hook to keep accessToken updated in the Axios instance
export const useAxiosInterceptor = (accessToken, setAccessToken) => {
  React.useEffect(() => {
    store.accessToken = accessToken;
    store.setAccessToken = setAccessToken;
  }, [accessToken, setAccessToken]);
};

// Create Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // change to your backend
  withCredentials: true, // send cookies
});

// Request interceptor: attach access token
api.interceptors.request.use(
  (config) => {
    if (store.accessToken) {
      config.headers["Authorization"] = `Bearer ${store.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only try refreshing if the original request wasn't a refresh call
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint
        const res = await api.post("/auth/refresh");
        const newToken = res.data.accessToken;

        // Update token in memory store
        store.setAccessToken?.(newToken);
        store.accessToken = newToken;

        // Retry original request with new token
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        // Refresh failed — user should log in again
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }

);


export default api;
