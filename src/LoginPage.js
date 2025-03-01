// Import necessary modules
import './App.css';
// import { usePopUp } from './App'; 
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from "@mui/material";
import { CheckCircle as CheckIcon } from "@mui/icons-material"; // Correct import
// import { Icon } from 'react-icons-kit';
// import { eyeOff } from 'react-icons-kit/feather/eyeOff';
// import { eye } from 'react-icons-kit/feather/eye';
import supabase from './config/supabaseClient';
import ThemeOption from './ThemeOption';
import axios from './api/axios';
import AuthContext from "./AuthContext";
import { useContext } from 'react';

function LoginPage() {

  const { login,register,handleIncognitoMode,user,isLoading,loginMessage } = useContext(AuthContext);
  // const showPopUp = usePopUp();

  
  const [username, setUsername] = useState('');
  const [incognito, setincognito] = useState(false);
  const [signup, setsignup] = useState(false);
  const [login_check, setlogin] = useState(true);
  const [Success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const [errorloginmessage, setErrorloginmessage] = useState('');
  const [errormessage, setErrormessage] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('password');
  // const [icon, setIcon] = useState(eyeOff);
  const [typepassword, setTypepassword] = useState(false);

 

  const handleToggle = () => {
    if (type === 'password') {
      // setIcon(eye);
      setType('text');
    } else {
      // setIcon(eyeOff);
      setType('password');
    }
  };
  
  const handleUsernameChange = (e) => {
    // setUsername(e.target.value.replace(/\s/g, ''));
    setErrormessage("");
    setErrorloginmessage("");
    // input.value = input.value.replace(/[^a-zA-Z0-9]/g, '');
    if (/[^a-zA-Z0-9]/.test(e.target.value)) {
      setErrorloginmessage('*Only letters and numbers are allowed in username*')
    }  
    setUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, ''));
  };
  const handlePasswordChange = (e) => {
    // Prevent whitespace by replacing spaces with an empty string
    setTypepassword(true);
    setErrormessage("");
    setErrorloginmessage("");
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

  const handleIncognito = async(e) => {
    e.preventDefault();
    setErrormessage("");
    setincognito(true);
    setsignup(false);
    setlogin(false);
    // onLogin('');
    
    try {
      await handleIncognitoMode();
      setTimeout(() => {
        navigate("/chat"); // Redirect after showing success message
      }, 3000);
    } catch (err) {
      setErrorloginmessage("Can't continue as anonymous user, try again or login");
    }
    document.title='Chat';
  };

  const handlelogin = () => {
    document.title='Login';
    setErrorloginmessage("");
    setErrormessage("");
    setsignup(false);
    setlogin(true);
    setincognito(false);
  };

  const handlesignup = () => {
    document.title='Signup';
    setErrorloginmessage("");
    setErrormessage("");
    setsignup(true);
    setlogin(false);
    setincognito(false);
  };

  useEffect(()=>{
    if (localStorage.getItem('vst') !== 'true'){
      handlesignup();
    }
  },[localStorage.getItem('vst')]);
  
  const handleIncognitobutton = async(e) => {

  };
  const handleLoginbutton = async(e) => {
    e.preventDefault();
    try {
      await login(username.toLowerCase(), password);
      
      // Ensure user is properly updated before setting success
      if (!user) {
        throw new Error("User not found after login");
      }
      console.log(loginMessage);
      setSuccess(true);
      setSuccessMessage("Login was successful, redirecting to Chat...");
  
      setTimeout(() => {
        navigate("/chat");
      }, 3000);
    } catch (err) {
      console.error("Login failed:", err);
      setSuccess(false); // Ensure success is reset
      setSuccessMessage(""); // Clear success message
      setErrorloginmessage("*Invalid username or password*");
    }
  };

 
  const handleSignUp = async (e) => {
    e.preventDefault();
    // try {
      // await axios.post('http://localhost:8000/register', {username,password})
    // } catch (error) {
      // console.log(error);
    // }
    try {
      await register(username.toLowerCase(), password, "", "");
      console.log("User registered");
      setSuccess(true);
      setSuccessMessage("Register was successful, you can now login..."); // Set success message on successful registration
      handlelogin();
      console.log(successMessage);
      setTimeout(() => {
        setSuccess(false) // Redirect after showing success message
      }, 2000);
    } catch (err) {
      setErrorloginmessage("*User already exists*");
    }

    // onLogin(username); // Perform the login
    
    
  };
  return (
    <div>
      <ThemeOption />
  
      {(Success) ? (
        <div>{successMessage}</div>
      ) : (
        <>
          <div className="choose">
            {login_check ? (
              <>
                <h2 onClick={handleIncognito} title='You can enter the app as anonymous user'>Go incognito</h2>
                <h2 onClick={handlesignup} title='Create an account'>Sign up</h2>
              </>
            ) : signup ? (
              <>
                <h2 onClick={handleIncognito} title='You can enter the app as anonymous user'>Go incognito</h2>
                <h2 onClick={handlelogin} title='Log in into your account'>Log in</h2>
              </>
            ) : null}
          </div>
  
          {login_check && (
            <div className="Login">
              <h1>Log in!</h1>
              {errorloginmessage && <div className="ERROR">{errorloginmessage}</div>}
              <form onSubmit={handleLoginbutton}>
                <label htmlFor="username">Username:</label>
                <input
                  id="username"
                  className="username"
                  type="text"
                  maxLength={12}
                  value={username}
                  onChange={handleUsernameChange}
                  autocomplete="username"
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
                    autocomplete="current-password"
                  />
                  <span className="password-icon" onClick={handleToggle}></span>
                </div>
                <button disabled={!(username && password)} className="sub" type="submit">
                  Log In
                </button>
              </form>
            </div>
          )}
  
          {signup && (
            <div className="Login" >
              <h1>Sign up!</h1>
              {errormessage && <h4 className="ERROR">{errormessage}</h4>}
              {errorloginmessage && <div className="ERROR">{errorloginmessage}</div>}
              <form onSubmit={handleSignUp}>
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
                  <span className="password-icon" onClick={handleToggle}></span>
                </div>
                <button disabled={!(username && password)} className="sub" type="submit">
                  Sign Up
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
  
}

export default LoginPage;
