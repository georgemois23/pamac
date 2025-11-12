import '../App.css';
import '../Msg.css';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeOption from '../ThemeOption';
import AuthContext from "../AuthContext"; // Import the context
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';
import { Container, Typography } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useTranslation } from 'react-i18next';
import { useMessages } from '../context/MessagesContext';
import LoadingSpinner from '../components/LoadingSpinner';
import CodeIcon from '@mui/icons-material/Code';

function PreviewMsg() {
  const navigate = useNavigate();
  // const [messages, setMessages] = useState([]);
  const [UserExist, setUserExist] = useState(false);
   const [isMobile, setIsMobile] = useState(window.innerWidth < 910);
   const {messages, loading, setDeleteThisMessage} = useMessages();
  const { t,i18n } = useTranslation();
  document.title=t("messages");
const {user, incognito} = useContext(AuthContext);

  const handleDelete = () => {
    console.log("Delete function called");
  };

useEffect(() => {
    console.log("App: ",i18n.language)
    const handleResize = () => setIsMobile(window.innerWidth < 910);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


useEffect(() => {
  if(user){
    setUserExist(true);
  }
  if(!user && UserExist){
    navigate('/auth');
  }
}, [user]);

  useEffect(() => {
    // Function to update messages when storage changes
    const handleStorageChange = (event) => {
      if (event.key === 'messages') {
        // setMessages(JSON.parse(event.newValue) || []);
      }
    };
  
    // Retrieve messages from localStorage when component mounts
    // setMessages(JSON.parse(localStorage.getItem('messages')) || []);
  
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
  console.log("Messages in PreviewMsg:", messages);
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    console.log("useEffect mounted"); // This logs ✅

    const toggleVisible = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        // console.log("Scroll event fired! ScrollTop:", scrollTop); // Should log when scrolling
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

 const showDate = (dateString) => {
  const options = { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  };
  return new Date(dateString).toLocaleString('en-GB', options);
};




const scrollToTop = () => {
  window.scrollTo({
      top: 0,
      behavior: "smooth"
  });
};

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="Preview">
      <ChatBubbleOutlineIcon titleAccess={user ? t("back_to_chat") : t("join_chat")} onClick={handleGoBack} sx={{ position: 'fixed', bottom: '.8rem', left: '.8rem',cursor:'pointer', backgroundColor:'transparent' }} className='chatIcon' />
  
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
        backgroundColor: 'transparent',
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
      {/* <div className='nav-msg'></div> */}
      <div className="header">
        <Typography variant='h2' sx={{fontWeight:'bold',userSelect:'none'}}>{t('messages')} </Typography>
      </div>
      <div className="message-list">
        {messages.length > 0 ? (
          messages.toReversed().map((msg, index) => (
            <div key={index} className="message-item">
              {/* <div className='name-msg'> {(msg.name!=='') ? (msg.name+' wrote:') : 'anonymous user'}</div> */}
              <div className='name-msg' style={{ userSelect: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  <span style={{ flex: 1, textAlign: 'center' }}>
    {(msg.name !== '') ? (
      <>
        {i18n.language === 'el' ? 'Ο χρήστης ' : ''}
        <span className='wrote-italic' onClick={() => {
        // handleGoToProfile(msg.user.id);
        // setGoToProfile(msg.user.id);
        navigate(`/profile/${msg.user.id}`);
      }}
        
        // >{msg.user.role === 'admin' && <CodeIcon style={{ verticalAlign: "-6px", paddingRight:'4px' }} aria-label="Profile icon" />}
        >{msg.user.username}</span> {t("wrote")}:
      </>
    ) : t("anonymous")}
  </span>

  {((user?.id === msg.user.id || user?.role=== 'admin') && !incognito ) && (
    user.role === 'admin' ? (
    <DeleteForeverIcon
    onClick={() => {
        handleDelete(msg.id);
        setDeleteThisMessage(msg.id);
      }}
      sx={{ cursor: 'pointer', fontSize: { xs: '1rem', sm: '1.5rem' } }}
    />)
    :
    <DeleteIcon
      onClick={() => {
        handleDelete(msg.id);
        setDeleteThisMessage(msg.id);
      }}
      sx={{ cursor: 'pointer', fontSize: { xs: '1rem', sm: '1.5rem' } }}
    />
  )}
</div>

              <h2>
                
                {msg.content}
              </h2>
              <span className='msg-time' style={{userSelect:'none'}}>{showDate(msg.createdAt)}</span>
            </div>
          ))
        ) : 
        !loading ?(
          <h2>{t("no_messages_found")}</h2>
        )
         : null}
      </div>
      {!isMobile && <button className="gobackk" onClick={handleGoBack}>{user ? t("back_to_chat") : t("join_chat")}</button>}
      <br />
      <div className="backg"></div>
    </div>
  );
}

export default PreviewMsg;
