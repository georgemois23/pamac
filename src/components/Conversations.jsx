import React, { useContext, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMessages } from '../context/MessagesContext';
import { useSnackbar } from '../context/SnackbarContext';
import { formatDistanceToNowStrict } from 'date-fns';

import {
  Box,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  useTheme,
  styled,
  Button,
  IconButton,
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import AuthContext from '../AuthContext';
import { HomeOutlined } from '@mui/icons-material';

const GlassBox = styled(Box)(({ theme }) => ({
  backdropFilter: 'blur(12px)',
  borderRadius: '0px',
  border: '0px solid transparent',
  boxShadow: 'none',
  padding: 0,
  height: '100%',
  minHeight: 0,
}));

const stringToColor = (string) => {
  if (!string) return '#2196f3';
  let hash = 0;
  for (let i = 0; i < string.length; i++) hash = string.charCodeAt(i) + ((hash << 5) - hash);
  let color = '#';
  for (let i = 0; i < 3; i++) color += `00${((hash >> (i * 8)) & 0xff).toString(16)}`.slice(-2);
  return color;
};

const getDisplayInfo = (chat, user) => {
  if (!user || !chat?.participants) return { name: 'Loading...', initial: '?', msg: '', time: '' };

  const partnerObj = chat.participants.find((p) => p?.user?.id !== user.id);
  const partner = partnerObj?.user || { username: 'Unknown' };

  const name = partner.username || 'Unknown';
  const initial = name.charAt(0).toUpperCase();

  const lastMsg = chat.messages?.length ? chat.messages[0] : null;
  const msgContent = lastMsg?.content ?? 'No messages yet';

  let timeStr = '';
  if (lastMsg?.createdAt) {
    try {
      timeStr = formatDistanceToNowStrict(new Date(lastMsg.createdAt), { addSuffix: true });
    } catch {
      timeStr = new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  }

  return { name, initial, msg: msgContent, time: timeStr };
};

const getDisplayMessage = (message) => {
  if (!message || typeof message !== 'string') return '';
  const trimmed = message.trim();

  const urlRegex =
    /(https?:\/\/)([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?/i;

  if (!urlRegex.test(trimmed)) return trimmed;

  const lower = trimmed.toLowerCase();
  if (lower.endsWith('.gif')) return 'Sent a GIF';
  if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.webp')) {
    return 'Sent an Image';
  }
  return 'Sent a Link';
};

const Conversations = ({ onSelectConversation, isMobile }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { conversations = [] } = useMessages(); // ✅ prevents crashes
  const { user } = useContext(AuthContext);

  const [searchQuery, setSearchQuery] = useState('');

  const conversationSearch = useMemo(() => {
    if (!searchQuery) return conversations;

    return conversations.filter((chat) => {
      const partner = chat?.participants?.find((p) => p?.user?.id !== user?.id);
      const uname = partner?.user?.username?.toLowerCase() || '';
      return uname.includes(searchQuery);
    });
  }, [conversations, searchQuery, user?.id]);

 const handleSelect = (chatId) => {
  if (isMobile) {
    navigate(`/inbox/${chatId}`); // mobile = real navigation
  } else {
    onSelectConversation?.(chatId); // open in place
    window.history.pushState({}, "", `/inbox/${chatId}`); // ✅ update URL only
  }
};


  return (
    <GlassBox sx={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', p: isMobile ? 2 : 0.5 }}>
      {/* Search */}
      <Box sx={{ height: '60px', p: 1.5, 
  minHeight: '60px', 
  maxHeight: '60px', 
  display:'flex',
  gap:1,      
//   borderBottom: '1px solid', borderColor: 'divider' 
  }}>
    <IconButton disableRipple sx={{width:'fit-content', marginInline:'auto', pt:1.5}} onClick={() => navigate("/")}><HomeOutlined/></IconButton>
        <TextField
          fullWidth
          placeholder="Search chats..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: '16px',
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)',
              '& fieldset': { border: 'none' },
              height: 40,
            },
          }}
        />
      </Box>

      {/* List */}
      <Box
        sx={{
          flexGrow: 1,
          minHeight: 0,
          overflowY: 'auto',
          pt: 1,
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#6b6b6b', borderRadius: '20px' },
          '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' },
          '&::-webkit-scrollbar-button': { display: 'none' },
        }}
      >
        {conversationSearch.length > 0 ? (
          <List disablePadding sx={{ p: 0, }}>
            {conversationSearch.map((chat) => {
              const { name, initial, msg, time } = getDisplayInfo(chat, user);

              return (
                <ListItem
                  key={chat.id}
                  button
                  onClick={() => handleSelect(chat.id)}
                  sx={{
                    px: 1.5,
                    py: 1.2,
                    borderRadius: 0,
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 46 }}>
                    <Avatar sx={{ bgcolor: stringToColor(name), width: 36, height: 36 }}>
                      {initial}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, alignItems: 'center' }}>
                        <Typography fontWeight={700} noWrap sx={{ fontSize: '0.95rem' }}>
                          {name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                          {time}
                        </Typography>
                      </Box>
                    }
                    secondary={getDisplayMessage(msg)}
                    secondaryTypographyProps={{
                      noWrap: true,
                      color: 'text.secondary',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        ) : searchQuery ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
            No conversations found.
          </Typography>
        ) : null}
      </Box>
       </GlassBox>
  );
};

export default Conversations;