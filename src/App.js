import './App.css';
import React, { useState, useEffect } from 'react';
import FirstLand from './Firstland';
import LoginPage from './LoginPage';
import Chat from './Chat';
import PreviewMsg from './PreviewMsg';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [logout, setLogout] = useState(false);
  const [enter, setEnter] = useState(false);

  
  const [logoutbutton,setLogoutbutton]=useState('Logout');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedMessages = JSON.parse(sessionStorage.getItem('messages')) || [];

    if (storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
    setMessages(storedMessages); // Retrieve messages regardless of login status

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
    if(username===''){
      // setUsername('{anonymous user}');
      setUsername('');
      setLogoutbutton('Login')
    }
    else{
    setUsername(username);
    localStorage.setItem('username', username);
    }
  };

  const handlename = () => {
    
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    setLogout(true);
    setUsername('');
    setEnter(false);
    localStorage.removeItem('username');
    // Do not clear session storage here
    window.location.reload(); // Reload the page
  };

  const handleEnter = () => {
    setEnter(true);
  };

  const handleMessage = (message) => {
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    sessionStorage.setItem('messages', JSON.stringify(updatedMessages)); // Save messages to session storage
  };

  return (
    <Router>
      <div className="App">
        {isLoggedIn && (
          <button onClick={handleLogout} className="logout-button">
            {logoutbutton}
          </button>
        )}

        {logout && <Navigate to="/" replace />}

        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <Navigate to="/chat" /> : <FirstLand OnEnter={handleEnter} />}
          />
          <Route
            path="/login"
            element={
              enter ? (
                isLoggedIn ? <Navigate to="/chat" /> : <LoginPage onLogin={handleLogin} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/chat"
            element={isLoggedIn ? <Chat name={username} onMessage={handleMessage} /> : <Navigate to="/login" />}
          />
          <Route
            path="/messages"
            element={isLoggedIn ? <PreviewMsg messages={messages} /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to={isLoggedIn ? "/chat" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
