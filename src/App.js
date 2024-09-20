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


  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedMessages = JSON.parse(sessionStorage.getItem('messages')) || [];

    if (storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setMessages(storedMessages);
    }
  }, []);

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setLogout(false);
    setUsername(username);
    localStorage.setItem('username', username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLogout(true);
    setUsername('');
    setMessages([]);
    localStorage.removeItem('username');
    sessionStorage.removeItem('messages');
  };

  const handleMessage = (message) => {
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    sessionStorage.setItem('messages', JSON.stringify(updatedMessages));
  };

  return (
    <Router>
      <div className="App">
        {isLoggedIn && (
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        )}

        { (isLoggedIn && logout) ?
        <Navigate to="/" /> : ''
        }
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/chat" /> : <FirstLand />} />
          <Route path="/login" element={isLoggedIn ? <Navigate to="/chat" /> : <LoginPage onLogin={handleLogin} />} />
          <Route path="/chat" element={isLoggedIn ? (
            <Chat name={username} onMessage={handleMessage} />
          ) : <Navigate to="/login" />} />
          <Route path="/messages" element={isLoggedIn ? (
            <PreviewMsg messages={messages} />
          ) : <Navigate to="/login" />} 
             />
          <Route path="*" element={<Navigate to={isLoggedIn ? "/chat" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
