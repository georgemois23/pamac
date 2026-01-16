import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ThemeOption from '../ThemeOption';
import AuthContext from "../AuthContext";
import { useTranslation } from 'react-i18next';
import { useMessages } from '../context/MessagesContext';
import { formatDistanceToNowStrict } from 'date-fns';
import { el, enUS } from 'date-fns/locale'; 

import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  IconButton,
  Avatar,
  Stack,
  useTheme,
  Tooltip,
  Divider,
  Link
} from '@mui/material';

// --- NEW IMPORTS FOR HEADER ---
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// ------------------------------

import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LoadingSpinner from '../components/LoadingSpinner';
import Chat from './Chat';

const isMediaUrl = (text) => {
  try {
    const url = new URL(text.trim());
    const ext = url.pathname.toLowerCase();
    return (
      ext.endsWith('.gif') ||
      ext.endsWith('.png') ||
      ext.endsWith('.jpg') ||
      ext.endsWith('.jpeg') ||
      ext.endsWith('.webp')
    );
  } catch {
    return false;
  }
};

const isLink = (text) => {
  if (!text) return false;

  const trimmed = text.trim();

  const urlRegex =
    /^(https?:\/\/)([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

  return urlRegex.test(trimmed);
};




const PreviewThisMsg = React.memo(({ message }) => {
  const [imgError, setImgError] = React.useState(false);

  if (isMediaUrl(message) && !imgError) {
    return (
      <Box sx={{ maxWidth: '100%' }}>
        <Box
          component="img"
          src={message}
          alt="media"
          loading="lazy"
          draggable="false"
          onError={() => setImgError(true)}
          sx={{
            maxWidth: { xs: '100%', sm: 320, md: 360 },
            width: '100%',
            height: 'auto',
            borderRadius: 2,
            objectFit: 'contain',
          }}
        //   onClick={() => window.open(message, '_blank')}
        />
      </Box>
    );
  }

  if (isLink(message)) {
    return (
      <Typography sx={{ fontSize: '0.95rem', wordBreak: 'break-word',fontFamily: 'Inter, sans-serif' }}>
        <Link href={message} target="_blank" rel="noopener noreferrer" underline='none'>
          {message}
        </Link>
      </Typography>
    );
  }

  return (
    <Typography sx={{ fontSize: '0.95rem', wordBreak: 'break-word', fontFamily: 'Inter, sans-serif' }}>
      {message}
    </Typography>
  );
});



function PreviewMsg() {
  const navigate = useNavigate();
  const theme = useTheme(); 
  const [UserExist, setUserExist] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 910);
  const { conversationId } = useParams();
  const { messages, loading, setDeleteThisMessage, setConversationId, participantUsername,participantId  } = useMessages();
  const { t, i18n } = useTranslation();
  
  useEffect(() => {
    if (conversationId) {
        setConversationId(conversationId);
    }
  }, [conversationId, setConversationId]); 

  const containerRef = useRef(null);
  const { user, incognito } = useContext(AuthContext);

  useEffect(() => { document.title = {participantUsername} }, [participantUsername]);

  const handleDelete = (id) => { console.log("Delete function called for:", id); };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 910);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (user) setUserExist(true);
    if (!user && UserExist) navigate('/auth');
  }, [user, UserExist, navigate]);

  const handleGoBack = () => { navigate('/chat'); document.title = 'Chat'; };

  // --- Scroll Logic ---
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
        setVisible(Math.abs(container.scrollTop) > 200); 
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = () => { 
      containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      setIsHovered(false); 
  };

  const getInitials = (name) => name ? name.charAt(0).toUpperCase() : '?';
  const stringToColor = (string) => {
      let hash = 0;
      for (let i = 0; i < string.length; i++) hash = string.charCodeAt(i) + ((hash << 5) - hash);
      let color = '#';
      for (let i = 0; i < 3; i++) color += `00${((hash >> (i * 8)) & 0xff).toString(16)}`.slice(-2);
      return color;
  }

  if (loading || !participantUsername) return <LoadingSpinner />;

  const reversedMessages = [...messages].reverse();


  return (
    // MAIN APP LAYOUT (Flex Column)
    <Box sx={{ 
        height: '100dvh', 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        // bgcolor: 'background.default',
        // zIndex: 
        
    }}>
      
      {/* --- NEW INSTAGRAM STYLE HEADER --- */}
      <Box sx={{ 
          height: '60px', 
          width: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          px: 2, 
          borderBottom: '3px solid', 
          borderColor: 'divider',
        //   bgcolor: 'background.default',
        backdropFilter: 'blur(30px)',
          flexShrink: 0, // Prevents header from collapsing
          zIndex: 10
      }}>
          {/* Left Side: Back Arrow + Avatar + Name */}
          <Stack direction="row" alignItems="center" spacing={1.5}>
              <IconButton onClick={handleGoBack} sx={{ p: 0.5 }}>
                  <ArrowBackIcon />
              </IconButton>
              
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ cursor: 'pointer' }}>
                  {/* Generic Avatar for the "Bot/AI" */}
                  <Avatar sx={{ bgcolor: stringToColor(participantUsername || 'U'), width: 32, height: 32, fontSize: '0.9rem' }} onClick={() => {navigate(`/profile/${participantId}`)}}>
                    {participantUsername ? participantUsername.charAt(0).toUpperCase() : 'A'}
                  </Avatar>
                  <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1 }} onClick={() => {navigate(`/profile/${participantId}`)}}>
                          {participantUsername}
                      </Typography>
                      {/* <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1 }}>
                          Active now
                      </Typography> */}
                  </Box>
              </Stack>
          </Stack>

          {/* Right Side: Theme Option + Info Icon */}
          {/* <Stack direction="row" alignItems="center" spacing={1}>
              <ThemeOption /> 
              <IconButton>
                  <InfoOutlinedIcon />
              </IconButton>
          </Stack> */}
      </Box>

      {/* Floating Scroll Button */}
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={scrollToBottom}
        sx={{
          position: 'fixed', bottom: '6rem', right: '1.5rem', cursor: 'pointer', zIndex: 1200,
          opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none', transition: 'all 0.3s ease',
          transform: visible ? 'scale(1)' : 'scale(0.8)',
          bgcolor: 'background.paper', borderRadius: '50%', boxShadow: 4, width: 45, height: 45, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
      >
        <ArrowCircleRightRoundedIcon sx={{ transform: 'rotate(90deg)', fontSize: 30, color: 'primary.main' }} />
      </Box>

      {/* --- SCROLLABLE MESSAGE AREA --- */}
      <Box 
        ref={containerRef}
        sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column-reverse', 
            overflowY: 'auto',              
            pl: { xs: 0.5, sm: 1 },
            pr: { xs: 0.5, sm: 1 },
            pt: 2, 
            pb: 2,
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '10px' },
            '&:hover::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.2)' }
        }}
      >
        
        <Container sx={{ display: 'flex', flexDirection: 'column-reverse', padding: '0 !important',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 400
         }}>
            
            {/* MESSAGES MAPPING */}
            {messages.length > 0 ? (
                reversedMessages.map((msg, index) => {
                    const isOwnMessage = user?.id === msg.user.id;
                    const isAdmin = user?.role === 'admin';
                    const displayName = msg.name !== '' ? msg.user.username : t("anonymous");

                    const prevMsg = reversedMessages[index + 1]; 
                    const nextMsg = reversedMessages[index - 1];
                    const isFirstInSequence = !prevMsg || prevMsg.user.id !== msg.user.id;
                    const isLastInSequence = !nextMsg || nextMsg.user.id !== msg.user.id;

                    const marginBottom = isFirstInSequence ? 2.5 : 0.25; 

                    let borderRadius;
                    if (isOwnMessage) {
                        if (isFirstInSequence && isLastInSequence) borderRadius = '20px 20px 4px 20px';
                        else if (isFirstInSequence) borderRadius = '20px 20px 4px 20px'; 
                        else if (isLastInSequence) borderRadius = '20px 4px 4px 20px';  
                        else borderRadius = '20px 4px 4px 20px';
                    } else {
                        if (isFirstInSequence && isLastInSequence) borderRadius = '20px 20px 20px 4px';
                        else if (isFirstInSequence) borderRadius = '20px 20px 20px 4px'; 
                        else if (isLastInSequence) borderRadius = '4px 20px 20px 4px';  
                        else borderRadius = '4px 20px 20px 4px';
                    }

                    const AvatarOrPlaceholder = (
                        (isLastInSequence && !isOwnMessage) ? (
                            <Tooltip title={displayName}>
                                <Avatar 
                                    onClick={() => navigate(`/profile/${msg.user.id}`)}
                                    sx={{ 
                                        cursor: 'pointer', width: 34, height: 34, fontSize: '0.9rem', 
                                        bgcolor: isOwnMessage ? 'primary.main' : stringToColor(displayName),
                                        boxShadow: 2, mb: 0 
                                    }}
                                >
                                    {getInitials(displayName)}
                                </Avatar>
                            </Tooltip>
                        ) : ( <Box sx={{ width: 34 }} /> )
                    );
                    

                    return (
                        <Box key={msg.id || index} sx={{ display: 'flex', width: '100%', justifyContent: isOwnMessage ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 1.5, mt: marginBottom }}>
                            {!isOwnMessage && AvatarOrPlaceholder}

                            <Paper 
                                elevation={0} 
                                sx={{ 
                                    p: '10px 16px', width: 'fit-content', maxWidth: { xs: '75%', sm: '75%', md: '60%' }, 
                                    bgcolor: isOwnMessage ? (theme.palette.mode === 'dark' ? '#1e88e5' : '#0084ff') : (theme.palette.mode === 'dark' ? '#333' : '#e4e6eb'),   
                                    color: isOwnMessage ? '#fff' : (theme.palette.mode === 'dark' ? '#fff' : '#050505'),
                                    borderRadius: borderRadius, wordBreak: 'break-word', position: 'relative', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' 
                                }}
                            >
                                {!isOwnMessage && isFirstInSequence && (
                                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold', opacity: 0.6, mb: 0.5, fontSize: '0.75rem', ml: 0.5 }}>{displayName}</Typography>
                                )}
                                {/* <Typography variant="body1" sx={{ fontSize: '0.95rem', lineHeight: 1.4 }}>{msg.content}</Typography> */}
                                <PreviewThisMsg message={msg.content} />
                                {/* {((isOwnMessage || isAdmin) && !incognito) && (
                                    <Box className="delete-overlay" sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: borderRadius, bgcolor: 'rgba(0,0,0,0.4)', opacity: 0, transition: 'opacity 0.2s', '&:hover': { opacity: 1 }, cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); setDeleteThisMessage(msg.id); }}>
                                            <DeleteForeverIcon sx={{ color: '#fff' }} />
                                    </Box>
                                )} */}
                            </Paper>
                        </Box>
                    );
                })
            ) : (
                <Box sx={{ textAlign: 'center', mb: 'auto', mb: '30vh', opacity: 0.4 }}> 
                    <ChatBubbleOutlineIcon sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h6">{'Start the conversation'}</Typography>
                </Box>
            )}
            
            {/* --- OLD HEADER REMOVED FROM HERE --- */}

        </Container>
      </Box>

      {/* --- CHAT FOOTER --- */}
      <Box sx={{ flexShrink: 0, }}>
        <Chat />
      </Box>

    </Box>
  );
}

export default PreviewMsg;