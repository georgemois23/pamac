import './App.css';
import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeOption from './ThemeOption';
import SendIcon from '@mui/icons-material/Send';
import { Button, Container, Typography } from '@mui/material';
function Chat({user }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  // localStorage.setItem("name",name);
    
  document.title='Chat';
  const handleMessageChange = (event) => {
    if(event.target.value.length<=0) 
      document.querySelector('.sub-but').setAttribute("disabled", true); 
    setMessage(event.target.value);
  };

  const handleSend = (event) => {
    event.preventDefault();
    if (message.trim()) {
      // Get existing messages from sessionStorage
      const storedMessages = JSON.parse(localStorage.getItem('messages')) || [];
      const currentTime = new Intl.DateTimeFormat('en-GB', { 
        dateStyle: 'short', 
        timeStyle: 'short' 
      }).format(new Date());
      // Add the new message with name to the array
      const newMessage = { name: !user.username ? '' : user.username, text: message, time:currentTime  };
      const updatedMessages = [...storedMessages, newMessage];
      // Save the updated messages to sessionStorage
      localStorage.setItem('messages', JSON.stringify(updatedMessages));
      // Notify the parent component of the new message
      // onMessage(newMessage);
      // Navigate to the preview messages page
      navigate('/messages');
      document.title='Messages';
      setMessage('');
    }
  };

  return (
    // <div className='Chat'>
    <Container sx={{display:'flex', gap:'2rem',flexDirection:'column'}}>
       {/* <Logout handleLogout={handleLogout} logmsg={!name ? 'Login' : 'Logout'}/> */}
      <ThemeOption/>
      <Typography variant='h3' sx={{fontWeight:"bold"}}>Hello {!user.username ? '[anonymous] user' : user.username}!</Typography>
      <form spellCheck={false} onSubmit={handleSend}>
        <textarea
          id='text'
          value={message}
          spellCheck="false"
          onChange={handleMessageChange}
          placeholder={!user.username ? 'Type your anonymous message...' : 'Type your message...'}
          maxLength={350}
        />
        <button  disabled={(!message) || message.trim().length<=0}  className='sub-but' type='submit'>Send</button>
      </form>
    {/* // </div> */}
    </Container>
  );
}

export default Chat;
