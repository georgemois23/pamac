import '../App.css';
import React, { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeOption from '../ThemeOption';
import SendIcon from '@mui/icons-material/Send';
import { Button, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMessages,MessagesProvider } from '../context/MessagesContext';
function Chat({user }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
const { messages, sendMessage } = useMessages();
  // localStorage.setItem("name",name);
  window.history.pushState(null, "", "/chat");
  document.title='Chat';
  const handleMessageChange = (event) => {
     const input = event.target.value;

  // Allow English, Greek, numbers, and spaces
  const allowedPattern = /^[\p{Script=Greek}\p{Script=Latin}\P{Letter}]*$/u;

  if (allowedPattern.test(input)) {
    setMessage(input); 
  }

  // Enable button if input has text, disable if empty
  const button = document.querySelector('.sub-but');
  if (input.trim().length > 0) {
    button.removeAttribute("disabled");
  } else {
    button.setAttribute("disabled", true);
  }
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
      sendMessage(message);
      setMessage('');
      // Add the new message with name to the array
      // const newMessage = { name: !user.username ? '' : user.username, text: message, time:currentTime  };
      // const updatedMessages = [...storedMessages, newMessage];
      // Save the updated messages to sessionStorage
      // localStorage.setItem('messages', JSON.stringify(updatedMessages));
      // Notify the parent component of the new message
      // onMessage(newMessage);
      // Navigate to the preview messages page
      navigate('/messages');
      document.title = t("messages");
      setMessage('');
    }
  };

  return (
    // <div className='Chat'>
    <Container sx={{display:'flex', gap:'2rem',flexDirection:'column',userSelect:'none',}}>
       {/* <Logout handleLogout={handleLogout} logmsg={!name ? 'Login' : 'Logout'}/> */}
      <ThemeOption/>
      <Typography variant='h3' sx={{fontWeight:"bold"}}>{t('welcome')} {!user.username ? t("anonymous_user") : (user.full_name ? user.full_name.split(' ')[0] : user.username)}!</Typography>
      <form spellCheck={false} onSubmit={handleSend}>
        <textarea
          id='text'
          value={message}
          spellCheck="false"
          onChange={handleMessageChange}
          placeholder={!user.username ? t("anonymous_message") : t("user_message")}
          maxLength={350}
        />
        <button  disabled={(!message) || message.trim().length<=0}  className='sub-but' type='submit' title={message.trim().length<=0 ? t("blank_message") : t("send_message")}>{t("send")}</button>
         </form>
    {/* // </div> */}
    </Container>
  );
}

export default Chat;
