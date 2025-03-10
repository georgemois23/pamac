import './App.css';
import './Msg.css';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeOption from './ThemeOption';
import AuthContext from "./AuthContext"; // Import the context

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

  return (
    <div className="Preview">
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
