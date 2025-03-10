// Import necessary modules
import './App.css';
// import { usePopUp } from './App'; 
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Typography } from "@mui/material";
import { CheckCircle as CheckIcon } from "@mui/icons-material"; // Correct import
import supabase from './config/supabaseClient';
import ThemeOption from './ThemeOption';
import axios from './api/axios';
import AuthContext from "./AuthContext";
import { useContext } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import UnderConstruction from './components/Underconstruction';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
function LoginPage() {

  const { login,register,handleIncognitoMode,user,isLoading,loginMessage,loginErrorMessage } = useContext(AuthContext);
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
  const [loadingg, setloadingg] = useState(false);
  const [msgloading, setmsgloading] = useState("");
  const [loginbut, setloginbut] = useState("");
  const [signupbut, setsignupbut] = useState("");
  // const [icon, setIcon] = useState(eyeOff);
  const [typepassword, setTypepassword] = useState(false);
  const [forgotpassword, setforgotpassword] = useState(null);
  const [loginError, setloginError] = useState(false);
  
  
  const [EmailInput, setEmailInput] = useState(false);
  const [ShowEmailSpan, setShowEmailSpan] = useState(true);
  const [email, setEmail] = useState('');

if(document.title!=='Login' && document.title!=='Signup' ){
  document.title='Login'
}


  useEffect(() => {
    setErrorloginmessage(loginMessage);
  }, [loginMessage]); // This runs whenever `loginMessage` changes
  

  useEffect(() => {
    if(loginError){
      setforgotpassword("Forgot password?")
    }
    else {
      setforgotpassword(null);
    }
    
  }, [loginError]);

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  
  const handleEmailChange = (e) => {
    setErrormessage("");
    setErrorloginmessage("");
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e.target.value)) {
      setErrorloginmessage('*Invalid email format*');
    }
    
    else
    {
      setErrorloginmessage(""); 
    }
    
    setEmail(e.target.value.replace(/[^a-zA-Z0-9._%+-@.-]/g, ''));

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
  


  const handleforgotpassword = () => {
    if(forgotpassword==='Forgot password?'){
    setforgotpassword("Sorry I am still working on that :(")
  }
  else {setforgotpassword("Forgot password?")}

  };
  const handleEmailInput = () => {
    setEmailInput(true);
    setShowEmailSpan(false);
  };
  const handleIncognitobutton = async(e) => {

  };
  const handleLoginbutton = async(e) => {
    e.preventDefault();
    setErrorloginmessage("");
    setloadingg(true);
    setloginbut("Trying to sign in");
    setloginError(false);
    try {
      await login(username.toLowerCase(), password);
      // Ensure user is properly updated before setting success
      if (!user) {
        throw new Error("User not found after login");
      }
      console.log("ddd",loginMessage);
      setSuccess(true);
      setSuccessMessage("Login was successful, redirecting to Chat...");
      setloadingg(false);
      setTimeout(() => {
        navigate("/chat");
      }, 3000);
    } catch (err) {
      setloginError(true);
      setloginbut("")
      console.error("Login failed:", err);
      setSuccess(false); // Ensure success is reset
      setSuccessMessage(""); // Clear success message
      setErrorloginmessage(loginMessage);
      console.log("loginMessage: ", loginMessage);
    }
  };

 
  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorloginmessage("");
    setloadingg(true);
    setsignupbut("Trying to sign up");
    console.log('Sign up?');
    // try {
      // await axios.post('http://localhost:8000/register', {username,password})
    // } catch (error) {
      // console.log(error);
    // }
    try {
      console.log('Sign up? sure?');
      await register(username.toLowerCase(), password, email, "");
      console.log('Sign up? sure?');
      console.log("User registered");
      setSuccess(true);
      setSuccessMessage("Register was successful, you can now login..."); // Set success message on successful registration
      setloadingg(false);
      setsignupbut("");
      handlelogin();
      console.log(successMessage);
      setTimeout(() => {
        setSuccess(false) // Redirect after showing success message
      }, 2000);
    } catch (err) {
      
      setloadingg(false);
      setErrorloginmessage("*User already exists*");
      setsignupbut("");
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
              <div className='SPACE'>
              <Typography variant='h1' sx={{fontWeight:"bold"}}>Log in!</Typography>
              </div>
              
              <form onSubmit={handleLoginbutton}>
              {errorloginmessage && <Typography  sx={{fontWeight:"bold"}} variant='span' >{errorloginmessage}</Typography>}
                <label htmlFor="username">Username:</label>
                <input 
                
                  id="username"
                  className="username"
                  // variant="outlined"
                  // label="Username"
                  type="text"
                  maxLength={12}
                  value={username}
                  onChange={handleUsernameChange}
                  // fullWidth
                
                  //   "& .MuiOutlinedInput-root": {
                  //     borderRadius: "10px",
                  //     textAlign: "center",
                  //   },
                  //   "& .MuiOutlinedInput-notchedOutline": {
                  //     borderColor: "var(--basic-txt-blue)", 
                  //     "& legend": {
                  //       width: "0px !important", 
                  //     },
                  //   },
                  //   "& .MuiInputLabel-root": {
                  //     color: "var(--basic-txt-blue)", // Match theme
                  //     left: "12px", // ✅ Moves label slightly left to avoid gap
                  //     transformOrigin: "top left", // ✅ Ensures smooth shrinking
                  //   },
                  //   "& .MuiInputLabel-shrink": {
                  //     transform: "translate(0, -6px) scale(0.75) !important", // ✅ Ensures label moves correctly
                  //   },
                  //   "& .MuiOutlinedInput-input": {
                  //     padding: "10px 12px", // ✅ Ensures consistent spacing inside input
                  //   },
                  // }}
                />
                
                <label htmlFor="password">Password:</label>
                <div className="password-container">
                {/* <TextField */}
                <input
                    className="username password-input"
                    // variant="outlined"
                    // label="Password"
                    type={type}
                    value={password}
                    onChange={handlePasswordChange}
                    onKeyDown={handleKeyDown}
                    maxLength={12}
                    autocomplete="current-password"
                    // InputProps={{
                    //   endAdornment: (
                    //     <InputAdornment position="end">
                    //       <IconButton
                    //         aria-label={showPassword ? 'Hide password' : 'Show password'}
                    //         onClick={handleClickShowPassword}
                    //         edge="end"
                    //       >
                    //         {showPassword ? <VisibilityOff /> : <Visibility />}
                    //       </IconButton>
                    //     </InputAdornment>
                    //   ),
                    // }}
                  />
                </div>
                <span onClick={handleforgotpassword} style={{cursor:"pointer"}}>{forgotpassword}</span>
                <button disabled={!(username && password) || loginbut} className="sub" type="submit">
                  Log in
                </button>
                {loginbut && (
  <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "15px"}}>
    <CircularProgress size={14} />
    {loginbut}
  </span>
)}
              </form>
            </div>
          )}
  
          {signup && (
            <div className="Login" >
              <div className='SPACE'>
              <Typography variant='h1' overflow={"visible"} sx={{fontWeight:"bold"}}>Sign up!</Typography></div>
              {(errormessage || loginErrorMessage) && <h4 className="ERROR">{errormessage} || {loginErrorMessage}</h4>}
              
              <form onSubmit={handleSignUp}>
              {errorloginmessage && <span className="ERROR">{errorloginmessage}</span>}
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
                </div>
                {ShowEmailSpan &&
                <Typography sx={{maxWidth:"19ch", cursor:"pointer"}} variant='span' onClick={handleEmailInput} >Add an email (optional) for password recovery</Typography>
              }
              {EmailInput && (
                <>
                <label htmlFor="email" title='Email is optional, used for password recovery'>Email:</label>
                <input
                  id="email"
                  className="username"
                  type="text"
                  maxLength={254}
                  value={email}
                  onChange={handleEmailChange}
                  style={{width:"30ch"}}
                />
                </>
              )}
                <button disabled={!(username && password) || signupbut} className="sub" type="submit">
                Sign Up
                </button>
                {signupbut && (
  <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "15px"}}>
    <CircularProgress size={14} />
    {signupbut}
  </span>
)}
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
  
}

export default LoginPage;
