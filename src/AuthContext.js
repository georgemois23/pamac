import React, { createContext, useState, useEffect, useCallback } from "react";
import api, { useAxiosInterceptor, setClientToken } from "./api/axios";
import { useTranslation } from "react-i18next";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { t } = useTranslation();

  // --- State ---
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const [isLoading, setIsLoading] = useState(true);
  const [loginMessage, setLoginMessage] = useState(null);
  const [ERRORMessage, setERRORMessage] = useState(null);
  const [LogBut, setLogBut] = useState(localStorage.getItem("Button") || t("login"));
  const [incognito, setIncognito] = useState(sessionStorage.getItem("incognito") === "true");

  // --- LOGOUT (Cleanup) ---
  const logout = useCallback(async () => {
    console.warn("🔒 Logging out...");
    try {
        await api.post('/auth/logout'); 
    } catch (e) {
        // We ignore errors here. If the user is offline, we still want to 
        // delete local data and show the login screen.
        console.error("Logout backend failed", e);
    }
    if (!incognito) {
      localStorage.removeItem("accessToken");
    } else {
      sessionStorage.removeItem("guestToken");
      sessionStorage.removeItem("incognito");
    }
    setUser(null);
    setAccessToken(null);
    setIncognito(false);
    setLogBut(t("login"));
    localStorage.removeItem("Button");
    
    // Optional: Call backend to clear the cookie
    // api.post('/auth/logout').catch(() => {}); 
  }, [incognito, t]);

  // --- ⚡️ SYNC AXIOS (Keep ONLY this one) ⚡️ ---
  // We place this AFTER 'logout' is defined so we can pass it in.
  useAxiosInterceptor(accessToken, setAccessToken, logout);

  // --- Login ---
  const login = async (username, password) => {
    setERRORMessage(null);
    try {
      const response = await api.post("/auth/login", { username, password });
      const { accessToken: newToken } = response.data;

      setAccessToken(newToken);
      localStorage.setItem("accessToken", newToken);
      
      // Pass token explicitly to ensure fetch uses the new one immediately
      await fetchUser(newToken);
      setLoginMessage(t("login_success"));
      setLogBut(t("logout"));
      localStorage.setItem("Button", "Logout");
      
      return true; // Indicate Success to the caller
    } catch (error) {
      setERRORMessage(t("login_failed"));
      throw error; // <--- CRITICAL FIX: Throw error so LoginPage catches it!
    } finally {
      setIsLoading(false);
    }
  };

  // --- Fetch User ---
  const fetchUser = async (token) => {
    try {
      // Explicitly setting the header here is good practice!
      // It ensures the fetch works immediately even if the global store update is 1ms behind.
      const response = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser({ ...response.data, accessToken: token });
      return true;
    } catch (error) {
      console.error("Fetch user failed:", error);
      return false;
    }
  };

  const refetchUser = async () => {
    if (accessToken) {
      return await fetchUser(accessToken);
    }
    return false;
  }

  const register = async (username, password, email = "", full_name = "") => {
    setIsLoading(true);
    try {
      await api.post("/auth/signup", { username, password, email, full_name });
      setLoginMessage(t("register_success"));
      setERRORMessage(null);
      return true;
    } catch (error) {
      if (error.response?.status === 409) {
        setERRORMessage(error.response.data?.message || t("username_taken"));
      } else {
        setERRORMessage(t("registration_error"));
      }
      setLoginMessage(null);
      setIsLoading(false);
      // localStorage.setItem("enr")
      return false;
    } finally {
      // setIsLoading(false);
    }
  };
  // --- Initialize ---
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("accessToken");
      const guestToken = sessionStorage.getItem("guestToken");

      if (token) setClientToken(token);
      if (token) {
        setAccessToken(token);
        await fetchUser(token);
      } else if (guestToken) {
        setAccessToken(guestToken);
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        register,
        logout,
        isLoading,
        incognito,
        refetchUser
        // ... other exports
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;