import React, { useEffect, useState, useContext } from 'react';
import { 
  Alert, 
  Typography, 
  Container, 
  Box, 
  TextField, 
  Button, 
  InputAdornment, 
  IconButton, 
  Stack, 
  CircularProgress,
  Link,
  Grid
} from "@mui/material";
import { 
  Visibility, 
  VisibilityOff, 
  ArrowCircleLeft as ArrowCircleLeftIcon 
} from "@mui/icons-material";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';

// Local Component Imports
import ThemeOption from '../ThemeOption';
import LoadingSpinner from '../components/LoadingSpinner';
import AuthContext from "../AuthContext";

const textInputStyle = {
  '& .MuiOutlinedInput-root': {
    color: '#b0c4de',
    borderRadius: '30px',
    border: '1px solid #3e5c76',
    backgroundColor: 'rgba(2, 26, 50, 0.6)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden', 
    // ⚡️ MOVE PADDING HERE: This keeps the text away from the edges
    // while letting the input element expand to the full width
    padding: '0 50px', 
    '& fieldset': { border: 'none' },
    '&:hover': {
      border: '1px solid #66b2ff',
      backgroundColor: 'rgba(2, 26, 50, 0.8)',
    },
    '&.Mui-focused': {
      border: '1px solid #66b2ff',
      boxShadow: '0 0 10px rgba(102, 178, 255, 0.3)',
    },
    '& .MuiInputAdornment-root': {
      position: 'absolute',
      // Ensure the icon stays within that 50px right padding
      right: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2, 
    },
  },
  '& .MuiInputBase-input': {
    // ⚡️ REMOVE PADDING FROM INPUT: This ensures the autofill color
    // touches your actual border, leaving no gap.
    padding: '12px 0', 
    textAlign: 'center',
    zIndex: 1,
    border: 'none !important',
    outline: 'none !important',
    
    // --- ⚡️ AUTOFILL FIX START ⚡️ ---
    '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active': {
      WebkitTextFillColor: '#b0c4de !important',
      // We use a large inset shadow to force our color over the browser's blue
      WebkitBoxShadow: '0 0 0 1000px #021a32 inset !important',
      boxShadow: '0 0 0 1000px #021a32 inset !important',
      
      // These force the browser to hide its own internal borders
      border: 'none !important',
      outline: 'none !important',
      backgroundClip: 'content-box !important',
      
      caretColor: '#b0c4de',
      transition: 'background-color 500000s ease-in-out 0s',
    },
    // --- ⚡️ AUTOFILL FIX END ⚡️ ---
  }
};

const labelStyle = {
  color: '#b0c4de',
  marginBottom: '4px',
  display: 'block',
  textAlign: 'center',
  fontSize: '0.9rem'
};

// --- Modern Toggle Style ---
const toggleContainerStyle = {
  display: 'flex',
  backgroundColor: 'rgba(2, 26, 50, 0.6)',
  borderRadius: '30px',
  padding: '4px',
  border: '1px solid #3e5c76',
  position: 'relative',
  marginBottom: '20px',
  width: 'fit-content',
  margin: '0 auto 20px auto' 
};

const toggleItemStyle = (isActive) => ({
  cursor: 'pointer',
  padding: '8px 30px',
  borderRadius: '25px',
  backgroundColor: isActive ? '#1e88e5' : 'transparent', 
  color: isActive ? '#fff' : '#b0c4de',
  transition: 'all 0.3s ease',
  fontWeight: isActive ? '600' : '400',
  boxShadow: 'none', 
  userSelect: 'none'
});

function LoginPage() {
  const { t } = useTranslation();
  const { login, register, handleIncognitoMode, user, loginMessage, ERRORMessage } = useContext(AuthContext);

  // --- State Definitions ---
  const [username, setUsername] = useState('');
  const [incognito, setincognito] = useState(false);
  const [signup, setsignup] = useState(false);
  const [login_check, setlogin] = useState(true);
  const [Success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const [errorloginmessage, setErrorloginmessage] = useState('');
  const [errormessage, setErrormessage] = useState('');
  const [password, setPassword] = useState('');
  
  const [loadingg, setloadingg] = useState(false);
  const [loginbut, setloginbut] = useState("");
  const [signupbut, setsignupbut] = useState("");
  
  const [typepassword, setTypepassword] = useState(false);
  const [forgotpassword, setforgotpassword] = useState(null);
  const [loginError, setloginError] = useState(false);
  
  const [EmailInput, setEmailInput] = useState(false);
  const [ShowEmailSpan, setShowEmailSpan] = useState(true);
  const [email, setEmail] = useState('');
  const [last_name, setLast_name] = useState('');
  const [first_name, setFirst_name] = useState('');
  const [ValidEmail, setValidEmail] = useState(true);
  const [WhyButDisabled, setWhyButDisabled] = useState(t("fill_username_password"));
  const [showPassword, setShowPassword] = useState(false);
  const [GoToNext, setGoToNext] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { mode } = useParams();

  // --- Effects ---
  useEffect(() => {
    if (location.pathname === '/auth/' || location.pathname === '/auth') {
      navigate("/auth/login");
    }
  }, [location.pathname]);

  useEffect(() => {
    setErrorloginmessage(ERRORMessage);
  }, [ERRORMessage]);

  useEffect(() => {
    if (document.title !== 'Log in' && document.title !== 'Sign up') {
      document.title = 'Log in';
    }
  }); 

  useEffect(() => {
    if (mode === 'login') handlelogin();
    if (mode === 'register' || mode === 'signup') handlesignup();
    if (mode === 'incognito') handleIncognitobutton();
  }, [mode]);

  useEffect(() => {
    if (loginError) {
      setforgotpassword(t("forgot_password"));
    } else {
      setforgotpassword(null);
    }
  }, [loginError]);

  useEffect(() => {
    if (login_check) {
      if (!username) return setWhyButDisabled(t("fill_username"));
      if (!password) return setWhyButDisabled(t("fill_password"));
      return setWhyButDisabled("");
    }

    if (signup) {
      if (!username) return setWhyButDisabled(t("fill_username"));
      if (username && password && !email) return setWhyButDisabled(t("Email is required"));
      if (username && password && !ValidEmail) return setWhyButDisabled("Invalid email format");
      if (!password) return setWhyButDisabled(t("fill_password"));
      return setWhyButDisabled("");
    }
  }, [username, email, ValidEmail, password, login_check, signup]);

  useEffect(() => {
    if (localStorage.getItem('vst') !== 'true') {
      handlesignup();
    }
  }, []);

  // --- Handlers ---
  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleBackToUseranme = () => {
    setGoToNext(true);
    setEmailInput(false);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9._%+-@.-]/g, '');
    setEmail(value);
    setErrormessage("");
    setErrorloginmessage("");

    if (value === "") {
      setValidEmail(false);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      setValidEmail(false);
      setWhyButDisabled("Invalid email format");
      return;
    }

    setValidEmail(true);
    setWhyButDisabled("");
  };

  const handleUsernameChange = (e) => {
    setErrormessage("");
    setErrorloginmessage("");
    if (/[^a-zA-Z0-9]/.test(e.target.value)) {
      setWhyButDisabled(t("fill_username"));
      setErrorloginmessage(t("only_letters_numbers"));
    }
    setUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, ''));
  };

  const handlePasswordChange = (e) => {
    setTypepassword(true);
    setErrormessage("");
    setErrorloginmessage("");
    if (password !== '') setWhyButDisabled('');
    setPassword(e.target.value.replace(/\s/g, ''));
  };

  const handleFirstNameChange = (e) => {
    setErrormessage("");
    setErrorloginmessage("");
    if (/[^A-Za-z]/.test(e.target.value)) {
      setErrorloginmessage(t('only_letters_in_last_name'));
    }
    setFirst_name(e.target.value.replace(/[^A-Za-z]/g, ''));
  };

  const handleLastNameChange = (e) => {
    setErrormessage("");
    setErrorloginmessage("");
    if (/[^A-Za-z]/.test(e.target.value)) {
      setErrorloginmessage(t('only_letters_in_last_name'));
    }
    setLast_name(e.target.value.replace(/[^A-Za-z]/g, ''));
  };

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Tab') {
      if (e.key === ' ') e.preventDefault(); 
    }
  };

  const handleIncognitobutton = () => handleIncognito();

  const handleIncognito = async () => {
    setErrormessage("");
    setincognito(true);
    setsignup(false);
    setlogin(false);
    try {
      await handleIncognitoMode();
      setTimeout(() => {
        navigate("/chat");
      }, 3000);
    } catch (err) {
      setErrorloginmessage("Can't continue as anonymous user, try again or login");
    }
    document.title = 'Chat';
  };

  const handlelogin = () => {
    document.title = 'Log in';
    setErrorloginmessage("");
    setErrormessage("");
    setsignup(false);
    setlogin(true);
    setincognito(false);
    navigate("/auth/login");
  };

  const handlesignup = () => {
    document.title = 'Sign up';
    setErrorloginmessage("");
    setErrormessage("");
    setsignup(true);
    setlogin(false);
    setincognito(false);
    navigate("/auth/register");
  };

  const handleforgotpassword = () => {
    navigate('/forgot-password', { state: { username } });
  };

  const handleLoginbutton = async (e) => {
    e.preventDefault();
    setShowPassword(false);
    setErrorloginmessage("");
    setloadingg(true);
    setloginbut(t("tryingtosignin"));
    setloginError(false);
    try {
      await login(username.toLowerCase(), password);
      if (!user) throw new Error("User not found after login");
      
      setSuccess(true);
      setSuccessMessage("Login was successful, redirecting to Chat...");
      setloadingg(false);
    } catch (err) {
      setloginError(true);
      setloginbut("");
      setSuccess(false);
      setSuccessMessage("");
      setErrorloginmessage(ERRORMessage || "Login failed");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setShowPassword(false);
    setErrorloginmessage("");
    setloadingg(true);
    setsignupbut(t("tryingtosignup"));

    const success = await register(
      username.toLowerCase(),
      password,
      email,
      first_name !== '' ? first_name + ' ' + last_name : ''
    );

    if (success) {
      setSuccess(true);
      setSuccessMessage("Registration was successful, you are now logging in...");
      setsignupbut("");
      localStorage.setItem('vst', 'true');

      setTimeout(async () => {
        await login(username, password);
        setSuccess(false);
        setloadingg(false);
      }, 2000);
    } else {
      setloadingg(false);
      setsignupbut("");
      setErrorloginmessage("User already exists");
    }
  };

  return (
    <Box 
      sx={{ 
        userSelect: 'none', 
        minHeight: '100vh', 
        backgroundColor: '#021a32', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: 2
      }}
    >
      <ThemeOption />
      
      {Success ? (
        <LoadingSpinner message={successMessage} />
      ) : (
        <Container component="main" maxWidth="md">
          
          {/* --- Toggle Switch --- */}
          <Box sx={toggleContainerStyle}>
            <Box onClick={handlelogin} sx={toggleItemStyle(login_check)}>
              {t("Login")}
            </Box>
            <Box onClick={handlesignup} sx={toggleItemStyle(signup)}>
              {t("signup")}
            </Box>
          </Box>

          {/* Main Card */}
          <Box 
            sx={{ 
              border: '1px solid #3e5c76', 
              borderRadius: '12px',
              padding: { xs: 3, md: 8 },
              position: 'relative',
              backgroundColor: 'transparent', 
              width: '100%'
            }}
          >
            <Grid container spacing={4} alignItems="center">
              
              {/* Left Side: Title */}
              <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography 
                  variant="h2" 
                  component="h1" 
                  fontWeight="bold" 
                  sx={{ 
                    color: '#b0c4de', 
                    fontSize: { xs: '3rem', md: '5rem' },
                    letterSpacing: '-2px'
                  }}
                >
                  {login_check ? `${t("Login")}!` : `${t("signup")}!`}
                </Typography>
              </Grid>

              {/* Right Side: Form */}
              <Grid item xs={12} md={6}>
                 {/* Error Message */}
                {/* {errorloginmessage && (
                  // <Alert severity="error" variant="outlined" sx={{ width: '100%', mb: 2, color: '#ffbaba', borderColor: '#ffbaba' }}>
                  <Typography 
                    sx={{ 
                      width: '100%',
                      borderRadius: '8px',
                      textAlign: 'center',
                      marginBottom: 4,
                    }}
                  >
                    * {errorloginmessage} *
                  </Typography>
                )} */}
                <Box sx={{ minHeight: '30px', mb: 2, textAlign: 'center' }}>
    {(errorloginmessage || (signup && WhyButDisabled && username.length > 0)) && (
      <Typography 
        sx={{ 
          width: '100%',
          borderRadius: '8px',
          textAlign: 'center',
          fontWeight: 'bold',
          // ⚡️ FIX: Set a bright color so it is visible on dark background
          color: '#ff6b6b', 
          textShadow: '0 0 10px rgba(255, 107, 107, 0.3)'
        }}
      >
        {/* Prioritize server errors, otherwise show validation errors */}
        * {errorloginmessage || WhyButDisabled} *
      </Typography>
    )}
  </Box>

                {/* Login Form */}
                {login_check && (
                  <Box component="form" onSubmit={handleLoginbutton} sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Stack spacing={2} sx={{ width: '100%', maxWidth: '300px' }}>
                      
                      <Box>
                        <Typography sx={labelStyle}>{t("username")}:</Typography>
                        <TextField
                          id="username"
                          variant="outlined"
                          fullWidth
                          value={username}
                          onChange={handleUsernameChange}
                          inputProps={{ 
                            maxLength: 12,
                            style: { textAlign: 'center' } 
                          }}
                          sx={textInputStyle}
                        />
                      </Box>
                      
                      <Box>
                        <Typography sx={labelStyle}>{t("password")}:</Typography>
                        <TextField
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          fullWidth
                          value={password}
                          onChange={handlePasswordChange}
                          onKeyDown={handleKeyDown}
                          inputProps={{ 
                            maxLength: 12,
                            style: { textAlign: 'center' } // Centered logic
                          }} 
                          sx={textInputStyle}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                  sx={{ color: '#66b2ff' }}
                                >
                                  {password ? (showPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />) : null}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>

                      {forgotpassword && (
                        <Link 
                          component="button" 
                          variant="body2" 
                          onClick={handleforgotpassword} 
                          sx={{ alignSelf: 'center', color: '#b0c4de', textDecorationColor: '#b0c4de' }}
                        >
                          {forgotpassword}
                        </Link>
                      )}

                      <Button
                        type="submit"
                        variant="outlined"
                        size="large"
                        disabled={!(username && password) || !!loginbut}
                        title={WhyButDisabled ? WhyButDisabled : t("click_here_login")}
                        sx={{
                            marginTop: 2,
                            alignSelf: 'center',
                            borderRadius: '20px',
                            color: '#b0c4de',
                            borderColor: '#b0c4de',
                            padding: '5px 30px',
                            fontSize: '1rem',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                borderColor: '#fff',
                                color: '#fff'
                            },
                            '&:disabled': {
                                borderColor: '#334',
                                color: '#445'
                            }
                        }}
                        startIcon={loginbut ? <CircularProgress size={20} color="inherit" /> : null}
                      >
                        {loginbut ? loginbut : t("log_in")}
                      </Button>
                    </Stack>
                  </Box>
                )}

                {/* Sign Up Form */}
                {signup && (
                  <Box component="form" onSubmit={handleSignUp} sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Stack spacing={2} sx={{ width: '100%', maxWidth: '300px' }}>
                      
                      {/* Phase 1: Username & Password & Email */}
                      {!EmailInput && (
                        <>
                          <Box>
                            <Typography sx={labelStyle}>{t("username")}:</Typography>
                            <TextField
                              id="username"
                              fullWidth
                              value={username}
                              onChange={handleUsernameChange}
                              inputProps={{ 
                                maxLength: 12,
                                style: { textAlign: 'center' } 
                              }}
                              sx={textInputStyle}
                            />
                          </Box>

                          <Box>
                            <Typography sx={labelStyle}>Email:</Typography>
                            <TextField
                              id="email"
                              title={t("email_optional")}
                              fullWidth
                              value={email}
                              onChange={handleEmailChange}
                              inputProps={{ 
                                maxLength: 254,
                                style: { textAlign: 'center' } 
                              }}
                              sx={textInputStyle}
                            />
                          </Box>

                          <Box>
                            <Typography sx={labelStyle}>{t("password")}:</Typography>
                            <TextField
                              id="password"
                              type={showPassword ? 'text' : 'password'}
                              fullWidth
                              value={password}
                              onChange={handlePasswordChange}
                              onKeyDown={handleKeyDown}
                              inputProps={{ 
                                maxLength: 12,
                                style: { textAlign: 'center' } 
                              }}
                              sx={textInputStyle}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={handleClickShowPassword}
                                      onMouseDown={handleMouseDownPassword}
                                      edge="end"
                                      sx={{ color: '#66b2ff' }}
                                    >
                                      {password ? (showPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />) : null}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Box>
                        </>
                      )}

                      {/* Phase 2: Names */}
                      {EmailInput && (
                        <>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: '#b0c4de' }}>
                            <IconButton onClick={handleBackToUseranme} title={t("view_useranme_password")} sx={{ color: '#b0c4de' }}>
                              <ArrowCircleLeftIcon fontSize="medium" />
                            </IconButton>
                            <Typography variant="body2">Back</Typography>
                          </Box>

                          <Box>
                             <Typography sx={labelStyle}>Email:</Typography>
                             <TextField
                                id="email-confirm"
                                value={email}
                                onChange={handleEmailChange}
                                fullWidth
                                inputProps={{ 
                                    maxLength: 254,
                                    style: { textAlign: 'center' } 
                                }}
                                sx={textInputStyle}
                             />
                          </Box>
                          
                          <Box>
                             <Typography sx={labelStyle}>First name:</Typography>
                             <TextField
                                id="first_name"
                                value={first_name}
                                onChange={handleFirstNameChange}
                                fullWidth
                                inputProps={{ 
                                    maxLength: 54,
                                    style: { textAlign: 'center' } 
                                }}
                                sx={textInputStyle}
                             />
                          </Box>

                          <Box>
                             <Typography sx={labelStyle}>Last name:</Typography>
                             <TextField
                                id="last_name"
                                value={last_name}
                                onChange={handleLastNameChange}
                                fullWidth
                                inputProps={{ 
                                    maxLength: 54,
                                    style: { textAlign: 'center' } 
                                }}
                                sx={textInputStyle}
                             />
                          </Box>
                        </>
                      )}

                      <Button
                        type="submit"
                        variant="outlined"
                        size="large"
                        disabled={WhyButDisabled !== "" || !!signupbut || !ValidEmail}
                        title={WhyButDisabled || t("click_here_signup")}
                        sx={{
                            marginTop: 2,
                            alignSelf: 'center',
                            borderRadius: '20px',
                            color: '#b0c4de',
                            borderColor: '#b0c4de',
                            padding: '5px 30px',
                            fontSize: '1rem',
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                borderColor: '#fff',
                                color: '#fff'
                            }
                        }}
                        startIcon={signupbut ? <CircularProgress size={20} color="inherit" /> : null}
                      >
                        {signupbut ? signupbut : t("signup")}
                      </Button>
                    </Stack>
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        </Container>
      )}
    </Box>
  );
}

export default LoginPage;