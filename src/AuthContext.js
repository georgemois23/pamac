import React, { createContext, useState, useEffect, useCallback } from "react";
// ✅ Import getClientToken
import api, { useAxiosInterceptor, setClientToken, getClientToken } from "./api/axios";
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
        console.error("Logout backend failed", e);
    }
    if (!incognito) {
      localStorage.removeItem("accessToken");
    } else {
      sessionStorage.removeItem("guestToken");
      sessionStorage.removeItem("incognito");
    }
    
    // ✅ Clear non-react store immediately
    setClientToken(null);
    
    setUser(null);
    setAccessToken(null);
    setIncognito(false);
    setLogBut(t("login"));
    localStorage.removeItem("Button");
  }, [incognito, t]);

  // --- SYNC AXIOS ---
  useAxiosInterceptor(accessToken, setAccessToken, logout);

  // --- Fetch User (REFACTORED) ---
  // ❌ No longer accepts 'token' argument.
  const fetchUser = async () => {
    try {
      // 1. Just call API. The interceptor attaches the token automatically.
      // If it fails (401), the interceptor refreshes it behind the scenes.
      const response = await api.get("/auth/me");
      
      // 2. ✅ Get the valid token from the Store.
      // If a refresh happened, this returns the NEW token, not the old one.
      const currentToken = getClientToken(); 
      
      setUser({ ...response.data, accessToken: currentToken });
      return true;
    } catch (error) {
      console.error("Fetch user failed:", error);
      return false;
    }
  };

  const refetchUser = async () => {
     return await fetchUser();
  }

  // --- Login ---
  const login = async (username, password) => {
    setERRORMessage(null);
    try {
      const response = await api.post("/auth/login", { username, password });
      const { accessToken: newToken } = response.data;

      // 1. Update Global Store Immediately (Synchronous)
      setClientToken(newToken);
      
      // 2. Update React State
      setAccessToken(newToken);
      localStorage.setItem("accessToken", newToken);
      
      // 3. Fetch User (No arguments!)
      await fetchUser();
      
      setLoginMessage(t("login_success"));
      setLogBut(t("logout"));
      localStorage.setItem("Button", "Logout");
      
      return true; 
    } catch (error) {
      setERRORMessage(t("login_failed"));
      throw error; 
    } finally {
      setIsLoading(false);
    }
  };

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
      return false;
    }
  };

  // --- Initialize ---
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("accessToken");
      const guestToken = sessionStorage.getItem("guestToken");

      if (token) {
        // 1. Load OLD token into store so interceptor has something to work with
        setClientToken(token);
        setAccessToken(token);
        
        // 2. Fetch User. If token is old, interceptor refreshes it.
        // fetchUser will grab the NEW token from store automatically.
        await fetchUser();
        
      } else if (guestToken) {
        setClientToken(guestToken);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;