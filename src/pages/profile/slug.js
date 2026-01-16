import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// MUI Imports
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Fab,
  Zoom,
  Stack,
  CircularProgress,
  useTheme,
  Alert,
  Button,
  Avatar
} from '@mui/material';

// Icons
import ForumIcon from '@mui/icons-material/Forum';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';

// Contexts
import AuthContext from '../../AuthContext';
import { useSnackbar } from '../../context/SnackbarContext';

// Components (assuming these exist based on your imports)
import LoadingSpinner from '../../components/LoadingSpinner';
import { set } from 'mongoose';
import { ArrowBack } from '@mui/icons-material';
// import ContentNotAvaiable from '../ContentNotAvailable'; // Uncomment if you want to use this component

const UserProfile = () => {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const { user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL;
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();

  // --- Logic Handlers ---

  const handleMessages = () => {
    navigate('/chat');
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

  const navigatedRef = useRef(false);

  useEffect(() => {
    const toggleVisible = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollTop > 200);
    };

    window.addEventListener("scroll", toggleVisible);
    
    // Trigger once on mount to check initial position
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
    setIsHovered(false);
  };

  const formattedUsername = username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();

 const [isFriend, setIsFriend] = useState(false); 
 const [userData, setUserData] = useState(null);

useEffect(() => {
  if (!id || !user?.accessToken) return;

  // INSIDE your useEffect...

const fetchFriendStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/friendships/is-friend/${id}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
        cache: 'no-store'
      });

      if (!res.ok) return;
      const data = await res.json(); // string | null

      console.log('Friend status data:', data);

      if (data) {

        setIsFriend(data);

      }

    } catch (err) {

      console.error(err);

    }

  };

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/users/data/${id}`, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      if (!res.ok) {
        showSnackbar({ message: 'User not found', severity: 'error' });
        navigate('/');
        return;
      }

      setUserData(await res.json());
    } catch (err) {
      navigate('/');
    }
  };

  fetchFriendStatus();
  fetchUser();
}, [id, user?.accessToken, API_URL, navigate, showSnackbar]);




  useEffect(() => {
    document.title = userData ? `${userData.username} • Profile` : 'Profile';
  }, [userData]);

  const handleFriendButton = () => {
    fetch(`${API_URL}/friendships/request/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.accessToken}`,
      },
    })
    .then(res => {
      if (res.ok) {
        showSnackbar({ message: 'Friend request sent', severity: 'success' });
        setIsFriend(prev => ({
                    ...prev,
                    status: 'pending'
                  }));
      } else {
        showSnackbar({ message: 'Failed to send friend request', severity: 'error' });
      }
    })
    .catch(error => {
      console.error('Error sending friend request:', error);
      showSnackbar({ message: 'An error occurred', severity: 'error' });
    });
  };
  // if (loading) return <LoadingSpinner />;
  const [friendRequestStatus, setFriendRequestStatus] = useState([]);
  const getFriendRequestStatus = () => {
    fetch(`${API_URL}/friendships/pending`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.accessToken}`,
      },
    })
    .then(res => res.json())
    .then(data => {
      setFriendRequestStatus(Array.isArray(data) ? data : [data]);
    })
    .catch(error => {
      console.error('Error fetching friend request status:', error);
      return false;
    });
  }

  const handleFriendshipResponse = (requestId, accept) => {
    fetch(`${API_URL}/friendships/respond/${requestId}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.accessToken}`,
                  },
                  body: JSON.stringify({ accept: accept }),
                })
                .then(res => {
                  if (res.ok) {
                    showSnackbar({ message: accept ? 'Friend request accepted' : 'Friend request rejected' , severity: 'success' });
                    setIsFriend(prev => ({
                    ...prev,
                    status: accept ? 'accepted' : 'rejected'
                  }));
                    // Optionally update the status list
                    // setFriendRequestStatus(prevStatus => prevStatus.filter((_, i) => i !== index));
                  } else {
                    showSnackbar({ message: 'Failed to accept friend request', severity: 'error' });
                  }
                })
                .catch(error => {
                  console.error('Error accepting friend request:', error);
                  showSnackbar({ message: 'An error occurred', severity: 'error' });
                });
  };

  const handleCancleFriendRequest = () => {
    fetch(`${API_URL}/friendships/cancel/${isFriend.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.accessToken}`,
      },
    })
    .then(res => {
      if (res.ok) {
        showSnackbar({ message: 'Friend request canceled', severity: 'success' });
        setIsFriend(false);
      } else {
        showSnackbar({ message: 'Failed to cancel friend request', severity: 'error' });
      }
    })
    .catch(error => {
      console.error('Error canceling friend request:', error);
      showSnackbar({ message: 'An error occurred', severity: 'error' });
    });
  };

  const handleRemoveFriend = () => {
    if(!isFriend) return;
    fetch(`${API_URL}/friendships/remove/${isFriend.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.accessToken}`,
      },
    })
    .then(res => {
      if (res.ok) {
        showSnackbar({ message: 'Friend removed', severity: 'success' });
        setIsFriend(false);
      } else {
        showSnackbar({ message: 'Failed to remove friend', severity: 'error' });
      }
    })
    .catch(error => {
      console.error('Error removing friend:', error);
      showSnackbar({ message: 'An error occurred', severity: 'error' });
    });
  };

  useEffect(() => {
  console.log('isFriend state:', isFriend);
}, [isFriend]);

let friendButton = null;

if (!isFriend || isFriend.status === 'canceled' || isFriend.status === 'rejected') {
  friendButton = (
    <Button variant="contained" color="primary" onClick={handleFriendButton}>
      Add Friend
    </Button>
  );
} else if (isFriend.status === 'pending') {
  if (isFriend.requesterId === user.id) {
    friendButton = (
      <Button
        variant="contained"
        color="primary"
        sx={{ mr: 1 }}
        onClick={() => handleCancleFriendRequest()}
      >
        Remove Request
      </Button>
    );
  } else {
    friendButton = (
      <Button
        variant="contained"
        color="primary"
        sx={{ mr: 1 }}
        onClick={() => handleFriendshipResponse(isFriend.id, true)}
      >
        Accept Request 
      </Button>
    );
  }
} else if (isFriend.status === 'accepted') {
  friendButton = (
    <Button variant="contained" color="primary" onClick={handleRemoveFriend}>
      Remove Friend
    </Button>
  );
}

const stringToColor = (string) => {
      let hash = 0;
      for (let i = 0; i < string.length; i++) hash = string.charCodeAt(i) + ((hash << 5) - hash);
      let color = '#';
      for (let i = 0; i < 3; i++) color += `00${((hash >> (i * 8)) & 0xff).toString(16)}`.slice(-2);
      return color;
  }

  if( !userData  ) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="md" sx={{ display: 'flex', minHeight: '100vh', pb: 10, pt: 4, justifyContent: 'center' }}>
      
      {/* Navigation Icon */}
      <Tooltip title={"Go back"}>
        <IconButton 
          onClick={handleMessages} 
          sx={{ 
            position: 'fixed', 
            top: '1rem', 
            left: '.6rem', 
            zIndex: 1100,
          }}
        >
          <ArrowBack color="primary" />
        </IconButton>
      </Tooltip>
      

      <Box 
  sx={{ 
    width: '100%', 
    mb: 4, 
    mt: 4, 
    textAlign: 'center', 
    display: 'flex', 
    flexDirection: { xs: 'column', md: 'row' }, // stack on mobile
    justifyContent: 'center', 
    alignItems: 'center',  // center vertically when row, center horizontally when column
    gap: { xs: 1.5, md: 2 }, // responsive spacing
  }}
>
  <Avatar 
    sx={{ 
      width: { xs: 64, md: 100 },  // mobile bigger than before
      height: { xs: 64, md: 100 }, 
      mb: { xs: 1.5, md: 0 },       // margin bottom only for stacked mobile layout
      fontSize: { xs: '1.5rem', md: '2rem' },
      bgcolor: stringToColor(userData?.username || 'U'),
      boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
      cursor: 'pointer' 
    }}
  >
    {userData?.username?.charAt(0).toUpperCase()}
  </Avatar>

  <Typography 
    variant="h4" 
    component="h1" 
    sx={{ 
      fontWeight: 'bold', 
      mx: { xs: 0, md: 2 }, // horizontal margin only on desktop
      mt: { xs: 1, md: 0 }  // top margin only for stacked mobile
    }}
  >
    {userData ? userData.username : 'User'}
  </Typography>

  <Box sx={{ mt: { xs: 1.5, md: 0 } }}>
    {friendButton}
  </Box>
</Box>


      {/* Message List */}
      <Stack spacing={2}>
        {messages.length > 0 ? (
          [...messages].reverse().map((msg, index) => (
            <Card 
              key={index} 
              elevation={2} 
              sx={{ 
                borderRadius: 2,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: 4 }
              }}
            >
              <CardContent>
                {/* Original code had an empty check for name, but logic seemed to be removed in your provided snippet.
                  Keeping structure clean.
                */}
                
                <Typography variant="h6" component="div" sx={{ mb: 1, fontWeight: 'medium' }}>
                  {msg.content}
                </Typography>

                <Typography variant="caption" color="text.secondary" sx={{ userSelect: 'none', display: 'block', textAlign: 'right' }}>
                  {showDate(msg.createdAt)}
                </Typography>
              </CardContent>
            </Card>
          ))
        ) : !loading ? (
            // Empty State
            <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="h5" color="text.secondary">
                    {t("no_messages_found")}
                </Typography>
            </Box>
        ) : null}
      </Stack>

      {/* Scroll to Top Button */}
      <Zoom in={visible}>
        <Box
          role="presentation"
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 1000,
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Fab 
            onClick={scrollToTop} 
            color="default" // Changed to default to allow icon color to pop, or use "primary"
            aria-label="scroll back to top"
            size="medium"
            sx={{ backgroundColor: 'white' }} 
          >
             {isHovered ? (
                <ArrowCircleRightRoundedIcon
                  sx={{
                    transform: 'rotate(-90deg)',
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
          </Fab>
        </Box>
      </Zoom>
    </Container>
  );
};

export default UserProfile;