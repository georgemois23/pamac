import React, { createContext, useState, useEffect } from "react";
import axios from "./api/axios"; // Assuming you have axios instance configured

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
      });
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMessage, setloginMessage] = useState(null);
  const [LogBut, setLogBut] = useState(localStorage.getItem("Button"));

  // Function to fetch user data
    const fetchUser = async () => {
          if (sessionStorage.getItem('incognito') === 'true') {
            setUser({ username: '', role: 'guest' });
            localStorage.setItem("user", JSON.stringify({ username: '', role: 'guest' }));
      
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
    }}
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, isLoading, handleIncognitoMode, loginMessage,LogBut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;


// import React, { createContext, useState, useEffect } from "react";
// import axios from "./api/axios"; // Assuming you have axios instance configured

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     const storedUser = localStorage.getItem("user");
//     return storedUser ? JSON.parse(storedUser) : null;
//   });
//   const [LogBut, setLogBut] = useState(localStorage.getItem("Button"));
//   const [token, setToken] = useState(localStorage.getItem("token") || null);
//   const [isLoading, setIsLoading] = useState(() => {
//     return sessionStorage.getItem('incognito') === 'true' ? false : !!localStorage.getItem("token");
//   });
  
//   const [loginMessage, setloginMessage] = useState(null);
//   const [loginErrorMessage, setloginErrorMessage] = useState(null);

//   // Function to fetch user data
//   const fetchUser = async () => {
//     if (sessionStorage.getItem('incognito') === 'true') {
//       setUser({ username: '', role: 'guest' });
//       localStorage.setItem("user", JSON.stringify({ username: '', role: 'guest' }));

//       setLogBut("Login");
//       setIsLoading(false);
//       return;
//     }

//     if (!token) {
//       setUser(null);
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.get("https://pamac-backendd.onrender.com/users/me", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       setUser(response.data);
//       localStorage.setItem("user", JSON.stringify(response.data)); // Store user in localStorage
//       setIsLoading(false);
//     } catch (error) {
//       console.log("Invalid or expired token, logging out.");
//       logout();
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   // Function to login
//   const login = async (username, password) => {
//     try {
//       const response = await axios.post(
//         "https://pamac-backendd.onrender.com/token",
//         new URLSearchParams({ username, password }),
//         { headers: { "Content-Type": "application/x-www-form-urlencoded" }, 
//         timeout: 5500,}
//       );
      
//       const accessToken = response.data.access_token;
//       localStorage.setItem("token", accessToken); // Store token in localStorage
//       setToken(accessToken);
//       await fetchUser(); 
//       setloginMessage("Login was successful, redirecting to Chat...");
      
//       localStorage.setItem("vst", true);
//       setLogBut("Logout");
//       setTimeout(() => {
//         setloginMessage(null);
//       }, 1000);
//       return user; 
//     } catch (error) {
//       if (error.code === 'ECONNABORTED') {
//         setloginErrorMessage("Login request timed out. Please try again.");
//       } else {
//         setloginErrorMessage("*Invalid username or password*");
//       }
//       // setloginMessage("blalbla")
//       setTimeout(() => {
//         // setloginMessage(null);
//       }, 1000);
//       console.log("Login failed:", error);
//     }
//   };

//   const register = async (username, password, email = "", full_name = "") => {
//     console.log('Sign up? on auth context ?');
//     try {
//       const response = await axios.post(
//         "https://pamac-backendd.onrender.com/register", 
//         {
//           username: username,
//           password: password,
//           email: email,
//           full_name: full_name
//         },
//         { headers: { "Content-Type": "application/json" } }
//       );
//       console.log("Registration successful:", response.data);
//       // login(username, password);
//     } catch (error) {
//       console.log("Error during registration:", error.response?.data);
//       throw error; // Rethrow the error so you can handle it in your catch block in the UI
//     }
//   };


//   // Handle incognito mode
//   const handleIncognitoMode = async () => {
//     try {
//       // Set incognito mode in sessionStorage to track it for the session
//       sessionStorage.setItem('incognito', 'true');
//       setUser({ username: '', role: 'guest' }); // Set dummy user
//       localStorage.setItem("user", JSON.stringify({ username: '', role: 'guest' }));

//       setToken(null); // No token required for incognito
//       setLogBut("Login");

//       // Optionally call a backend endpoint for incognito mode
//       const response = await fetch('https://pamac-backendd.onrender.com/incognito', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.ok) {
//         // Handle the incognito user content here
//         console.log('You are now in incognito mode!');
//       }
//     } catch (error) {
//       console.error('Error in incognito mode:', error);
//     }
//   };

//   // Logout function
//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     setToken(null);
//     setLogBut("Login");
//     sessionStorage.removeItem("incognito"); // Clear incognito mode on logout
//     window.location.href = '/login';
  
//     // Dispatch a logout event so other tabs know
//     localStorage.setItem('logout', Date.now());
//   };

//   useEffect(() => {
//     const handleStorageChange = (event) => {
//       if (event.key === 'logout') {
//         // If logout happens in another tab, log out here too
//         localStorage.removeItem('authToken');
//         window.location.href = '/login';
//       }
//     };
  
//     window.addEventListener('storage', handleStorageChange);
  
//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//     };
//   }, []);
  

//   // Check token validity on app load or token update
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
  
//     if (storedUser) {
//       setUser(JSON.parse(storedUser)); // Use stored user data
//       setIsLoading(false);
//     } else if (token && sessionStorage.getItem('incognito') !== 'true') {
//       setIsLoading(true);
//       fetchUser(); // Only fetch if user data is missing
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, token, login,register, logout, handleIncognitoMode, isLoading, loginMessage, LogBut,loginErrorMessage}}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;
