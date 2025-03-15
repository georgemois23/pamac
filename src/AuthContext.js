import React, { createContext, useState, useEffect } from "react";
import axios from "./api/axios"; // Assuming you have axios instance configured

const AuthContext = createContext();
// https://pamac-backendd.onrender.com/


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
      });
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMessage, setloginMessage] = useState(null);
  const [LogBut, setLogBut] = useState(localStorage.getItem("Button"));
  const [incognito, setincognito] = useState(sessionStorage.getItem("incognito"));

  // Function to fetch user data
    const fetchUser = async () => {
          if (sessionStorage.getItem('incognito') === 'true') {
            setUser({ username: '', role: 'guest' });
            localStorage.setItem("user", JSON.stringify({ username: '', role: 'guest' }));
            setincognito(true);
            setLogBut("Login");
            setIsLoading(false);
            return;
          }
    
    
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
      localStorage.setItem("user", JSON.stringify(response.data));
      setincognito(false);
      setIsLoading(false);
      // setloginMessage("Login was successful, redirecting to Chat...");
      setTimeout(() => {
        setloginMessage(null);
      }, 2000);
    } catch (error) {
      console.log("Invalid or expired token, logging out.");
      logout();
    } finally {
      setIsLoading(false);
    }
  };
  

  // Function to login
  const login = async (username, password) => {
    
    try {
      const response = await axios.post(
        
        "https://pamac-backendd.onrender.com/token",
        new URLSearchParams({ username, password }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" }, 
                timeout: 15000,
              }
      );
      
      const accessToken = response.data.access_token;
      localStorage.setItem("token", accessToken);
      setToken(accessToken);
      setloginMessage("Login was successful, redirecting to Chat...");

      fetchUser(); // Fetch the user after login
      console.log("Login succeeded");
      setloginMessage("Login was successful, redirecting to Chat...");
      localStorage.setItem("vst",true);
      setLogBut("Logout");
      setTimeout(() => {
        setloginMessage(null);
      }, 2000);
      localStorage.setItem("Button","Logout");
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        setloginMessage("*Login request timed out. Please try again.*")
        setTimeout(() => {
          setloginMessage(null);
          window.location.reload();
        }, 2000);
      }
      else{
      setloginMessage("*Please check username or password and try again.*");
    }
      // setTimeout(() => {
      //   setloginMessage(null);
      // }, 4000);
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
      // login(username, password);
    } catch (error) {
      console.log("Error during registration:", error.response?.data);
      throw error; // Rethrow the error so you can handle it in your catch block in the UI
    }
  };

  // Function to handle incognito mode
  const handleIncognitoMode = async () => {
    // try {
      // Set incognito mode in sessionStorage to track it for the session
      sessionStorage.setItem('incognito', 'true');
      setUser({ username: '', role: 'guest' }); // Set dummy user
      setToken(null); // No token required for incognito
      setLogBut("Login");
      setincognito(true);
      // Optionally call a backend endpoint for incognito mode
    //   const response = await fetch('https://pamac-backendd.onrender.com/incognito', {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   });

    //   if (response.ok) {
    //     // Handle the incognito user content here
    //     console.log('You are now in incognito mode!');
    //   }
    // } catch (error) {
    //   console.error('Error in incognito mode:', error);
    // }
  };

  // Function to logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem('incognito'); // Clear incognito mode on logout
    setincognito(false);
    setUser(null);
    setToken(null);
  };

  // useEffect(() => {
  //       const storedUser = localStorage.getItem("user");
      
  //       if (storedUser) {
  //         setUser(JSON.parse(storedUser)); // Use stored user data
  //         setIsLoading(false);
  //       } else if (token && sessionStorage.getItem('incognito') !== 'true') {
  //         setIsLoading(true);
  //         fetchUser(); // Only fetch if user data is missing
  //       }
  //     }, []);
 
 
  // Check token validity on app load or token update
  useEffect(() => {
    setIsLoading(false);
    if(!user){
    if (token) {
      setIsLoading(true);
      fetchUser();
    } else if (sessionStorage.getItem('incognito') === 'true') {
      setIsLoading(true);
      fetchUser();
    } else {
      setIsLoading(false); // If no token or incognito, end the loading state
      logout();
    }}
  }, [token]);


  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, isLoading, handleIncognitoMode, loginMessage,LogBut, incognito }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;