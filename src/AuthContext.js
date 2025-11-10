import React, { createContext, useState, useEffect } from "react";
import api, { useAxiosInterceptor } from "./api/axios"; // Axios instance
import { useTranslation } from "react-i18next";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { t } = useTranslation();

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginMessage, setLoginMessage] = useState(null);
  const [ERRORMessage, setERRORMessage] = useState(null);
  const [LogBut, setLogBut] = useState(localStorage.getItem("Button") || t("login"));
  const [incognito, setIncognito] = useState(sessionStorage.getItem("incognito") === "true");

  // Keep Axios interceptors updated
  useAxiosInterceptor(accessToken, setAccessToken);

  // Fetch user from backend
  const fetchUser = async (token, isGuest = false) => {
    setIsLoading(true);
    try {
      const response = await api.get("/auth/me", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setUser(response.data);

      if (!isGuest) localStorage.setItem("user", JSON.stringify(response.data));
      setIncognito(false);
      return true;
    } catch (error) {
      logout();
      return false;
    }
    finally {
    setIsLoading(false); // always reset
  }
  };

  const login = async (username, password) => {
    setERRORMessage(null);
    sessionStorage.removeItem("guestId");
    sessionStorage.removeItem("guestToken");
    sessionStorage.removeItem("incognito");
    setIncognito(false);

    try {
      const response = await api.post("/auth/login", { username, password });
      const { accessToken: newToken } = response.data;
      setAccessToken(newToken);
      await fetchUser(newToken);

      setLoginMessage(t("login_success"));
      setLogBut(t("logout"));
      localStorage.setItem("Button", t("logout"));
    } catch (error) {
      if (error.response?.status === 401) setERRORMessage(t("check_username_password"));
      else setERRORMessage(t("login_failed"));
      setIsLoading(false);
    } finally {
    setIsLoading(false); // always reset
  }
  };

 const register = async (username, password, email = "", full_name = "") => {
  try {
    await api.post("/auth/signup", { username, password, email, full_name });
    // Only show success if no error
    setLoginMessage(t("register_success"));
    setERRORMessage(null);
    return true;
  } catch (error) {
    if (error.response?.status === 409) {
      // Username already exists
      setERRORMessage(error.response.data?.message || t("username_taken"));
    } else {
      setERRORMessage(t("registration_error"));
    }
    setLoginMessage(null); // clear any previous success
    setIsLoading(false);
    return false;
  } finally {
    setIsLoading(false); 
  }
};


  const handleIncognitoMode = async () => {
    setERRORMessage(null);
    setIsLoading(true);
    const existingGuestId = sessionStorage.getItem("guestId");
    const existingGuestToken = sessionStorage.getItem("guestToken");

    if (existingGuestId) {
      // Restore existing guest token from backend
      try {
        const response = await api.get("/auth/guest", {
          params: { guestId: existingGuestId },
        });
        const { accessToken: refreshedToken, username } = response.data;
        setIsLoading(false);
        setAccessToken(refreshedToken);
        sessionStorage.setItem("guestToken", refreshedToken);
        setUser({ username, role: "guest", id: existingGuestId });
        setIncognito(true);
        setLogBut(t("login"));
        return;
      } catch (err) {
        console.error("Error refreshing guest token", err);
        sessionStorage.removeItem("guestId");
        sessionStorage.removeItem("guestToken");
        setIsLoading(false);
      } finally {
    setIsLoading(false); // always reset
  }
    }

    // Create new guest if none exists
    try {
      localStorage.removeItem("user");
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

      setUser({ username: `Guest_${guestId.slice(0, 8)}`, role: "guest", id: guestId });
      setIsLoading(false);
      setLogBut(t("login"));
      console.log("Guest logged in", guestId);
    } catch (error) {
      console.error("Error logging in as guest", error);
      setERRORMessage(t("guest_login_failed"));
      setIsLoading(false);
    } finally {
    setIsLoading(false); // always reset
  }
  };

  const logout = () => {
    if (!incognito) {
      localStorage.removeItem("user");
    } else {
      sessionStorage.removeItem("guestToken");
      sessionStorage.removeItem("incognito");
    }
    setUser(null);
    setAccessToken(null);
    setIncognito(false);
    setLogBut(t("login"));
  };

  // Initialize auth on page load
useEffect(() => {
  const initializeAuth = () => {
    setIsLoading(true);

    const storedUser = localStorage.getItem("user");
    const guestId = sessionStorage.getItem("guestId");
    const guestToken = sessionStorage.getItem("guestToken");

    if (storedUser) {
      // Real logged-in user exists
      setUser(JSON.parse(storedUser));
      setIncognito(false);
      setAccessToken(null);
    } else if (guestId && guestToken) {
      // Restore existing incognito user without creating a new guest
      setUser({ username: `Guest_${guestId.slice(0, 8)}`, role: "guest", id: guestId });
      setAccessToken(guestToken);
      setIncognito(true);
      setLogBut(t("login"));
    } else {
      // No user, no guest → do nothing until button click
      setUser(null);
      setAccessToken(null);
      setIncognito(false);
      sessionStorage.removeItem("guestId");
      sessionStorage.removeItem("guestToken");
      sessionStorage.removeItem("incognito");
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
        logout,
        register,
        isLoading,
        handleIncognitoMode,
        loginMessage,
        LogBut,
        incognito,
        ERRORMessage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
