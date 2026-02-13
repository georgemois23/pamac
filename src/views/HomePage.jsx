import React, { useState, useEffect, useContext } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Avatar, 
  IconButton, 
  Button, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  TextField, 
  InputAdornment, 
  Tab, 
  Tabs, 
  useTheme, 
  useMediaQuery, 
  styled,
  Badge,
  Divider,
} from '@mui/material';
import { 
  Search as SearchIcon, 
  ChatBubbleOutline as ChatIcon, 
  PersonAddAlt1 as AddPersonIcon, 
  PersonRemove as RemoveIcon,
  Circle as CircleIcon,
  Logout as LogoutIcon,
  PersonRemove,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../AuthContext'; 
import { formatDistanceToNowStrict } from 'date-fns'; 
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { useSnackbar } from '../context/SnackbarContext';
import { get } from 'mongoose';
import { useFriendContext } from '../context/FriendContext';
import GlobalDialog from '../components/GlobalDialog';
import { apiFetch } from '../api/Fetch';

// --- 1. GLASSMORPHISM STYLED COMPONENT ---
const GlassBox = styled(Box)(({ theme }) => ({
  background: theme.palette.mode === 'dark' 
    ? 'rgba(30, 30, 30, 0.6)' 
    : 'rgba(255, 255, 255, 0.65)',
  backdropFilter: 'blur(12px)',
  borderRadius: '24px',
  border: '1px solid',
  borderColor: theme.palette.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(255, 255, 255, 0.4)',
  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
  padding: theme.spacing(3),
  height: '100%',
  transition: 'transform 0.2s ease-in-out',
}));

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const HomePage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const { 
    friends, 
    friendRequests,          // This maps to your Search Results
    friendRequestStatus,     // This maps to your Pending List
    handleSearch,
    handleSendRequest,
    getFriendRequestStatus,
    handleFriendshipResponse,
    handleRemoveFriend,
    setFriendRequests,    
    refetchFriends,    // Used to clear search
    conversations,
    setConversations,
  } = useFriendContext();

  // State
  const [tabValue, setTabValue] = useState(0); 
  const [searchQuery, setSearchQuery] = useState('');
  // const [conversations, setConversations] = useState([]);
  const [showAddFriends, setShowAddFriends] = useState(false); 
  const [friendRequestsSearch, setFriendRequestsSearch] = useState(''); 
  const [showRequests, setShowRequests] = useState(false);
  const { showSnackbar } = useSnackbar();
  const conversationSearch = searchQuery ? conversations.filter(chat => {
    const partner = chat.participants.find(p => p.user.id !== user.id);
    return partner && partner.user.username.toLowerCase().includes(searchQuery.toLowerCase());
  }) : conversations;
  const friendsSearch = searchQuery ? friends.filter(f => 
    f.friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  ) : friends;
  const [dialogOpen, setDialogOpen] = useState(false);
    const handleOpen = () => {
       setDialogOpen(!dialogOpen);
    }
  // --- STATE CHANGE: Show Add Friends Logic ---
  useEffect(() => {
    if (tabValue === 1)
      refetchFriends();
  }, [tabValue]);
  const [friendToDelete, setFriendToDelete] = useState(null);
  // Handlers
  const handleTabChange = (event, newValue) => setTabValue(newValue);
  const handleUserSearch = (val) => {
      setFriendRequestsSearch(val);
      handleSearch(val);
  };

  document.title = `${user?.username || ''} • Home`;

  const handleDeleteButtonClick = (friend, username) => {
    setFriendToDelete({id: friend, username: username});

    console.log("Delete button clicked");
    setDialogOpen(true);
  }

  const handleRemoveThisFriend = async () => {
    handleRemoveFriend(friendToDelete.id);
  }

  const stringToColor = (string) => {
    if (!string) return '#2196f3';
    let hash = 0;
    for (let i = 0; i < string.length; i++) hash = string.charCodeAt(i) + ((hash << 5) - hash);
    let color = '#';
    for (let i = 0; i < 3; i++) color += `00${((hash >> (i * 8)) & 0xff).toString(16)}`.slice(-2);
    return color;
  };

  
    useEffect(() => {
      if(tabValue === 1){
        getFriendRequestStatus();
      }
    }, [tabValue]);


  const handleCloseAddFriends = () => {
      setShowAddFriends(false);
      setFriendRequestsSearch('');
      setFriendRequests([]); 
  };

 
  console.log("Friend to be deleted:", friendToDelete);
  // --- HELPER: Get Partner Name & Last Message ---
  const getDisplayInfo = (chat) => {
    if (!user || !chat.participants) return { name: 'Loading...', initial: '?', msg: '', time: '' };

    const partnerObj = chat.participants.find(p => p.user.id !== user.id);
    const partner = partnerObj ? partnerObj.user : { username: 'Unknown' };
    
    const name = partner.username || 'Unknown';
    const initial = name.charAt(0).toUpperCase();

    const lastMsg = chat.messages && chat.messages.length > 0 
      ? chat.messages[0] 
      : null;

    const msgContent = lastMsg ? lastMsg.content : 'No messages yet';
    
    let timeStr = '';
    if (lastMsg?.createdAt) {
        try {
            timeStr = formatDistanceToNowStrict(new Date(lastMsg.createdAt), { addSuffix: true });
        } catch (e) {
            timeStr = new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
    }

    return { name, initial, msg: msgContent, time: timeStr };
  };

  const openConversation = async (participant) => {
    if (participant.conversation) {
      navigate(`/inbox/${participant.conversation}`);
    }
    else {
    try {
  const conversation = await apiFetch("/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ participantId: participant.id }),
  });

  navigate(`/inbox/${conversation.id}`);
} catch (error) {
  console.error("Error starting conversation:", error);
}
  }
  };

  console.log('Conversations:', conversations); 

 const getDisplayMessage = (message) => {
  if (!message || typeof message !== 'string') return '';

  const trimmed = message.trim();

  const urlRegex =
  /(https?:\/\/)([\w-]+\.)+[\w-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?/i;

  if (!urlRegex.test(message)) {
  return message;
  }

  const lower = trimmed.toLowerCase();

  if (lower.endsWith('.gif')) return 'Sent a GIF';

  if (
    lower.endsWith('.png') ||
    lower.endsWith('.jpg') ||
    lower.endsWith('.jpeg') ||
    lower.endsWith('.webp')
  ) {
    return 'Sent an Image';
  }

  return 'Sent a Link';
};




  return (
    <Box sx={{ 
      minHeight: '100vh', 
      pt: 4, pb: 2,
      display: 'flex', 
      alignItems: {xs: 'start', md:'center'} 
    }}>
      <Container maxWidth="xl">
        {/* --- UPDATED GRID CONTAINER --- 
            Added justifyContent logic: if Add Friends is hidden, center the content.
        */}
        <Grid 
          container 
          spacing={3} 
          sx={{ height: { xs: 'auto', md: '85vh' }, order: { xs: 0, md: 0 } }}
          justifyContent={showAddFriends ? "flex-start" : "center"}
        >
          
          {/* --- LEFT COLUMN: PROFILE --- */}
<Grid item xs={12} md={3} sx={{ height: { md: '100%' } }}>
  <GlassBox 
    sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      textAlign: 'center', 
      // Adjusted padding for a cleaner mobile look
      p: { xs: 2, md: 4 }, 
      bgcolor: 'inherit' 
    }}
  >
    {/* PROFILE INFO CONTAINER */}
    <Box sx={{ 
      display: 'flex', 
      // Mobile: Row (Side-by-side), Desktop: Column (Stacked)
      flexDirection: {xs: 'row', md:'column'}, 
      alignItems: 'center', 
      justifyContent: {xs: 'flex-start', md: 'center'},
      gap: {xs: 2, md: 0}, 
      width: '100%'
    }}>
      
      {/* AVATAR */}
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <Avatar 
            sx={{ 
              width: { xs: 20, md: 32 }, 
              height: { xs: 20, md: 32 }, 
              border: `2px solid ${theme.palette.background.paper}`,
              bgcolor: 'background.paper',
              cursor: 'pointer',
              mb: { xs: 0, md: 4 }, // No margin bottom on mobile badge
            }}
            onClick={() => navigate(`/profile`)}
          >
            <EditIcon sx={{ width: { xs: 14, md: 20 }, height: { xs: 14, md: 20 }, color: 'text.primary' }} />
          </Avatar>
        }
      >
        <Avatar 
          sx={{ 
            // INCREASED SIZE: 32px was too small. 56px is better for mobile.
            width: { xs: 56, md: 100 }, 
            height: { xs: 56, md: 100 }, 
            mb: { xs: 0, md: 2 }, 
            fontSize: { xs: '1.5rem', md: '2rem' },
            bgcolor: stringToColor(user?.username),
            boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
            cursor: 'pointer' 
          }}
          onClick={() => navigate(`/profile`)}
        >
          {user?.username?.charAt(0).toUpperCase()}
        </Avatar>
      </Badge>

      {/* TEXT INFO */}
      <Box sx={{ textAlign: { xs: 'left', md: 'center' } }}>
        <Typography 
          variant="h5" 
          fontWeight="bold" 
          sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}
        >
          {user?.username || 'Guest'}
        </Typography>

        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ fontSize: { xs: '0.85rem', md: '0.875rem' } }}
        >
          {user?.email || ''}
        </Typography>
      </Box>
    </Box>

    {/* BUTTONS CONTAINER */}
    <Box 
      sx={{ 
        mt: { xs: 2, md: 4 }, 
        display: 'flex', 
        // Mobile: Row, Desktop: Column
        flexDirection: { xs: 'row', md: 'column' },
        alignItems: 'center',
        gap: { xs: 1, md: 2 }, 
        width: '100%' 
      }}
    >
      {/* FIND FRIENDS BUTTON */}
      <Button 
          variant="contained" 
          // 'startIcon' is only handled automatically if we want text. 
          // We are doing manual layout for responsive icon-only mode.
          sx={{ 
            borderRadius: 3, 
            py: { xs: 1, md: 1.5 }, 
            px: 2,
            fontSize: { xs: '0.8125rem', md: '0.875rem' }, 
            // FLEX MAGIC: This makes buttons share width equally on mobile
            flex: { xs: 1, md: 'unset' },
            width: { md: '100%' }, 
            minWidth: 0, // Prevents overflow on very small screens
          }} 
          onClick={() => setShowAddFriends(!showAddFriends)}
      >
        {showAddFriends ? <PersonRemove/> : <AddPersonIcon />}
        {/* Text is HIDDEN on mobile (xs: none), visible on desktop (md: block) */}
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, ml: 1 }}>
           {showAddFriends ? "Hide" : "Find Friends"} 
        </Box>
      </Button>

      {/* LOGOUT BUTTON */}
      <Button 
        variant="outlined" 
        color="error" 
        sx={{ 
          // FLEX MAGIC: Share width equally
          flex: { xs: 1, md: 'unset' },
          width: { md: '100%' },
          minWidth: 0,
          py: { xs: 1, md: 1 },
          fontSize: { xs: '0.8125rem', md: '0.875rem' }
        }} 
        onClick={() => {logout(); navigate('/logout', { state: { fromLogout: true } });}}
      >
        {/* On Mobile: Show Icon Only */}
        <LogoutIcon sx={{ display: { xs: 'block', md: 'none' } }} />
        
        {/* On Desktop: Show Text Only */}
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' } }}>
          Logout
        </Box>
      </Button>
    </Box>
  </GlassBox>
</Grid>

          {/* --- MIDDLE COLUMN: LISTS --- */}
          {/* UPDATED: I added logic to `md`.
              If showing add friends: width is 6.
              If NOT showing add friends: width is 8. 
              (3+8 = 11, which centers nicely with 0.5 margin on each side)
          */}
          <Grid item xs={12} md={showAddFriends ? 6 : 8} sx={{ height: { md: '100%' }, order: { xs: 2, md: 1 }  }}>
            <GlassBox sx={{ p: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', bgcolor: 'inherit' }}>
              
              {/* Tabs */}
              <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
                  <Tab label="Messages" sx={{ fontWeight: 'bold' }} />
                  <Tab label="Friends" sx={{ fontWeight: 'bold' }} />
                </Tabs>
              </Box>

              {/* Search */}
              <Box sx={{ p: 2 }}>
                <TextField
                  fullWidth
                  placeholder={tabValue === 0 ? "Search chats..." : "Search friends..."}
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => {setSearchQuery(e.target.value.toLowerCase());}}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    sx: { 
                      borderRadius: '20px', 
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)',
                      '& fieldset': { border: 'none' } 
                    }
                  }}
                />
              </Box>

                  <Box
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        px: { sm: 0, md: 2 },
        pb: 2,
        
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
          marginBottom: '20px',
          marginTop: '15px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#6b6b6b',
          borderRadius: '20px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#555',
        },
        '&::-webkit-scrollbar-button': {
          display: 'none',
        },
      }}
    >
                <List >
                  {tabValue === 0 && (
              conversationSearch.length > 0 ? (
                conversationSearch.slice(0,4).map((chat) => {
                  const { name, initial, msg, time } = getDisplayInfo(chat);

                  return (
                    <ListItem
                      key={chat.id}
                      button
                      onClick={() => navigate(`/inbox/${chat.id}`)}
                      sx={{ borderRadius: 2, mb: 1 }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: stringToColor(name) }}>
                          {initial}
                        </Avatar>
                      </ListItemAvatar>

                      <ListItemText
                        primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography fontWeight="bold" noWrap>
                            {name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 1, whiteSpace: 'nowrap' }}>
                            {time}
                          </Typography>
                        </Box>
                        }
                        secondary={getDisplayMessage(msg)}
                        primaryTypographyProps={{ fontWeight: 'bold' }}
                        secondaryTypographyProps={{
                          noWrap: true,
                          color: 'text.secondary',
                          maxWidth: { xs: '120px', md: '200px' },
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      />
                    </ListItem>
                  );
                })
              ) : searchQuery ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2, textAlign: 'center' }}
                >
                  No conversations found.
                </Typography>
              ) : null
            )}

              {conversationSearch.length > 4 && tabValue === 0 &&
                <Button variant="text" size="small" onClick={() => navigate('/inbox')} sx={{ display: 'block', mx: 'auto', mt: 1,borderRadius: 3, 
            py: { xs: 1, md: 1.5 }, 
            px: 2,
            fontSize: { xs: '0.8125rem', md: '0.875rem' },  }}>
                  View All
                </Button>
              }


                  {tabValue === 1 &&  (
  <>
    {friendRequestStatus.length > 0 && (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }} >
      <Button
        variant="text"
        size="small"
        onClick={() => setShowRequests(!showRequests)}
        sx={{ fontWeight: 'bold', textTransform: 'none' }}
      >
        Friend Requests {friendRequestStatus.length > 0 ? `(${friendRequestStatus.length})` : ""}
      </Button>
    </Box>
    )}

    {/* FRIEND REQUESTS LIST (Conditional rendering based on toggle) */}
    {showRequests && friendRequestStatus.length > 0 && (
      <Box sx={{ mb: 3 }}>
        {friendRequestStatus.map((request) => (
          <ListItem
            key={request.friendshipId}
            sx={{ borderRadius: 2, mb: 1, bgcolor: 'rgba(0,0,0,0.02)' }}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: stringToColor(request.username) }}>
                {request.requester.username[0].toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText 
            primary={request.requester.username} 
            secondary={`Sent ${new Date(request.sentAt).toLocaleDateString()}`}
            />
            <IconButton color="success">
              <CheckIcon onClick={() => handleFriendshipResponse(request.friendshipId, true)}/>
            </IconButton>
            <IconButton color="error">
              <CloseIcon onClick={() => handleFriendshipResponse(request.friendshipId, false)} />
            </IconButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 2 }} />
      </Box>
    )}

    {/* FRIENDS LIST */}
    {friendsSearch.length > 0 ? (
      <>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, pl:2 }}>
          Friends
        </Typography>
        {friendsSearch.map(({ friend, friendshipId }) => (
          <ListItem
            key={friend.id}
            sx={{ borderRadius: 2, mb: 1 }}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: stringToColor(friend.username) }} onClick={() => navigate(`/profile/${friend.id}`)}>
                {friend.username[0].toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={friend.username} onClick={() => navigate(`/profile/${friend.id}`)} />
            {/* <IconButton color="primary" onClick={() => navigate(`/messages/${friend.conversation}`)}> */}
            <IconButton color="primary" onClick={() => openConversation(friend)}>
              <ChatIcon />
            </IconButton>
            {/* <IconButton color="error" onClick={() => handleRemoveFriend(friendshipId)}> */}
            <IconButton color="error" onClick={() => handleDeleteButtonClick(friendshipId, friend.username)}>
              <RemoveIcon />
            </IconButton>
          </ListItem>
        ))}
      </>
    ) : (
      !showRequests && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
          No friends found.
        </Typography>
      )
    )}
  </>
)}
                </List>
              </Box>
            </GlassBox>
          </Grid>

          {/* --- RIGHT COLUMN: ADD FRIENDS --- */}
          {showAddFriends && (
            <Grid item md={3} sx={{ height: { md: '100%' }, order: { xs: 1, md: 3 }, width: '100%',  }}>
              <GlassBox sx={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', bgcolor: 'inherit' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Add Friends</Typography>
                <Button variant="text" size="small" onClick={() => {setShowAddFriends(false); setFriendRequestsSearch(''); setFriendRequests([])}} sx={{ mb: 2 }}><CloseIcon /></Button>
                </Box>
                <TextField 
                  fullWidth 
                  placeholder="Username..." 
                  size="small"
                  onChange={(e)=> {handleSearch(e.target.value.toLowerCase());  setFriendRequestsSearch(e.target.value.toLowerCase());}}
                  sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 4 } }} 
                />
                <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        // px: { sm: 0, md: 2 },
        pb: 2,
        
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent',
          marginBottom: '20px',
          marginTop: '15px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#6b6b6b',
          borderRadius: '20px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#555',
        },
        '&::-webkit-scrollbar-button': {
          display: 'none',
        },
      }}
    >
                {friendRequests.length > 0 && friendRequests.map((req) => (
                  <Box key={req.id} sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                    <Typography variant="subtitle1" fontWeight="bold" onClick={()=> navigate(`/profile/${req.id}`)} sx={{cursor:'pointer'}}>{req.username}</Typography>
                      <Button 
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleSendRequest(req.id)}
                      >
                        Send Request
                      </Button>
                      
                  </Box>
                ))}
                
                
                {friendRequests.length === 0 && friendRequestsSearch.length>0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    No users found.
                  </Typography>
                )}
                </Box>
              </GlassBox>
            </Grid>
          )}

        </Grid>
          <GlobalDialog
            open={dialogOpen}
            onClose={handleOpen}
            title="Remove Friend"
            primaryButtonText="Remove"
            secondaryButtonText="Cancel"
            onPrimaryClick={() => {
              handleRemoveThisFriend(); 
              handleOpen();         
            }}
            onSecondaryClick={handleOpen}
          >
            <Typography>
            Are you sure you want to remove{' '}
            <Typography component="span" fontWeight={800}>
              {friendToDelete?.username || 'this user'}
            </Typography>{' '}
            from your friends?
          </Typography>
          </GlobalDialog>

      </Container>
    </Box>
  );
};

export default HomePage;