import React, { useState, useEffect, useContext } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Paper, 
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Box,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  ChatBubbleOutline as ChatIcon, 
  PersonRemove as RemoveIcon,
  Person as PersonIcon,
  SentimentDissatisfied as SadIcon
} from '@mui/icons-material';
import AuthContext from '../AuthContext';
import { useNavigate } from 'react-router-dom';

// Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000'; 

// Helper: Generate a consistent color from a string (username)
const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) hash = string.charCodeAt(i) + ((hash << 5) - hash);
  let color = '#';
  for (let i = 0; i < 3; i++) color += `00${((hash >> (i * 8)) & 0xff).toString(16)}`.slice(-2);
  return color;
};

const FriendshipsPage = () => {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  
  // Responsive check: is screen smaller than 600px?
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // 1. FETCH FRIENDS
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch(`${API_URL}/friendships/friends`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch friends');

        const data = await res.json();
        setFriends(data); 
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    if(user?.accessToken) fetchFriends();
  }, [user]);

  // 2. START CONVERSATION
  const openConversation = async (participantId) => {
    try {
      const res = await fetch(`${API_URL}/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({ participantId }),
      });
      
      if (!res.ok) throw new Error('Failed to start conversation');
      
      const conversation = await res.json();
      navigate(`/messages/${conversation.id}`);

    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  // 3. REMOVE FRIEND
  const handleRemoveFriend = async (friendId) => {
    if(!window.confirm("Are you sure you want to remove this friend?")) return;
    
    // Optimistic Update
    setFriends((prev) => prev.filter((f) => f.id !== friendId));

    // Optional: Call Backend Delete API here
  };

  const goToProfile = (friendId) => () => {
    navigate(`/profile/${friendId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, textAlign: { xs: 'center', sm: 'left' } }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          My Friends
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your connections and start conversations.
        </Typography>
      </Box>

      {friends.length === 0 ? (
        // Modern Empty State
        <Paper 
          elevation={0} 
          sx={{ 
            p: 6, 
            textAlign: 'center', 
            bgcolor: 'background.default', 
            border: '2px dashed', 
            borderColor: 'divider',
            borderRadius: 4
          }}
        >
          <SadIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            You haven't added any friends yet.
          </Typography>
        </Paper>
      ) : (
        // Responsive Grid
        <Grid container spacing={3}>
          {friends.map((friend) => {
             const displayName = friend.name || friend.username;
             const initial = displayName.charAt(0).toUpperCase();
             const avatarColor = stringToColor(displayName);

             return (
              <Grid item xs={12} sm={6} md={4} key={friend.id}>
                <Card 
                  elevation={2}
                  sx={{ 
                    borderRadius: 3,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    bgcolor: 'transparent',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', pt: 4 }}>
                    {/* Avatar */}
                    <Avatar 
                    onClick={goToProfile(friend.id)}
                      sx={{ 
                        width: 72, 
                        height: 72, 
                        bgcolor: avatarColor, 
                        fontSize: '1.75rem',
                        margin: '0 auto',
                        mb: 2,
                        boxShadow: 3
                      }}
                    >
                      {initial}
                    </Avatar>
                    
                    {/* User Info */}
                    <Typography variant="h6" onClick={goToProfile(friend.id)} component="div" fontWeight="600" noWrap>
                      {displayName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1 }}>
                      {friend.email}
                    </Typography>
                  </CardContent>

                  {/* Actions Area */}
                  <CardActions sx={{ justifyContent: 'center', pb: 3, px: 2 }}>
                    <Button 
                      variant="contained" 
                      startIcon={<ChatIcon />}
                      onClick={() => openConversation(friend.id)}
                      fullWidth
                      sx={{ 
                        borderRadius: 20, 
                        textTransform: 'none',
                        fontWeight: 'bold',
                        boxShadow: 'none',
                        padding: isMobile ? '8px 6px' : '10px 16px',
                      }}
                    >
                      Message
                    </Button>
                    
                    <Tooltip title="Remove Friend">
                      <IconButton 
                        color="error" 
                        onClick={() => handleRemoveFriend(friend.id)}
                        sx={{ ml: 1, bgcolor: 'error.lighter' }}
                      >
                        <RemoveIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default FriendshipsPage;