import './App.css';
import React, { useState, useEffect } from 'react';
import FirstLand from './Firstland';
import LoginPage from './LoginPage';
import Chat from './Chat';
import PreviewMsg from './PreviewMsg';
import { BrowserRouter as Router, Routes, Route, Navigate,useLocation } from 'react-router-dom';
import ThemeOption from './ThemeOption';
import ErrorPage from './ErrorPage';

function App() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [logout, setLogout] = useState(false);
  const [wasLoggedin, setWasLoggedIn] = useState(false);
  const [enter, setEnter] = useState(false);
  const [logoutbutton, setLogoutbutton] = useState('Logout');
  // const location = useLocation();
  
  
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedMessages = JSON.parse(sessionStorage.getItem('messages')) || [];
    const storedEnter = localStorage.getItem('enter') === 'true'; // Convert string to boolean
    const storedLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // Convert string to boolean
    const storedTheme = localStorage.getItem('theme') || 'original';

    if (storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
    
    if(storedLoggedIn){
      setIsLoggedIn(true);}
    setMessages(storedMessages); // Retrieve messages regardless of login status
    setEnter(storedEnter); // Set 'enter' state based on stored value
    setTheme(storedTheme); // Set theme from localStorage

    document.body.setAttribute('data-theme', storedTheme); 

    // Clear username when the session closes
    const handleBeforeUnload = () => {
      localStorage.removeItem('username');                           
    };

    // Add event listener for session close
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup event listener
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setLogout(false);
    localStorage.setItem('isLoggedIn','true');
    if (username === '') {
      setUsername('');
      setLogoutbutton('Login');
    } else {
      setUsername(username);
      setLogoutbutton('Logout');
      
      localStorage.setItem('username', username);
    }
  };

  
  const handleLogout = () => {
    {isLoggedIn ? setWasLoggedIn(true) : setWasLoggedIn(false)}
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn','false');
    setLogout(true);
    setUsername('');
    setEnter(false);
    localStorage.removeItem('enter'); // Remove 'enter' state from localStorage on logout
    localStorage.removeItem('username');
  };


  const handleEnter = () => {
    setEnter(true);
    localStorage.setItem('enter', 'true'); // Save 'enter' state as string in localStorage
  };

  const [theme, setTheme] = useState('original');
  const handleThemeToggle = () => {
    const newTheme = (theme === 'purple') ? 'original' : 'purple';
    setTheme(newTheme);
    // localStorage.setItem('theme', newTheme);
    document.body.setAttribute('data-theme', newTheme); // Apply the new theme
  };

  const handleMessage = (message) => {
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    sessionStorage.setItem('messages', JSON.stringify(updatedMessages)); // Save messages to session storage
  };

  
  return (
    <Router>
      <div className="App">
        {enter && <ThemeOption theme={theme} toggleTheme={handleThemeToggle} />}
        {isLoggedIn && (
          <button onClick={handleLogout} className="logout-button">
            {logoutbutton}
          </button>
        )}
        
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <Navigate to="/chat" /> : <FirstLand OnEnter={handleEnter} />}
          />
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/chat" /> : <LoginPage onLogin={handleLogin} />}
          />
          <Route
            path="/chat"
            element={isLoggedIn ? <Chat name={username} onMessage={handleMessage} /> : <Navigate to="/login" />}
          />
          <Route
            path="/messages"
            element={isLoggedIn ? <PreviewMsg messages={messages} /> : <Navigate to="/login" />}
          />
          {/* <Route path="*" element={<Navigate to={isLoggedIn ? "/chat" : "/login"} />} /> */}
          <Route path="*" element={<Navigate to="/404" />} />
          <Route path="/404" element={<ErrorPage />} />
        </Routes>
      </div> 
    </Router>
  );
}

export default App;
