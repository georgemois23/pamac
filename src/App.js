import './App.css';
import React, { useContext,useState,useEffect } from 'react';
import FirstLand from './pages/Firstland';
import LoginPage from './pages/LoginPage';
import Chat from './pages/ChatPage';
import PreviewMsg from './pages/Messages';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
// import ThemeOption from './ThemeOption';
import ErrorPage from './pages/ErrorPage';
import AuthContext from "./AuthContext"; // Import the context
import CircularProgress from '@mui/material/CircularProgress';
import UnderConstruction from './components/Underconstruction';
import Profile from './pages/Profile';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate, useLocation } from "react-router-dom";
import ContentNotAvaiable from './pages/ContentNotAvailable';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import Logout from './pages/Logout';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './languageSwitcher';
import { Avatar, Tooltip } from '@mui/material';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const navigate = useNavigate();
  const { user, token, login, logout, isLoading,loginMessage,LogBut,incognito  } = useContext(AuthContext); // Use the context here
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 310);
  const { t,i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  useEffect(() => {
    console.log("App: ",i18n.language)
    const handleResize = () => setIsMobile(window.innerWidth < 310);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    const message = "You found the console. Nice."; 
    const style = `
    font-size: 1.5rem;
    padding: 0.15rem 0.25rem;
    margin: 1rem;
    font-family: Helvetica, sans-serif;
    color: #a4c2f4;
    background-color: #001f3f;
    border: 2px solid #a4c2f4;
    border-radius: 4px;
    font-weight: bold;
    text-shadow: 1px 1px 1px #0a0121;
    font-style: italic;
  `;

    console.log('%c' + message, style);
  }, []);

  const handleProfile = () => {
    navigate('/profile');
  };
  const location = useLocation();
  const handleChat = () => {
    navigate('/chat');
  };

  const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    if (!user) {
      // If the user is not logged in, redirect to login
      return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
    }
    return children; // Otherwise, render the protected route's children
  };
  
useEffect(() => {
  localStorage.setItem("Button",LogBut);
 
}, [LogBut]);

// useEffect(() => {
//   const theme = localStorage.getItem("theme") || "original";
//   document.body.setAttribute("data-theme", theme);
//   setThemeLoaded(true);
// }, []);
  // if (isLoading) return <CircularProgress sx={{marginTop:"1rem"}} />;
  if (isLoading) {
    return (
      <div style={{
        position: "fixed", 
        top: "50%", 
        left: "50%", 
        transform: "translate(-50%, -50%)", 
        padding: "20px", 
        borderRadius: "10px",
        fontSize: "18px",
        textAlign: "center",
        zIndex: 1000
      }}>
       <LoadingSpinner />
        {loginMessage && (
  <div>          
    <p>{loginMessage}</p>
  </div>)}
      </div> 
    );
  }
 

  

  
  const handleLogout = () => {
    if(!incognito){
      logout();
      navigate('/logout', { state: { fromLogout: true } });
    }
    else{
      logout();
    }
    
  };

  // const changeToGreek = () => {
  //   console.log('Manually switching to Greek');
  //   {i18n.language==='el' ? i18n.changeLanguage('en') : i18n.changeLanguage('el');} 
  //   // i18n.changeLanguage('el'); // Change language to Greek
  // };
 


  const changeToGreek = () => {
    const newLang = i18n.language === 'el' ? 'en' : 'el';
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);
    const newPath = newLang === 'el' ? `/el${location.pathname.replace(/^\/el/, '')}` : location.pathname.replace(/^\/el/, '');
    navigate(newPath);
  };
  
  return (
    // <ThemeOption>
      // {/* <PopUpContext.Provider value={{}}> */}
          <div className="App">
          {location.pathname === "/" && <UnderConstruction message={t("this_website_under_construction")}/>}
          {user && !incognito && location.pathname !== "/profile" && location.pathname !== "/messages" && window.location.pathname !== "/404" &&(
        // <AccountCircleIcon titleAccess={t('visit_profile_info')} onClick={handleProfile} sx={{ position: 'fixed', top: '.8rem', left: '.8rem',cursor:'pointer' }} className='accountIcon' />
        <Tooltip title={t('visit_profile_info')}>
        <Avatar title={t('visit_profile_info')}  onClick={handleProfile} sx={{ position: 'fixed', top: '.8rem', left: '.8rem',cursor:'pointer', backgroundColor:"text.primary", }}  >{(user.first_name && user.last_name) ? user.first_name[0].toUpperCase() + user.last_name[0].toUpperCase() : user.username[0].toUpperCase()}</Avatar>
        </Tooltip>

      )}

      {user && !incognito && location.pathname === "/profile" && (
        <ChatBubbleOutlineIcon titleAccess={t('back_to_chat')} onClick={handleChat} sx={{ position: 'fixed', top: '.8rem', left: '.8rem',cursor:'pointer', backgroundColor:'transparent' }} className='chatIcon' />
      )}
        {user && location.pathname !== "/profile"&& location.pathname !== "/" && window.location.pathname !== "/404" && window.location.pathname !== "/restricted"  &&(
          isMobile ? (incognito ? <LoginIcon onClick={handleLogout} sx={{ position: 'fixed', top: '.8rem', right: '.8rem',cursor:'pointer', backgroundColor:'transparent' }}/> : <LogoutIcon onClick={handleLogout} sx={{ position: 'fixed', top: '.8rem', right: '.8rem',cursor:'pointer', backgroundColor:'transparent' }}/>) :
          <button onClick={handleLogout} className="logout-button" title={LogBut===t('Logout') ? t("logout_title") : t("enter_chat_with_credentials")}>
             {LogBut}
          </button>
          
        )}
           
        {/* {location.pathname === "/" && !user && (!isMobile ? <div style={{fontSize:'20px',height:'fit-content', cursor: 'pointer', position:'fixed', left: '50%', transform: 'translateX(-50%)',bottom:'0.8rem',userSelect:'none'}} onClick={changeToGreek}>{t(i18n.language==='en' ? 'switch_language_el' : 'switch_language_en')}</div> : <div style={{fontSize:'20px',height:'fit-content', position: 'fixed', top: '.8rem', right: '.8rem' , cursor: 'pointer' }}><LanguageSwitcher/></div> )} */}
        {/* {location.pathname === "/profile" && <div style={{fontSize:'20px',height:'fit-content', position: 'fixed', top: '.8rem', right: '.8rem' , cursor: 'pointer' }}><LanguageSwitcher/></div>} */}
        <Routes>
          <Route
            path="/"
            element={user ? <Navigate to="/chat" /> : <FirstLand />}
                // element={<FirstLand />}
              />
              <Route path="/auth/:mode" element={user ? <Navigate to="/chat"/> :<LoginPage />} />
              <Route
  path="/logout"
  element={
    !user ? (
      location.state?.fromLogout ? (
        <Logout />
      ) : (
        <Navigate to="/auth/login" replace />
      )
    ) : (
      <Chat user={user} replace />
    )
  }
/>
          <Route path="/el" element={<Navigate to="/" replace />} />  
          <Route path="/en" element={<Navigate to="/" replace />} />  
              <Route
                path="/auth"
                element={user ? <Navigate to="/chat" replace /> : <LoginPage />}
              />
               {/* <Route path="/login" element={<Navigate to="/auth" replace />} /> */}
               {/* <Route path="/register" element={<Navigate to="/auth" replace />} /> */}
               <Route path="/c/*" element={<Navigate to="/chat" replace />} />
            <Route
                path="/chat"
                element={user ? <Chat user={user} /> : <Navigate to="/auth" replace />}
              />
              <Route path="/login" element={user ? <Navigate to="/chat"/> : <Navigate to="/auth/login" />} />
              <Route path="/register" element={user ? <Navigate to="/chat"/> : <Navigate to="/auth/register" />} />
              <Route path="/signup" element={user ? <Navigate to="/chat"/> : <Navigate to="/auth/register" />} />

             

<Route
  path="/profile"
  element={
    user ? (
      !incognito ? (
        <Profile user={user} />
      ) : (
        <Navigate to="/restricted" replace state={{ from: "redirect" }} />
      )
    ) : (
      <Navigate to="/auth" replace />
    )
  }
/>
              <Route
                path="/messages"
                element={<PreviewMsg />}
              />
              <Route path="*" element={<Navigate to="/404" />} />
              <Route path="/restricted" element={incognito ? <ContentNotAvaiable/> : <Navigate to='/' replace/>} />
              <Route path="/404" element={<ErrorPage />} />
            </Routes>
          </div>
  );
}

export default App;
