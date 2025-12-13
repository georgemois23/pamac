import React, { createContext, useState, useEffect, useCallback } from "react";
import api, { useAxiosInterceptor } from "./api/axios"; // Axios instance
import { useTranslation } from "react-i18next";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { t } = useTranslation();

  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginMessage, setLoginMessage] = useState(null);
  const [ERRORMessage, setERRORMessage] = useState(null);
  const [LogBut, setLogBut] = useState(localStorage.getItem("Button") || t("login"));
  const [incognito, setIncognito] = useState(sessionStorage.getItem("incognito") === "true");

  // Keep axios headers in sync with state
  useAxiosInterceptor(accessToken, setAccessToken);

  // --- Helper: Fetch user profile and merge token ---
  const fetchUser = async (token, isGuest = false) => {
    setIsLoading(true);
    try {
      const response = await api.get("/auth/me", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      // ✅ Vital Fix: Ensure accessToken is part of the user object
      setUser({ ...response.data, accessToken: token });

      setIncognito(false);
      return true;
    } catch (error) {
      console.error("Fetch user failed:", error);
      logout(); // If token is invalid, log out
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refetchUser = useCallback(async () => {
    if (!user?.accessToken) return false;
    await fetchUser(user.accessToken, incognito);
  }, [user, incognito]);

  // --- Login ---
  const login = async (username, password) => {
    setERRORMessage(null);
    sessionStorage.removeItem("guestId");
    sessionStorage.removeItem("guestToken");
    sessionStorage.removeItem("incognito");
    setIncognito(false);
    setIsLoading(true);

    try {
      const response = await api.post("/auth/login", { username, password });
      const { accessToken: newToken } = response.data;
      
      console.log("Login successful:", response.data);
      
      setAccessToken(newToken);
      localStorage.setItem("accessToken", newToken); // Save only the token
      
      await fetchUser(newToken);

      setLoginMessage(t("login_success"));
      setLogBut(t("logout"));
      localStorage.setItem("Button", t("logout"));
    } catch (error) {
      if (error.response?.status === 401) {
        setERRORMessage(t("check_username_password"));
      } else if (error.response?.data?.code === 'USER_DISABLED') {
        setERRORMessage(<>User account is disabled.<br />Contact support.</>);
      } else if (error.response?.data?.code === 'USER_TEMP_DISABLED') {
        setERRORMessage(<>User account is temporarily disabled.<br />Contact support.</>);
      } else {
        setERRORMessage(t("login_failed"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- Register ---
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
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // --- Guest / Incognito Mode ---
  const handleIncognitoMode = async () => {
    setERRORMessage(null);
    setIsLoading(true);
    const existingGuestId = sessionStorage.getItem("guestId");
    // We don't rely on existingGuestToken here, better to validate via API or refresh logic
    
    if (existingGuestId) {
      try {
        const response = await api.get("/auth/guest", {
          params: { guestId: existingGuestId },
        });
        const { accessToken: refreshedToken, username } = response.data;
        
        setAccessToken(refreshedToken);
        sessionStorage.setItem("guestToken", refreshedToken);
        
        // ✅ Fix: Add token to user object for guest too
        setUser({ 
            username, 
            role: "guest", 
            id: existingGuestId, 
            accessToken: refreshedToken 
        });
        
        setIncognito(true);
        setLogBut(t("login"));
        return;
      } catch (err) {
        console.error("Error refreshing guest token", err);
        sessionStorage.removeItem("guestId");
        sessionStorage.removeItem("guestToken");
      } finally {
        setIsLoading(false);
      }
    }

    // Create new guest if none exists or refresh failed
    try {
      localStorage.removeItem("accessToken"); // clear real user token
      setUser(null);
      setAccessToken(null);

      const response = await api.post("/auth/guest");
      const { accessToken: guestToken, guestId } = response.data;

      setAccessToken(guestToken);
      sessionStorage.setItem("guestId", guestId);
      sessionStorage.setItem("guestToken", guestToken);
      sessionStorage.setItem("incognito", "true");
      setIncognito(true);

      const payload = JSON.parse(atob(guestToken.split(".")[1]));
      const timeout = payload.exp * 1000 - Date.now();
      if (timeout > 0) setTimeout(() => logout(), timeout);

      // ✅ Fix: Add token to user object
      setUser({ 
        username: `Guest_${guestId.slice(0, 8)}`, 
        role: "guest", 
        id: guestId, 
        accessToken: guestToken 
      });

      setLogBut(t("login"));
      console.log("Guest logged in", guestId);
    } catch (error) {
      console.error("Error logging in as guest", error);
      setERRORMessage(t("guest_login_failed"));
    } finally {
      setIsLoading(false);
    }
  };

  // --- Logout ---
  const logout = () => {
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
  };

  // --- Initialize Auth on Page Refresh ---
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      
      const token = localStorage.getItem("accessToken");
      const guestToken = sessionStorage.getItem("guestToken");
      const guestId = sessionStorage.getItem("guestId");

      if (token) {
        setAccessToken(token);
        try {
          // Fetch user details using the persistent token
          const response = await api.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          // ✅ FIX: Merge backend data + persistent token
          setUser({ ...response.data, accessToken: token });
          setIncognito(false);
        } catch (error) {
          console.error("Failed to restore user session:", error);
          localStorage.removeItem("accessToken");
          setUser(null);
          setAccessToken(null);
        }
      } else if (guestToken && guestId) {
        // Restore guest session
        setUser({ 
            username: `Guest_${guestId.slice(0, 8)}`, 
            role: "guest", 
            id: guestId, 
            accessToken: guestToken // ✅ Ensure token is present
        });
        setAccessToken(guestToken);
        setIncognito(true);
      } else {
        // No valid session found
        setUser(null);
        setAccessToken(null);
        setIncognito(false);
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []); // Run once on mount

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
        register,
        isLoading,
        handleIncognitoMode,
        loginMessage,
        LogBut,
        incognito,
        ERRORMessage,
        refetchUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;