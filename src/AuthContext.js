import React, { createContext, useState, useEffect } from "react";
import axios from "./api/axios"; // Assuming you have axios instance configured

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch user data
  const fetchUser = async () => {
    // If in incognito mode, set a dummy user or skip fetching user data
    if (sessionStorage.getItem('incognito') === 'true') {
      setUser({ username: '', role: 'guest' });
      localStorage.setItem("Button","Login");
      setIsLoading(false);
      return;
    }

    // If no token, set user as null
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get("https://pamac-backendd.onrender.com/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setUser(response.data);
    } catch (error) {
      console.log("Invalid or expired token, logging out.");
      logout();
    } finally {
      setIsLoading(false); // End loading state once request is done
    }
  };

  // Function to login
  const login = async (username, password) => {
    try {
      const response = await axios.post(
        "https://pamac-backendd.onrender.com/token",
        new URLSearchParams({ username, password }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const accessToken = response.data.access_token;
      localStorage.setItem("token", accessToken);
      setToken(accessToken);
      fetchUser(); // Fetch the user after login
      console.log("Login succeeded");
      localStorage.setItem("Button","Logout");
    } catch (error) {
      console.log("Login failed:", error);
    }
  };

  // Function to register a new user
  const register = async (username, password, email = "", full_name = "") => {
    try {
      const response = await axios.post(
        "https://pamac-backendd.onrender.com/register", 
        {
          username: username,
          password: password,
          email: email,
          full_name: full_name
        },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Registration successful:", response.data);
      login(username, password);
    } catch (error) {
      console.log("Error during registration:", error.response?.data);
      throw error; // Rethrow the error so you can handle it in your catch block in the UI
    }
  };

  // Function to handle incognito mode
  const handleIncognitoMode = async () => {
    try {
      // Set incognito mode in sessionStorage to track it for the session
      sessionStorage.setItem('incognito', 'true');
      setUser({ username: '', role: 'guest' }); // Set dummy user
      setToken(null); // No token required for incognito

      // Optionally call a backend endpoint for incognito mode
      const response = await fetch('https://pamac-backendd.onrender.com/incognito', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Handle the incognito user content here
        console.log('You are now in incognito mode!');
      }
    } catch (error) {
      console.error('Error in incognito mode:', error);
    }
  };

  // Function to logout
  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem('incognito'); // Clear incognito mode on logout
    setUser(null);
    setToken(null);
  };

  // Check token validity on app load or token update
  useEffect(() => {
    if (token) {
      setIsLoading(true);
      fetchUser();
    } else if (sessionStorage.getItem('incognito') === 'true') {
      setIsLoading(true);
      fetchUser();
    } else {
      setIsLoading(false); // If no token or incognito, end the loading state
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, isLoading, handleIncognitoMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
