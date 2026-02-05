import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ThemeOption from '../ThemeOption';
import AuthContext from "../AuthContext";
import { useTranslation } from 'react-i18next';
import { useMessages } from '../context/MessagesContext';
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
  Link,
  Drawer
} from '@mui/material';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LoadingSpinner from '../components/LoadingSpinner';

// Custom Components
import Chat from './Chat';
import ConversationSearch from '../components/ConversationSearch';
import errorSvg from '../assets/nochatt.svg';

// --- HELPER FUNCTIONS ---
const isMediaUrl = (text) => {
  try {
    const url = new URL(text.trim());
    const ext = url.pathname.toLowerCase();
    return (['.gif', '.png', '.jpg', '.jpeg', '.webp'].some(e => ext.endsWith(e)));
  } catch { return false; }
};

const isLink = (text) => {
  if (!text) return false;
  const urlRegex = /^(https?:\/\/)([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;
  return urlRegex.test(text.trim());
};

const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) hash = string.charCodeAt(i) + ((hash << 5) - hash);
  let color = '#';
  for (let i = 0; i < 3; i++) color += `00${((hash >> (i * 8)) & 0xff).toString(16)}`.slice(-2);
  return color;
};

const getInitials = (name) => name ? name.charAt(0).toUpperCase() : '?';

// --- TYPING INDICATOR COMPONENT ---
const TypingIndicator = ({ username, color }) => {
  const bounceKeyframes = { '0%, 80%, 100%': { transform: 'translateY(0)' }, '40%': { transform: 'translateY(-5px)' } };
  const dotStyle = (delay) => ({
    width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor', mr: 0.5,
    animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: delay,
    '@keyframes bounce': bounceKeyframes,
  });

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, mb: 2, mt: 1 }}>
      <Avatar sx={{ bgcolor: color, width: 34, height: 34, fontSize: '0.9rem' }}>{username?.charAt(0).toUpperCase()}</Avatar>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ fontWeight: 'bold', opacity: 0.6, mb: 0.5, ml: 0.5 }}>{username}</Typography>
        <Paper elevation={0} sx={{ p: '10px 16px', bgcolor: 'action.hover', borderRadius: '20px 20px 20px 4px', display: 'flex', alignItems: 'center', height: '35px' }}>
          <Box sx={dotStyle('-0.32s')} /><Box sx={dotStyle('-0.16s')} /><Box sx={dotStyle('0s')} />
        </Paper>
      </Box>
    </Box>
  );
};

// --- MESSAGE CONTENT PREVIEWER ---
const PreviewThisMsg = React.memo(({ message }) => {
  const [imgError, setImgError] = React.useState(false);
  if (isMediaUrl(message) && !imgError) {
    return (
      <Box component="img" src={message} loading="lazy" onError={() => setImgError(true)}
        sx={{ maxWidth: '100%', width: { xs: '100%', sm: 320 }, height: 'auto', borderRadius: 2, objectFit: 'contain' }} />
    );
  }
  if (isLink(message)) {
    return <Link href={message} target="_blank" rel="noopener noreferrer" underline='none'>{message}</Link>;
  }
  return <Typography sx={{ fontSize: '0.95rem', wordBreak: 'break-word', fontFamily: 'Inter, sans-serif' }}>{message}</Typography>;
});

// --- MAIN PREVIEW COMPONENT ---
function PreviewMsg() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { conversationId } = useParams();
  const { user } = useContext(AuthContext);
  const containerRef = useRef(null);
  
  const { messages, loading, setConversationId, participantUsername, participantId, error, typingUsers } = useMessages();
  const { t } = useTranslation();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 910);
  const [visible, setVisible] = useState(false);

  useEffect(() => { if (conversationId) setConversationId(conversationId); }, [conversationId, setConversationId]);
  useEffect(() => { document.title = participantUsername ? `${participantUsername} • Inbox` : 'Inbox' }, [participantUsername]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 910);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
  const body = document.body;
  const html = document.documentElement;

  const prevBodyOverflow = body.style.overflow;
  const prevBodyHeight = body.style.height;
  const prevHtmlOverflow = html.style.overflow;
  const prevHtmlHeight = html.style.height;

  body.style.overflow = "hidden";
  body.style.height = "100%";
  html.style.overflow = "hidden";
  html.style.height = "100%";

  return () => {
    body.style.overflow = prevBodyOverflow;
    body.style.height = prevBodyHeight;
    html.style.overflow = prevHtmlOverflow;
    html.style.height = prevHtmlHeight;
  };
}, []);


  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => setVisible(Math.abs(container.scrollTop) > 1500);
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGoBack = () => navigate('/home');
  const scrollToBottom = () => containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });

  if (error) return (
    <Container sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', textAlign: 'center', gap: 3 }}>
      <Box component="img" src={errorSvg} sx={{ width: 120, opacity: 0.5 }} />
      <Typography variant="h6" fontWeight={700}>Conversation Unavailable</Typography>
      <Button variant="outlined" onClick={() => navigate(-1)}>Go back</Button>
    </Container>
  );

  if (loading || !participantUsername) return <LoadingSpinner />;

  const currentTypers = typingUsers[conversationId] || [];
  const otherIsTyping = participantId && currentTypers.some(id => String(id) === String(participantId));
  const reversedMessages = [...messages].reverse();

  return (
    <Box sx={{ display: 'flex', width: '100dvw', height: '100dvh', overflow: 'hidden', bgcolor: 'inherit',position: 'relative' }}>
      
      {/* LEFT SIDE: COMPLETE CHAT STACK (Header + Messages + Footer) */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        flexGrow: 1, 
        height: '100%',
        minHeight: 0,
        transition: 'all 0.3s ease-in-out',
        width: isSearchOpen && !isMobile ? 'calc(100% - 350px)' : '100%' 
      }}>
        
        {/* HEADER */}
        <Box sx={{ 
  height: '60px', 
  minHeight: '60px', 
  maxHeight: '60px',
  flexShrink: 0,     
  width: '100%', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'space-between', 
  px: 2, 
  borderBottom: '1px solid', 
  borderColor: 'divider', 
  backdropFilter: 'blur(20px)', 
  zIndex: 10,
}}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <IconButton onClick={handleGoBack}><ArrowBackIcon /></IconButton>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ cursor: 'pointer' }} onClick={() => navigate(`/profile/${participantId}`)}>
              <Avatar sx={{ bgcolor: stringToColor(participantUsername || 'U'), width: 34, height: 34 }}>
                {getInitials(participantUsername)}
              </Avatar>
              <Typography variant="subtitle2" fontWeight={700}>{participantUsername}</Typography>
            </Stack>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Tooltip title="AI Search">
              <IconButton onClick={() => setIsSearchOpen(!isSearchOpen)} color={isSearchOpen ? "primary" : "inherit"}>
                <SearchIcon />
              </IconButton>
            </Tooltip>
            <ThemeOption />
          </Stack>
        </Box>

        {/* MESSAGES AREA */}
        <Box ref={containerRef} sx={{ 
          flexGrow: 1,minHeight: 0, display: 'flex', flexDirection: 'column-reverse', overflowY: 'auto', px: { xs: 1, sm: 4 }, py: 2,
           '&::-webkit-scrollbar': {
    width: { xs: 0, sm: '6px' },
  },
  '&::-webkit-scrollbar-thumb': {
    bgcolor: { xs: 'transparent', sm: 'divider' },
    borderRadius: 10,
  },
  scrollbarWidth: { xs: 'none', sm: 'auto' },
  msOverflowStyle: { xs: 'none', sm: 'auto' },
}}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column-reverse', p: '0 !important' }}>
            {otherIsTyping && <TypingIndicator username={participantUsername} color={stringToColor(participantUsername)} />}
            
            {messages.length > 0 ? reversedMessages.map((msg, index) => {
              const isOwn = user?.id === msg.user.id;
              const displayName = msg.user.username || t("anonymous");
              const prevMsg = reversedMessages[index + 1];
              const nextMsg = reversedMessages[index - 1];
              const isFirst = !prevMsg || prevMsg.user.id !== msg.user.id;
              const isLast = !nextMsg || nextMsg.user.id !== msg.user.id;

              return (
                <Box key={msg.id} id={msg.id} sx={{ 
                  display: 'flex', width: '100%', justifyContent: isOwn ? 'flex-end' : 'flex-start', 
                  alignItems: 'flex-end', gap: 1.5, mt: isFirst ? 3 : 0.3 
                }}>
                  {!isOwn && isLast ? (
                    <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: stringToColor(displayName) }}>
                      {getInitials(displayName)}
                    </Avatar>
                  ) : !isOwn && <Box sx={{ width: 32 }} />}

                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isOwn ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                    {!isOwn && isFirst && <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.5, mb: 0.5, ml: 1 }}>{displayName}</Typography>}
                    <Paper elevation={0} sx={{ 
                      p: '10px 16px', borderRadius: isOwn ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                      bgcolor: isOwn 
                    ? (theme.palette.primary.main || '#0084ff') 
                    : (theme.palette.mode === 'dark' ? '#333' : '#e4e6eb'),
                    color: isOwn 
                    ? (theme.palette.primary.contrastText || '#fff') 
                    : 'text.primary',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}>
                      <PreviewThisMsg message={msg.content} />
                    </Paper>
                  </Box>
                </Box>
              );
            }) : (
              <Box sx={{ textAlign: 'center', mt: '20vh', opacity: 0.3 }}>
                <ChatBubbleOutlineIcon sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h6">Start the conversation</Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* FOOTER */}
        <Box sx={{ flexShrink: 0 }}><Chat /></Box>
      </Box>

      {/* RIGHT SIDE: SEARCH PILLAR */}
      {isMobile ? (
        <Drawer anchor="right" open={isSearchOpen} onClose={() => setIsSearchOpen(false)} keepMounted hideBackdrop  PaperProps={{ sx: { width: '100dvw',bgcolor: 'transparent',backgroundImage: 'none',elevation: 0  } }} sx={{
      // Ensures the drawer doesn't create a secondary scrollbar
      zIndex: 1200, 
    }}>
          <ConversationSearch conversationId={conversationId} onClose={() => setIsSearchOpen(false)} query={searchQuery}
          setQuery={setSearchQuery}
          results={searchResults}
          setResults={setSearchResults} />
        </Drawer>
      ) : (
        <Box sx={{ 
          width: isSearchOpen ? 350 : 0, transition: 'width 0.3s ease-in-out', 
          overflow: 'hidden', height: '100%', borderLeft: isSearchOpen ? 1 : 0, 
          borderColor: 'divider',
        }}>
          <Box sx={{ width: 350, height: '100%' }}>
            <ConversationSearch conversationId={conversationId} onClose={() => setIsSearchOpen(false)}  query={searchQuery}
            setQuery={setSearchQuery}
            results={searchResults}
            setResults={setSearchResults}/>
          </Box>
        </Box>
      )}

      {/* Floating Scroll Button */}
      <Box onClick={scrollToBottom} sx={{ 
        position: 'absolute', bottom: 100, 
        right: isSearchOpen && !isMobile ? 380 : 15, 
        transition: 'all 0.3s ease', opacity: visible ? 1 : 0, cursor: 'pointer', zIndex: 1100,
        bgcolor: 'background.paper', p: 1, borderRadius: '50%', boxShadow: 3, display: 'flex'
      }}>
        <ArrowCircleRightRoundedIcon sx={{ transform: 'rotate(90deg)', color: 'primary.main' }} />
      </Box>

    </Box>
  );
}

export default PreviewMsg;