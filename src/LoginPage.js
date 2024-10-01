// Import necessary modules
import './App.css';
import { usePopUp } from './App'; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'react-icons-kit';
import { eyeOff } from 'react-icons-kit/feather/eyeOff';
import { eye } from 'react-icons-kit/feather/eye';

function LoginPage({ onLogin }) {

  const showPopUp = usePopUp();

  
  const [username, setUsername] = useState('');
  const [incognito, setincognito] = useState(false);
  const [signup, setsignup] = useState(false);
  const [login, setlogin] = useState(true);

  const [password, setPassword] = useState('');
  const [type, setType] = useState('password');
  const [icon, setIcon] = useState(eyeOff);

  const handleToggle = () => {
    if (type === 'password') {
      setIcon(eye);
      setType('text');
    } else {
      setIcon(eyeOff);
      setType('password');
    }
  };
  
  const handleUsernameChange = (e) => {
    // setUsername(e.target.value.replace(/\s/g, ''));
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    // Prevent whitespace by replacing spaces with an empty string
    
    setPassword(e.target.value.replace(/\s/g, ''));
    setPassword(e.target.value);
  };

  const handleKeyDown = (e) => {
    // Block space and tab keys
    if (e.key === ' ' || e.key === 'Tab') {
      e.preventDefault();
    }
  };
  const navigate = useNavigate();

  const handleIncognito = () => {
    setincognito(true);
    setsignup(false);
    setlogin(false);
    onLogin('');
    navigate('/chat');
  };

  const handlelogin = () => {
    setsignup(false);
    setlogin(true);
    setincognito(false);
  };

  const handlesignup = () => {
    setsignup(true);
    setlogin(false);
    setincognito(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (username !== '') {
      // showPopUp('Login was succesful!');
      onLogin(username); // Perform the login
      
      navigate('/chat'); // Redirect to home page
    // }
  };

  return (
    <div>
      <div className="choose">
        {login ? (
          <>
            <h2 onClick={handleIncognito}>Γράψε ανώνυμα</h2>
            <h2 onClick={handlesignup}>Κάνε εγγραφή</h2>
          </>
        ) : signup ? (
          <>
            <h2 onClick={handleIncognito}>Γράψε ανώνυμα</h2>
            <h2 onClick={handlelogin}>Κάνε login!</h2>
          </>
        ) : (
          ''
        )}
      </div>
      <div className="Login">
        {login ? (
          <>
            <h1>Κάνε Login!</h1>
            <form onSubmit={handleSubmit}>
              <label htmlFor="username">Username:</label>
              <input
                id="username"
                className="username"
                type="text"
                maxLength={12}
                value={username}
                onChange={handleUsernameChange}
              />
              <label htmlFor="password">Password:</label>
              <div className="password-container">
                <input
                  className="username password-input"
                  type={type}
                  value={password}
                  onChange={handlePasswordChange}
                  onKeyDown={handleKeyDown}
                  maxLength={12}
                  
                />
                <span className="password-icon" onClick={handleToggle}>
                  <Icon icon={icon} size={12} />
                </span>
              </div>
              <button disabled={(!username || !password)} className="sub" type="submit">
                Log In
              </button>
            </form>
          </>
        ) : (
          ''
        )}
        {signup ? (
          <>
            <h1>Κάνε εγγραφή!</h1>
            <form onSubmit={handleSubmit}>
              <label htmlFor="username">Username:</label>
              <input
                id="username"
                className="username"
                type="text"
                maxLength={12}
                value={username}
                // onChange={(e) => setUsername(e.target.value)}
                onChange={handleUsernameChange}
              />
              <label htmlFor="password">Password:</label>
              <div className="password-container">
                <input
                  className="username password-input"
                  type={type}
                  value={password}
                  onChange={handlePasswordChange}
                  onKeyDown={handleKeyDown}
                  maxLength={12}
                />
                <span className="password-icon" onClick={handleToggle}>
                  <Icon icon={icon} size={12} />
                </span>
              </div>
              <button disabled={(!username || !password)} className="sub" type="submit">
                Sign Up
              </button>
            </form>
          </>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

export default LoginPage;
