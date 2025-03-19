import './App.css';
import './Msg.css';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeOption from './ThemeOption';
import AuthContext from "./AuthContext"; // Import the context
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';

function PreviewMsg() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);

  document.title='Messages';


  useEffect(() => {
    // Function to update messages when storage changes
    const handleStorageChange = (event) => {
      if (event.key === 'messages') {
        setMessages(JSON.parse(event.newValue) || []);
      }
    };
  
    // Retrieve messages from localStorage when component mounts
    setMessages(JSON.parse(localStorage.getItem('messages')) || []);
  
    // Listen for changes in localStorage
    window.addEventListener('storage', handleStorageChange);
  
    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleGoBack = () => {
    navigate('/chat');
    document.title='Chat';
  };

  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    console.log("useEffect mounted"); // This logs ✅

    const toggleVisible = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        console.log("Scroll event fired! ScrollTop:", scrollTop); // Should log when scrolling
        setVisible(scrollTop > 200);
    };

    // Attach listener
    window.addEventListener("scroll", toggleVisible);

    // Manual scroll trigger test
    setTimeout(() => {
        window.dispatchEvent(new Event("scroll"));
    }, 1000);

    // Cleanup
    return () => {
        window.removeEventListener("scroll", toggleVisible);
    };
}, []);




const scrollToTop = () => {
  window.scrollTo({
      top: 0,
      behavior: "smooth"
  });
};




  return (
    <div className="Preview">
    {/* <ArrowCircleUpIcon 
  onClick={scrollToTop}
  sx={{ 
    opacity: visible ? 1 : 0, 
    transition: "opacity 0.4s ease-in-out",
    pointerEvents: visible ? 'auto' : 'none',
    position: 'fixed', 
    bottom: ".8rem", 
    right: '.8rem', 
    cursor: "pointer", 
    fontSize: 30, 
    color: "#1976d2", 
    zIndex: 1000,
    '&:hover': {
      transform: 'scale(1.05)',
    } 
  }} 
/> */}
<div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={scrollToTop}
      style={{
        position: 'fixed',
        bottom: '.8rem',
        right: '.8rem',
        cursor: 'pointer',
        zIndex: 1000,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.4s ease-in-out',
      }}
    >
      {isHovered ? (
        <ArrowCircleRightRoundedIcon
          sx={{
            transform: 'rotate(-90deg)', // Rotate left
            transition: 'transform 0.3s ease-in-out',
            fontSize: 30,
            color: '#1976d2',
          }}
        />
      ) : (
        <ArrowCircleUpIcon
          sx={{
            transition: 'transform 0.3s ease-in-out',
            fontSize: 30,
            color: '#1976d2',
          }}
        />
      )}
    </div>

      <ThemeOption/>
      <div className='nav-msg'></div>
      <div className="header">
        <h1>Messages </h1>
      </div>
      <div className="message-list">
        {messages.length > 0 ? (
          messages.toReversed().map((msg, index) => (
            <div key={index} className="message-item">
              {/* <div className='name-msg'> {(msg.name!=='') ? (msg.name+' wrote:') : 'anonymous user'}</div> */}
              <div className='name-msg'> 
  {(msg.name !== '') ? (
    <span>
      <span className='wrote-italic'>{msg.name}</span> wrote:
    </span>
  ) : 'anonymous user'}
  
</div>
              <h2>
                {/* {msg.name} */}
                {msg.text}
              </h2>
              <span className='msg-time'>{msg.time}</span>
            </div>
          ))
        ) : (
          <h2>No messages found.</h2>
        )}
      </div>
      <button className="gobackk" onClick={handleGoBack}>Back to chat</button>
      <br />
      <div className="backg"></div>
    </div>
  );
}

export default PreviewMsg;
