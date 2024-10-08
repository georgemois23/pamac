import React, { createContext, useState } from 'react';

// Create the context
export const GlobalContext = createContext();

// Create the provider component
export const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logoutbutton, setLogoutbutton] = useState('Logout');

  // Define the logout function
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('username');
    localStorage.removeItem('enter'); 
  };

  return (
    <GlobalContext.Provider value={{ isLoggedIn, setIsLoggedIn, logoutbutton, setLogoutbutton, handleLogout }}>
      {children}
    </GlobalContext.Provider>
  );
};
