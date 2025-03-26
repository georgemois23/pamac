import './App.css';
import React, { useContext,useState,useEffect } from 'react';
import FirstLand from './Firstland';
import LoginPage from './LoginPage';
import Chat from './Chat';
import PreviewMsg from './PreviewMsg';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
// import ThemeOption from './ThemeOption';
import ErrorPage from './ErrorPage';
import AuthContext from "./AuthContext"; // Import the context
import CircularProgress from '@mui/material/CircularProgress';
import UnderConstruction from './components/Underconstruction';
import Profile from './Profile';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { useNavigate, useLocation } from "react-router-dom";
import ContentNotAvaiable from './ContentNotAvailable';
import ChatIcon from '@mui/icons-material/Chat';
function App() {
  const navigate = useNavigate();
  const { user, token, login, logout, isLoading,loginMessage,LogBut,incognito  } = useContext(AuthContext); // Use the context here
  const [themeLoaded, setThemeLoaded] = useState(false);

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
        <CircularProgress sx={{ marginTop: "1rem" }} />
        {loginMessage && (
  <div>          
    <p>{loginMessage}</p>
  </div>)}
      </div> 
    );
  }
 

 
  
  const handleLogout = () => {
    logout();
  };

  return (
    // <ThemeOption>
      // {/* <PopUpContext.Provider value={{}}> */}
          <div className="App">
          <UnderConstruction message={"This website is currently under construction by George Moysiadis."}/>
          {user && !incognito && location.pathname !== "/profile" && location.pathname !== "/messages" && window.location.pathname !== "/404" &&(
        <AccountBoxIcon titleAccess='Visit profile info' onClick={handleProfile} sx={{ position: 'fixed', top: '.8rem', left: '.8rem',cursor:'pointer' }} className='accountIcon' />
      )}

      {user && !incognito && location.pathname === "/profile" && (
        <ChatIcon titleAccess='Visit chat' onClick={handleChat} sx={{ position: 'fixed', top: '.8rem', left: '.8rem',cursor:'pointer' }} className='chatIcon' />
      )}
            {user && location.pathname !== "/profile"&& location.pathname !== "/" && window.location.pathname !== "/404" && window.location.pathname !== "/restricted"  &&(
              <button onClick={handleLogout} className="logout-button">
                {LogBut}
              </button>
            )}
           
            <Routes>
              <Route
                path="/"
                element={user ? <Navigate to="/chat" /> : <FirstLand />}
                // element={<FirstLand />}
              />
              <Route
                path="/auth"
                element={user ? <Navigate to="/chat" replace /> : <LoginPage />}
              />
               <Route path="/login" element={<Navigate to="/auth" replace />} />
               <Route path="/register" element={<Navigate to="/auth" replace />} />
               <Route path="/c/*" element={<Navigate to="/chat" replace />} />
            <Route
                path="/chat"
                element={user ? <Chat user={user} /> : <Navigate to="/auth" replace />}
              />
             {/* <Route
            path="/profile"
            element={user ? (!incognito ? <Profile user={user} /> : <Navigate to="/restricted" replace />) : <Navigate to="/auth" replace />} 
          /> */}

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
                // element={user ? <PreviewMsg /> : <Navigate to="/auth" />}
                element={<PreviewMsg />}
              />
              <Route path="*" element={<Navigate to="/404" />} />
              <Route path="/restricted" element={incognito ? <ContentNotAvaiable/> : <Navigate to='/' replace/>} />
              <Route path="/404" element={<ErrorPage />} />
            </Routes>
          </div>
      // {/* </PopUpContext.Provider> */}
    // {/* </ThemeOption> */}
  );
}

export default App;
