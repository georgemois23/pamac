import React, { useEffect,useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';

function Logout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [allowed, setAllowed] = useState(false);
  document.title = 'Logged out successfully!';

  const handleCreateAnAccount = () => {
    navigate('/auth/login');
  };

  const handleGoToMessages = () => {
    navigate('/messages');
  };

  
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        gap: '8vh',
        justifyContent: 'center'
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontFamily: 'Advent Pro',
          textAlign: 'center',
          maxWidth: '500px',
          width: '60%',
          marginTop: '1rem',
        }}
      >
       You're now logged out. See you again soon!
      </Typography>
      <Typography variant='h6'>Changed your mind?</Typography>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '2rem',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            cursor: 'pointer',
            border: '2px solid ',
            borderRadius: '12px',
            padding: '0.4rem 1rem',
            transition: 'all 0.3s ease',
            '&:hover': {
                backgroundColor: '#a4c2f4',
                color: '#001f3f',
            },
          }}
          onClick={handleCreateAnAccount}
        >
          Go to login page
        </Typography>

        <Typography
          variant="h6"
          sx={{
            cursor: 'pointer',
            border: '2px solid',
            borderRadius: '12px',
            padding: '0.4rem 1rem',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#a4c2f4',
              color: '#001f3f',
            },
          }}
          onClick={handleGoToMessages}
        >
          Go to messages
        </Typography>
      </Box>
    </Container>
  );
}

export default Logout;
