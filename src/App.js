import './App.css';
import React, { useState, useEffect,createContext, useContext } from 'react';
import FirstLand from './Firstland';
import LoginPage from './LoginPage';
import Chat from './Chat';
import PreviewMsg from './PreviewMsg';
import { BrowserRouter as Router, Routes, Route, Navigate,useLocation } from 'react-router-dom';
import ThemeOption from './ThemeOption';
import ErrorPage from './ErrorPage';
import PopUps from './PopUps';
import DrawerComponent from './DrawerComponent';
import axios from 'axios';

const PopUpContext = createContext();
export const usePopUp = () => useContext(PopUpContext);
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [logout, setLogout] = useState(false);
  const [wasLoggedin, setWasLoggedIn] = useState(false);
  // const [enter, setEnter] = useState(false);
  const [enter, setEnter] = useState(localStorage.getItem('enter') === 'true');
  const [logoutbutton, setLogoutbutton] = useState('Logout');
  // const location = useLocation();
  
  
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
    const storedEnter = localStorage.getItem('enter') === 'true'; // Convert string to boolean
    const storedLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // Convert string to boolean
    const storedTheme = localStorage.getItem('theme') || 'original';
    const storedLogoutButton = localStorage.getItem('LogoutButton');



    if (storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setLogoutbutton(storedLogoutButton);
    }
    setLogoutbutton(storedLogoutButton);
    if(storedLoggedIn){
      setIsLoggedIn(true);}
    setMessages(storedMessages); // Retrieve messages regardless of login status
    setEnter(storedEnter); // Set 'enter' state based on stored value
    // setTheme(storedTheme); // Set theme from localStorage

    document.body.setAttribute('data-theme', storedTheme); 

    // Clear username when the session closes
    const handleBeforeUnload = () => {
      // localStorage.removeItem('username');
      // localStorage.removeItem('enter');  
      window.location.reload();                         
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
    setEnter(true);
    localStorage.setItem('isLoggedIn','true');
    if (username === '') {
      setUsername(null);
      setLogoutbutton('Login');
      localStorage.setItem('LogoutButton','Login');
    } else {
      setUsername(username);
      setLogoutbutton('Logout');
      localStorage.setItem('LogoutButton','Logout');
      localStorage.setItem('username', username);
    }
  };

  
  const handleLogout = () => {
    console.log("Logout button clicked, is loggedin:",isLoggedIn);
    
    {isLoggedIn ? setWasLoggedIn(true) : setWasLoggedIn(false)}
    setIsLoggedIn(false);
    localStorage.setItem('isLoggedIn','false');
    setLogout(true);
    setUsername('');
    // setEnter(false);
    console.log()
    // localStorage.setItem('enter', 'false');
    localStorage.removeItem('username');
    document.title='Login';
    window.location.reload(); 
  };


  const handleEnter = () => {
    // alert('Enter');
    setEnter(true);
    localStorage.setItem('enter', 'true'); // Save 'enter' state as string in localStorage
    document.title='Login';
  };

  const [popUpMessage, setPopUpMessage] = useState('');
  const [isPopUpVisible, setIsPopUpVisible] = useState(false);
  const showPopUp = (message) => {
    setPopUpMessage(message);
    setIsPopUpVisible(true);
  };

  // Function to hide the pop-up
  const hidePopUp = () => {
    setIsPopUpVisible(false);
    setPopUpMessage('');
  };

  // const [theme, setTheme] = useState('original');
  // const handleThemeToggle = () => {
  //   const newTheme = (theme === 'purple') ? 'original' : 'purple';
  //   setTheme(newTheme);
  //   localStorage.setItem('theme', newTheme);
  //   document.body.setAttribute('data-theme', newTheme); // Apply the new theme
  // };

  const handleMessage = (message) => {
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem('messages', JSON.stringify(updatedMessages)); // Save messages to local storage
  };


  
  return (
    
    <ThemeOption>
      {/* <DrawerComponent/> */}
    <PopUpContext.Provider value={showPopUp}>
    <Router>
      <div className="App">
        {/* <h1>LoggedIn:{isLoggedIn.toString()}</h1>
        <h2>Enter:{enter.toString()}</h2> */}
        {/* {enter && <ThemeOption theme={theme} toggleTheme={handleThemeToggle} />} */}
        {isLoggedIn && (
          <button onClick={handleLogout} className="logout-button">
            {logoutbutton}
          </button>
        )}
        
        <Routes>
          <Route
            path="/"
            element={(enter) ? <Navigate to="/chat" /> : <FirstLand OnEnter={handleEnter} />}
            // element={<FirstLand OnEnter={handleEnter} />}
          />
          <Route
            path="/login"
            element={(enter && isLoggedIn) ? <Navigate to="/chat" /> : ( enter ? <LoginPage onLogin={handleLogin}  /> : <FirstLand OnEnter={handleEnter}/>)}
            // element={(isLoggedIn) ? <Navigate to="/chat" /> : <LoginPage onLogin={handleLogin} />}
          />
          <Route
            path="/chat"
            element={isLoggedIn ? <Chat name={username} onMessage={handleMessage} /> : <Navigate to="/login" />}
          />
          <Route
            path="/messages"
            // element={isLoggedIn ? <PreviewMsg messages={messages} /> : <Navigate to="/login" />}
            element={enter&&isLoggedIn ? <PreviewMsg messages={messages} /> : <Navigate to="/login" />}
          />
          {/* <Route path="*" element={<Navigate to={isLoggedIn ? "/chat" : "/login"} />} /> */}
          <Route path="*" element={<Navigate to="/404" />} />
          <Route path="/404" element={<ErrorPage />} />
        </Routes>
      </div> 
      {isPopUpVisible && (
          <PopUps message={popUpMessage} onClose={hidePopUp} />
        )}
    </Router>
    </PopUpContext.Provider>
    </ThemeOption>
  );
}

export default App;
