import './App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Chat({ name, onMessage }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [user, setUser] = useState('');
  // if(name===''){
  //   // setUser('anonymous');
  // }
  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };



  const handlename = () => {
    
  };
  const handleSend = (event) => {
    event.preventDefault();
    if (message.trim()) {
      // Get existing messages from sessionStorage
      const storedMessages = JSON.parse(sessionStorage.getItem('messages')) || [];
      // Add the new message to the array
      const updatedMessages = [...storedMessages, message];
      // Save the updated messages to sessionStorage
      sessionStorage.setItem('messages', JSON.stringify(updatedMessages));
      // Notify the parent component of the new message
      onMessage(message);
      // Navigate to the preview messages page with the new message
      navigate('/messages');
      setMessage('');
    }
  };

  return (
    <div className='Chat'>
      <h1 className='namee'>Hello {name==='' ? 'anonymous user' : name}!</h1>
      <form onSubmit={handleSend}>
        <textarea
          id='text'
          value={message}
          onChange={handleMessageChange}
          placeholder={(name==='') ? 'Type your anonymous message...' :
          'Type your message...'}
          
          maxLength={350}
        />
        <button className='sub-but' type='submit'>Send</button>
      </form>
    </div>
  );
}

export default Chat;
