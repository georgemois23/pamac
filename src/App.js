import './App.css';
import React, { useContext,useState,useEffect } from 'react';
import FirstLand from './Firstland';
import LoginPage from './LoginPage';
import Chat from './Chat';
import PreviewMsg from './PreviewMsg';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import ThemeOption from './ThemeOption';
import ErrorPage from './ErrorPage';
import PopUps from './PopUps';
import AuthContext from "./AuthContext"; // Import the context
import CircularProgress from '@mui/material/CircularProgress';
// const PopUpContext = createContext();
// export const usePopUp = () => useContext(PopUpContext);

function App() {
  const { user, token, login, logout, isLoading,loginMessage  } = useContext(AuthContext); // Use the context here
  const LogButton = localStorage.getItem('Button');
  const [themeLoaded, setThemeLoaded] = useState(false);

useEffect(() => {
  const theme = localStorage.getItem("theme") || "original";
  document.body.setAttribute("data-theme", theme);
  setThemeLoaded(true);
}, []);
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
        <Router>
          <div className="App">
            {user && (
              <button onClick={handleLogout} className="logout-button">
                {LogButton}
              </button>
            )}
            <Routes>
              <Route
                path="/"
                element={user ? <Navigate to="/chat" /> : <FirstLand />}
              />
              <Route
                path="/login"
                element={user ? <Navigate to="/chat" replace /> : <LoginPage />}
              />
              <Route
                path="/chat"
                element={user ? <Chat name={user.username} /> : <Navigate to="/login" replace />}
              />
              <Route
                path="/messages"
                element={user ? <PreviewMsg /> : <Navigate to="/login" />}
              />
              <Route path="*" element={<Navigate to="/404" />} />
              <Route path="/404" element={<ErrorPage />} />
            </Routes>
          </div>
        </Router>
      // {/* </PopUpContext.Provider> */}
    // {/* </ThemeOption> */}
  );
}

export default App;
