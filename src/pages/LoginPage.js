// Import necessary modules
import '../App.css';
// import { usePopUp } from './App'; 
import React, { useEffect, useState } from 'react';
import { Alert, Typography } from "@mui/material";
import { CheckCircle as CheckIcon } from "@mui/icons-material";
import ThemeOption from '../ThemeOption';
import axios from '../api/axios'
import AuthContext from "../AuthContext";
import { useContext } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, useLocation,useParams } from "react-router-dom";
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../components/LoadingSpinner';
function LoginPage() {
  const { t } = useTranslation();
  const { login,register,handleIncognitoMode,user,isLoading,loginMessage,ERRORMessage } = useContext(AuthContext);
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
  const [VisibleFullName, setVisibleFullName] = useState(false);
  
  const [EmailInput, setEmailInput] = useState(false);
  const [ShowEmailSpan, setShowEmailSpan] = useState(true);
  const [email, setEmail] = useState('');
  const [last_name, setLast_name] = useState('');
  const [first_name, setFirst_name] = useState('');
  const [ValidEmail, setValidEmail] = useState(true);
  const [WhyButDisabled, setWhyButDisabled] = useState(t("fill_username_password"));

  const location = useLocation();
  const navigate = useNavigate();
  const { mode } = useParams();
  useEffect(() => {
  if(location.pathname==='/auth/' ||location.pathname==='/auth' ){
    navigate("/auth/login");
  }
}, [location.pathname]);
  

useEffect(() => {
  setErrorloginmessage(ERRORMessage); // This will show when the error message is updated
}, [ERRORMessage]);

  
if(document.title!=='Log in' && document.title!=='Sign up' ){
  document.title='Log in'
}
  
useEffect(() => {
  if (mode==='login') {
    handlelogin();
  }
  if(mode==='register'){
    handlesignup();
  }
  if(mode==='signup'){
    handlesignup();
  }
  if(mode==='incognito'){
    handleIncognitobutton();
  }
}, [mode]);

  useEffect(() => {
    // setErrorloginmessage(loginMessage);
  }, [loginMessage]); // This runs whenever `loginMessage` changes
  

  useEffect(() => {
    if(loginError){
      setforgotpassword(t("forgot_password"))
    }
    else {
      setforgotpassword(null);
    }
    
  }, [loginError]);

  const [showPassword, setShowPassword] = useState(false);
  const [GoToNext, setGoToNext] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleBackToUseranme = () => {
      setGoToNext(true);
      setEmailInput(false);
  };
  
  const handleEmailChange = (e) => {
    setErrormessage("");
    setErrorloginmessage("");
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e.target.value)) {
      setErrorloginmessage('*'+t('invalid_email')+'*');
      setValidEmail(false);
      setWhyButDisabled(t('invalid_email'))
    }
    else
    {
      setWhyButDisabled('')
      setValidEmail(true);
      setErrorloginmessage(""); 
    }
    
    if(username && password && email=== ''){
      setValidEmail(true);
      setWhyButDisabled('');
    }

    setEmail(e.target.value.replace(/[^a-zA-Z0-9._%+-@.-]/g, ''));

  };
  const handleUsernameChange = (e) => {
    // setUsername(e.target.value.replace(/\s/g, ''));
    setErrormessage("");
    setErrorloginmessage("");
    // input.value = input.value.replace(/[^a-zA-Z0-9]/g, '');
    if (/[^a-zA-Z0-9]/.test(e.target.value)) {
      setWhyButDisabled(t("fill_username"));
      setErrorloginmessage('*'+t("only_letters_numbers")+'*')
    }  
    setUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, ''));
    if(username===''){ setWhyButDisabled(t("fill_username"));}
  };
  const handlePasswordChange = (e) => {
    // Prevent whitespace by replacing spaces with an empty string
    setTypepassword(true);
    setErrormessage("");
    setErrorloginmessage("");
    if(password!==''){ setWhyButDisabled('');}
   
    setPassword(e.target.value.replace(/\s/g, ''));
    setPassword(e.target.value);
  };


  useEffect(()=>{
    if(username==='' && password!==''){
      setWhyButDisabled(t("fill_username"));
    }
    if(username!=='' && password===''){
      setWhyButDisabled(t("fill_password"));
    }
    if(username==='' && password===''){
      setWhyButDisabled(t("fill_username_password"));
    }
    if(username!=='' && password!==''){
      setWhyButDisabled('')
    }
    if(email && email.length<5){
      setValidEmail(false);
      
    }
    if(email && email.length<5 && username && password ){
      setValidEmail(false);
      setWhyButDisabled(t('invalid_email'))
    }
    if(email.length===0){
      setValidEmail(true);
      setErrorloginmessage("");
    }

    if(username && password && !ValidEmail){
      setWhyButDisabled(t('invalid_email'))
    }
  },[username,password,email,ValidEmail]);
  

  const handleFirstNameChange = (e) => {
    // setUsername(e.target.value.replace(/\s/g, ''));
    setErrormessage("");
    setErrorloginmessage("");
    // input.value = input.value.replace(/[^a-zA-Z0-9]/g, '');
    if (/[^A-Za-z]/.test(e.target.value)) {
      setErrorloginmessage('*'+t('only_letters_in_last_name')+'*');
    }
    setFirst_name(e.target.value.replace(/[^A-Za-z]/g, ''));
    
  };
  const handleLastNameChange = (e) => {
    // setUsername(e.target.value.replace(/\s/g, ''));
    setErrormessage("");
    setErrorloginmessage("");
    // input.value = input.value.replace(/[^a-zA-Z0-9]/g, '');
    if (/[^A-Za-z]/.test(e.target.value)) {
      setErrorloginmessage('*'+t('only_letters_in_last_name')+'*');
    }
    
    setLast_name(e.target.value.replace(/[^A-Za-z]/g, ''));
    
  };

  const handleKeyDown = (e) => {
    // Block space and tab keys
    if (e.key === ' ' || e.key === 'Tab') {
      e.preventDefault();
    }
  };
 
  const handleIncognitobutton = () => {
    handleIncognito();
  }

  const handleIncognito = async() => {
    // e.preventDefault();
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
    document.title='Log in';
    setErrorloginmessage("");
    setErrormessage("");
    setsignup(false);
    setlogin(true);
    setincognito(false);
    navigate("/auth/login");
  };

  const handlesignup = () => {
    document.title='Sign up';
    setErrorloginmessage("");
    setErrormessage("");
    setsignup(true);
    setlogin(false);
    setincognito(false);
    navigate("/auth/register");
  };

  useEffect(()=>{
    if (localStorage.getItem('vst') !== 'true'){
      handlesignup();
    }
  },[localStorage.getItem('vst')]);
  


  const handleforgotpassword = () => {
    if(forgotpassword=== (t("forgot_password"))){
    setforgotpassword(t("sorry_still_working"));
  }
  else {setforgotpassword(t("forgot_password"))}

  };
  const handleEmailInput = () => {
    setEmailInput(true);
    setShowEmailSpan(false);
  };
  
  const handleLoginbutton = async(e) => {
    e.preventDefault();
    setShowPassword(false);
    setErrorloginmessage("");
    setloadingg(true);
    setloginbut(t("tryingtosignin"));
    setloginError(false);
    try {
      await login(username.toLowerCase(), password);
      // Ensure user is properly updated before setting success
      if (!user) {
        throw new Error("User not found after login");
        setErrorloginmessage("User not found after login");
      }
      console.log("ddd",ERRORMessage);
      setSuccess(true);
      setSuccessMessage("Login was successful, redirecting to Chat...");
      setloadingg(false);
      setTimeout(() => {
        // navigate(from, { replace: true });
      }, 3000);
    } catch (err) {
      setloginError(true);
      setloginbut("")
      console.error("Login failed:", err);
      setSuccess(false); // Ensure success is reset
      setTimeout(() => {
        setSuccessMessage(""); // Clear success message
        setErrorloginmessage(ERRORMessage);
        console.log("ERRORMessage: ", ERRORMessage);
      }, 2000);
      
    }
  };

 
  const handleSignUp = async (e) => {
  e.preventDefault();
  setShowPassword(false);
  setErrorloginmessage("");
  setloadingg(true);
  setsignupbut(t("tryingtosignup"));

  console.log('Sign up?');

  const success = await register(
    username.toLowerCase(),
    password,
    email,
    first_name !== '' ? first_name + ' ' + last_name : ''
  );

  if (success) {
    // Only proceed if registration succeeded
    console.log("User registered");
    setSuccess(true);
    setSuccessMessage("Register was successful, you can now login...");
    setloadingg(false);
    setsignupbut("");

    handlelogin(); // Call login only if registration succeeded

    setTimeout(() => {
      setSuccess(false); // Hide success message after 2s
    }, 2000);
  } else {
    // Registration failed
    setloadingg(false);
    setsignupbut("");
    setErrorloginmessage("*User already exists*"); // Or use error from register
  }
};
  return (
    <div style={{userSelect: 'none'}}>
      <ThemeOption />
      {(Success) ? (
        <div><LoadingSpinner message={successMessage} /></div>
      ) : (
        <>
          <div className="choose">
            {login_check ? (
              <>
                <h2 onClick={handleIncognito} style={{cursor:'pointer'}} title={t('go_incognito_title')}>{t("go_incognito")}</h2>
                <h2 onClick={handlesignup} style={{cursor:'pointer'}} title={t('sign_up_title')}>{t("signup")}</h2>
              </>
            ) : signup ? (
              <>
                <h2 onClick={handleIncognito} style={{cursor:'pointer'}} title={t('go_incognito_title')}>{t("go_incognito")}</h2>
                <h2 onClick={handlelogin} style={{cursor:'pointer'}} title={t('sign_in_title')}>{t("Login")}</h2>
              </>
            ) : null}
          </div>
  
          {login_check && (
            <div className="Login">
              <div className='SPACE'>
              <Typography variant='h1' sx={{fontWeight:"bold"}}>{t("Login")}!</Typography>
              </div>
              
              <form onSubmit={handleLoginbutton}>
              {errorloginmessage && <Typography  sx={{fontWeight:"bold"}} variant='span' >{errorloginmessage}</Typography>}
                <label htmlFor="username">{t("username")}:</label>
                <input 
                
                  id="username"
                  className="username"
                  // variant="outlined"
                  // label="Username"
                  type="text"
                  maxLength={12}
                  value={username}
                  onChange={handleUsernameChange}
                  spellCheck={false}
                />
                <label htmlFor="password">{t("password")}:</label>
                <div className="password-container" style={{ position: "relative", display: "inline-block" }}>
      <input
        className="username password-input"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={handlePasswordChange}
        onKeyDown={handleKeyDown}
        maxLength={12}
        autoComplete="current-password"
        style={{ paddingRight: "10px" }} // Space for the icon
      />
      <span
        className="password-toggle"
        onClick={() => setShowPassword(!showPassword)}
        style={{
          position: "absolute",
          right: "10px",
          top: "40%",
          margin: "5px",
          transform: "translateY(-50%)",
          cursor: "pointer",
          fontSize: "15px",
        }}
      >
            {password ? showPassword ? <Visibility fontSize='15px' /> :  <VisibilityOff  fontSize='15px'/> : null}
      </span>
    </div>
                <span onClick={handleforgotpassword} style={{cursor:"pointer"}}>{forgotpassword}</span>
                <button disabled={!(username && password) || loginbut} className="sub" type="submit" title={WhyButDisabled ? WhyButDisabled : t("click_here_login")}>
                  {t("log_in")}
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
              <Typography variant='h1' overflow={"visible"} sx={{fontWeight:"bold"}}>{t("signup")}!</Typography></div>
              {/* {(errormessage || errorloginmessage) && <h4 className="ERROR">{errormessage} || {errorloginmessage}</h4>} */}
              
              <form onSubmit={handleSignUp}>
              {errorloginmessage && <span className="ERROR">{errorloginmessage}</span>}
              {!EmailInput && (
                <>
                {GoToNext && (<ArrowCircleRightIcon style={{cursor:'pointer'}} fontSize='medium' onClick={handleEmailInput}  titleAccess={t("view_email_fullname")} />)}
                <label htmlFor="username">{t("username")}:</label>
                <input
                  id="username"
                  className="username"
                  type="text"
                  maxLength={12}
                  value={username}
                  onChange={handleUsernameChange}
                />
                <label htmlFor="password">{t("password")}:</label>
                <div className="password-container" style={{ position: "relative", display: "inline-block" }}>
      <input
        className="username password-input"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={handlePasswordChange}
        onKeyDown={handleKeyDown}
        maxLength={12}
        autoComplete="current-password"
        style={{ paddingRight: "10px" }} // Space for the icon
      />
      <span
        className="password-toggle"
        onClick={() => setShowPassword(!showPassword)}
        style={{
          position: "absolute",
          right: "10px",
          top: "40%",
          margin: "5px",
          transform: "translateY(-50%)",
          cursor: "pointer",
          fontSize: "15px",
        }}
      >
          {password ? showPassword ? <isibility fontSize='15px'/> :  <VisibilityOff  fontSize='15px'/> : null} 
      </span>
    </div>
                </>)}
                {ShowEmailSpan &&
                <Typography sx={{maxWidth:"26ch", cursor:"pointer"}} variant='span' onClick={handleEmailInput}  onMouseEnter={() => setVisibleFullName(true)}
                onMouseLeave={() => setVisibleFullName(false)}  >{t('add_email_fullname')} <span className='fullName' 
                // style={{display: VisibleFullName ? "block" : "none",}}
                  >{t("password_recovery")} </span></Typography>
                
              }
              {EmailInput && (
                <>
                <ArrowCircleLeftIcon titleAccess={t("view_useranme_password")} fontSize='medium' style={{cursor:'pointer'}} onClick={handleBackToUseranme} />
                <label htmlFor="email" title={t("email_optional")}>Email:</label>
                <input
                  id="email"
                  className="username"
                  type="text"
                  maxLength={254}
                  value={email}
                  onChange={handleEmailChange}
                />
               
                <label htmlFor="full_name" >First name:</label>
                <input
                  id="first_name"
                  className="username"
                  type="text"
                  maxLength={54}
                  value={first_name}
                  onChange={handleFirstNameChange}
                  // style={{width:"15ch"}}
                />
                 <label htmlFor="full_name" >Last name:</label>
                <input
                  id="last_name"
                  className="username"
                  type="text"
                  maxLength={54}
                  value={last_name}
                  onChange={handleLastNameChange}
                  // style={{width:"15ch"}}
                />
                </>
              )}
                <button disabled={!(username && password && ValidEmail) || signupbut} className="sub" type="submit" title={WhyButDisabled ? WhyButDisabled : t("click_here_singup")}  >
                {t("sign_up")}
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
