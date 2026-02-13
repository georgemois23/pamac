// src/context/AuthContext.js
import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import api from "./api/axios";
import { useTranslation } from "react-i18next";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { t } = useTranslation();

  // -----------------------------
  // STATE
  // -----------------------------
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loginMessage, setLoginMessage] = useState(null);
  const [ERRORMessage, setERRORMessage] = useState(null);
  const [LogBut, setLogBut] = useState(
    localStorage.getItem("Button") || t("login")
  );

  // -----------------------------
  // FETCH CURRENT USER
  // -----------------------------
  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
      return true;
    } catch (err) {
      setUser(null);
      return false;
    }
  }, []);

  // -----------------------------
  // LOGIN
  // -----------------------------
  const login = async (username, password) => {
    setERRORMessage(null);
    setIsLoading(true);

    try {
      // Backend sets cookies
      await api.post("/auth/login", { username, password });

      // Fetch user using cookies
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

  // -----------------------------
  // REGISTER
  // -----------------------------
  const register = async (username, password, email = "", full_name = "") => {
    setIsLoading(true);
    setERRORMessage(null);

    try {
      await api.post("/auth/signup", {
        username,
        password,
        email,
        full_name,
      });

      setLoginMessage(t("register_success"));
      return true;
    } catch (error) {
      if (error.response?.status === 409) {
        setERRORMessage(
          error.response.data?.message || t("username_taken")
        );
      } else {
        setERRORMessage(t("registration_error"));
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const logout = useCallback(async () => {
    try {
      // Backend clears cookies
      await api.post("/auth/logout");
    } catch (_) {}

    setUser(null);
    setLogBut(t("login"));
    localStorage.removeItem("Button");
  }, [t]);

  // -----------------------------
  // INITIALIZE AUTH (on page load)
  // -----------------------------
  useEffect(() => {
    const init = async () => {
      await fetchUser(); // if cookies exist → user is set
      setIsLoading(false);
    };
    init();
  }, [fetchUser]);


  // -----------------------------
  // CONTEXT VALUE
  // -----------------------------
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        fetchUser,
        loginMessage,
        ERRORMessage,
        LogBut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
