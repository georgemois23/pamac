import './App.css';
import './Msg.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PreviewMsg() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Retrieve messages from sessionStorage
    const storedMessages = JSON.parse(sessionStorage.getItem('messages')) || [];
    setMessages(storedMessages);
  }, []);

  const handleGoBack = () => {
    navigate('/chat');
  };

  return (
    <div className="Preview">
      <div className="header">
        <h1>Messages </h1>
      </div>
      <div className="message-list">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className="message-item">
              <div className='name-msg'> {(msg.name!=='') ? (msg.name+' wrote:') : 'anonymous user'}</div>
              <h2>
                {msg.name}
                {msg.text}
              </h2>
            </div>
          ))
        ) : (
          <h2>No messages found.</h2>
        )}
      </div>
      <button className="gobackk" onClick={handleGoBack}>Go to chat</button>
      <br />
      <div className="backg"></div>
    </div>
  );
}

export default PreviewMsg;
