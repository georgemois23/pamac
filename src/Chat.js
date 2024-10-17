import './App.css';
import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeOption from './ThemeOption';
import Logout from './Logout';
import { GlobalContext } from './GlobalContext';
function Chat({ name, onMessage }) {

  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  localStorage.setItem("name",name);
  

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSend = (event) => {
    event.preventDefault();
    if (message.trim()) {
      // Get existing messages from sessionStorage
      const storedMessages = JSON.parse(sessionStorage.getItem('messages')) || [];
      // Add the new message with name to the array
      const newMessage = { name: !name ? '' : name, text: message };
      const updatedMessages = [...storedMessages, newMessage];
      // Save the updated messages to sessionStorage
      sessionStorage.setItem('messages', JSON.stringify(updatedMessages));
      // Notify the parent component of the new message
      onMessage(newMessage);
      // Navigate to the preview messages page
      navigate('/messages');
      document.title='Messages';
      setMessage('');
    }
  };

  return (
    <div className='Chat'>
      {/* <Logout handleLogout={handleLogout} logmsg={!name ? 'Login' : 'Logout'}/> */}
      <ThemeOption/>
      <h1 className='namee'>Hello {!name ? '[anonymous] user' : name}!</h1>
      <form onSubmit={handleSend}>
        <textarea
          id='text'
          value={message}
          onChange={handleMessageChange}
          placeholder={!name ? 'Type your anonymous message...' : 'Type your message...'}
          maxLength={350}
        />
        <button className='sub-but' type='submit'>Send</button>
      </form>
    </div>
  );
}

export default Chat;
