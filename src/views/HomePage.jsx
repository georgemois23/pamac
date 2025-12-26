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
  PersonAdd as AddPersonIcon, 
  PersonRemove as RemoveIcon,
  Circle as CircleIcon,
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
  
  // --- STATE CHANGE: Show Add Friends Logic ---
  useEffect(() => {
    if (tabValue === 1)
      refetchFriends();
  }, [tabValue]);

  // Handlers
  const handleTabChange = (event, newValue) => setTabValue(newValue);
  const handleUserSearch = (val) => {
      setFriendRequestsSearch(val);
      handleSearch(val);
  };

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

  // --- FETCH CONVERSATIONS ---
  useEffect(() => {
    if (!user?.accessToken) return;

    fetch(`${API_URL}/conversations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`,
        },
      })
      .then(res => res.json())
      .then(data => {
         setConversations(data);
      })
      .catch(err => console.error('Error fetching conversations:', err));
  }, [user]);

  const handleCloseAddFriends = () => {
      setShowAddFriends(false);
      setFriendRequestsSearch('');
      setFriendRequests([]); 
  };
  

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
      navigate(`/messages/${participant.conversation}`);
    }
    else {
    try {
      const res = await fetch(`${API_URL}/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({ participantId: participant.id }),
      });
      
      if (!res.ok) throw new Error('Failed to start conversation');
      
      const conversation = await res.json();
      navigate(`/messages/${conversation.id}`);

    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  }
  };

  console.log('Conversations:', conversations); 


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
      // Responsive padding: 2 (16px) on mobile, 4 (32px) on desktop
      p: { xs: 1, md: 4 }, 
      bgcolor: 'inherit' 
    }}
  >
    <Box sx={{ display: 'flex', flexDirection: {xs: 'row', md:'column'}, alignItems: 'center', gap: {xs:2, md:0},  }}>
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      badgeContent={
        <Avatar 
          sx={{ 
            // Responsive edit icon size
            width: { xs: 18, md: 32 }, 
            height: { xs: 18, md: 32 }, 
            border: `2px solid ${theme.palette.background.paper}`,
            bgcolor: 'background.paper',
            cursor: 'pointer',
            // Adjust margin bottom for the badge position
            mb: { xs: 1, md: 4 },
          }}
          onClick={() => navigate(`/profile`)}
        >
          <EditIcon sx={{ width: { xs: 12, md: 20 }, height: { xs: 12, md: 20 }, color: 'text.primary' }} />
        </Avatar>
      }
    >
      <Avatar 
        sx={{ 
          // Responsive Avatar Size: 64px on mobile, 100px on desktop
          width: { xs: 32, md: 100 }, 
          height: { xs: 32, md: 100 }, 
          // Reduce margin below avatar on mobile
          mb: { xs: 1, md: 2 }, 
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

    {/* Responsive Typography */}
    <Box>
    <Typography 
      variant="h5" 
      fontWeight="bold" 
      sx={{ fontSize: { xs: '1.1rem', md: '1.5rem' } }}
    >
      {user?.username || 'Guest'}
    </Typography>

    <Typography 
      variant="body2" 
      color="text.secondary" 
      sx={{ fontSize: { xs: '0.8rem', md: '0.875rem' }, mb: 0 }} // Removed gutterBottom for tighter fit
    >
      {user?.email || ''}
    </Typography>
    </Box>
    </Box>
    <Box 
      sx={{ 
        // Reduced gap and top margin on mobile
        mt: { xs: 2, md: 4 }, 
        display: 'flex', 
        flexDirection: { xs: 'row', md: 'column' },
        alignItems: 'center',
        gap: { xs: 0, md: 2 }, 
        width: '100%' 
      }}
    >
      <Button 
          variant="contained" 
          fullWidth 
          startIcon={<AddPersonIcon />} 
          // Thinner buttons on mobile
          sx={{ 
            borderRadius: 3, 
            py: { xs: 0.75, md: 1.5 }, 
            px: 2,
            fontSize: { xs: '0.8125rem', md: '0.875rem' }, 
            marginInline:'auto',
          }} 
          onClick={() => setShowAddFriends(!showAddFriends)}
      >
        {showAddFriends ? "Hide" : "Find Friends"} 
      </Button>

      <Button 
        variant="outlined" 
        fullWidth 
        color="error" 
        // Thinner buttons on mobile
        sx={{ 
          marginInline:'auto',
          py: { xs: 0.5, md: 1 },
          fontSize: { xs: '0.8125rem', md: '0.875rem' }
        }} 
        onClick={() => {logout(); navigate('/logout', { state: { fromLogout: true } });}}
      >
        Logout
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
                  onChange={(e) => {setSearchQuery(e.target.value);}}
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

              {/* List Content */}
              <Box sx={{ flexGrow: 1, overflowY: 'auto', px: {sm:0, md:2}, pb: 2 }}>
                <List>
                  {/* VIEW 1: CONVERSATIONS */}
                  {tabValue === 0 && conversations.length > 0 && conversations.map((chat) => {
                    const { name, initial, msg, time } = getDisplayInfo(chat);

                    return (
                      <ListItem 
                        key={chat.id} 
                        button 
                        onClick={() => navigate(`/messages/${chat.id}`)}
                        sx={{ borderRadius: 2, mb: 1, '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' } }}
                        secondaryAction={
                          <Typography variant="caption" color="text.secondary">{time}</Typography>
                        }
                      >
                        <ListItemAvatar>
                          <Badge 
                            overlap="circular" 
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            variant="dot"
                            color="success" 
                          >
                            <Avatar sx={{ bgcolor: stringToColor(name) }}>{initial}</Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={name} 
                          secondary={msg} 
                          primaryTypographyProps={{ fontWeight: 'bold' }}
                          secondaryTypographyProps={{ 
                          noWrap: true,                 // prevents line wrap
                          color: 'text.secondary', 
                          maxWidth: { xs: '120px', md: '200px' }, // responsive max width
                          overflow: 'hidden',           // hide overflow
                          textOverflow: {xs: 'ellipsis', md: 'auto'},     // show "..." when too long
                        }}
                        />
                      </ListItem>
                    );
                  })}

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
    {friends.length > 0 ? (
      <>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, pl:2 }}>
          Friends
        </Typography>
        {friends.map(({ friend, friendshipId }) => (
          <ListItem
            key={friend.id}
            sx={{ borderRadius: 2, mb: 1 }}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: stringToColor(friend.username) }} onClick={() => navigate(`/profile/${friend.id}`)}>
                {friend.username[0]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={friend.username} onClick={() => navigate(`/profile/${friend.id}`)} />
            {/* <IconButton color="primary" onClick={() => navigate(`/messages/${friend.conversation}`)}> */}
            <IconButton color="primary" onClick={() => openConversation(friend)}>
              <ChatIcon />
            </IconButton>
            <IconButton color="error" onClick={() => handleRemoveFriend(friendshipId)}>
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
              <GlassBox sx={{  bgcolor: 'inherit' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>Add Friends</Typography>
                <Button variant="text" size="small" onClick={() => {setShowAddFriends(false); setFriendRequestsSearch(''); setFriendRequests([])}} sx={{ mb: 2 }}><CloseIcon /></Button>
                </Box>
                <TextField 
                  fullWidth 
                  placeholder="Username..." 
                  size="small"
                  onChange={(e)=> {handleSearch(e.target.value);  setFriendRequestsSearch(e.target.value);}}
                  sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 4 } }} 
                />
                
                {friendRequests.length > 0 && friendRequests.map((req) => (
                  <Box key={req.id} sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
              </GlassBox>
            </Grid>
          )}

        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;