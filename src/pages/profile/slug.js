import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../../AuthContext';
import { useSnackbar } from '../../context/SnackbarContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ForumIcon from '@mui/icons-material/Forum';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';
import '../../App.css';
import '../../Msg.css';

const UserProfile = () => {
    const { id } = useParams(); // or rename to { slug } depending on your route
    const [messages, setMessages] = useState([]);
    const { user } = useContext(AuthContext);
    const API_URL = process.env.REACT_APP_API_URL;
    const { showSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

  const handleMessages = () => {
    navigate('/messages');
  };

    
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


  useEffect(() => {
    const fetchUserMessages = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/messages/user/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accessToken}`,
          },
        });

        if (!res.ok) {
          showSnackbar({ message: 'Failed to fetch user messages', severity: 'error' });
          setMessages([]);
          setLoading(false);
          return;
        }

        const data = await res.json();
        setMessages(data); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user messages:', error);
        showSnackbar({ message: 'An error occurred', severity: 'error' });
        setMessages([]);
        setLoading(false);
      }
    };

    fetchUserMessages();
  }, [id, user, API_URL, showSnackbar]);

    useEffect(() => {
  
      const toggleVisible = () => {
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          // console.log("Scroll event fired! ScrollTop:", scrollTop); // Should log when scrolling
          setVisible(scrollTop > 200);
      };
  
      window.addEventListener("scroll", toggleVisible);
  
      setTimeout(() => {
          window.dispatchEvent(new Event("scroll"));
      }, 1000);
  
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

  const username = messages[0]?.user?.username || id;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="Preview">
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
         <ForumIcon titleAccess={t('view_messages')} onClick={handleMessages} sx={{ position: 'fixed',top:'1rem', left: '.6rem',cursor:'pointer', backgroundColor:'transparent' }} className='chatIcon' /> 
         <div style={{marginTop:'2rem'}}>
      <div className="header" >
        <Typography variant='h2' sx={{fontWeight:'bold',userSelect:'none'}}>{t('messages')} of {username} </Typography>
      </div>
      <div className="message-list">
        {messages.length > 0 ? (
          messages.toReversed().map((msg, index) => (
            <div key={index} className="message-item">
              {/* <div className='name-msg'> {(msg.name!=='') ? (msg.name+' wrote:') : 'anonymous user'}</div> */}
              <div className='name-msg' style={{ userSelect: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
  
  
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

     
    </div>
    </div>
  );
};

export default UserProfile;
