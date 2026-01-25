import React, { useEffect,useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ReactComponent as Logo } from '../Polyvox.svg';
function Logout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [allowed, setAllowed] = useState(false);
  const { t } = useTranslation();
  document.title = "Logged out! • Polyvox";
    const size = 250;
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
        gap: '10vh',
        justifyContent: 'center', // Centers the first content
        userSelect: 'none', // Prevents text selection
      }}
    >
      {/* Centered Logged-Out Message */}
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
        {t('logged_out')}
      </Typography>
  
      {/* Box to move the "Changed your mind?" and buttons to the bottom with padding */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          position: 'absolute',
          bottom: '20px', // This moves the content to the bottom, but not flush
          paddingBottom: '2rem', // Adds some space from the very bottom
          width: '100%', // Ensures it takes full width
          alignItems: 'center', // Centers the content horizontally
        }}
      >
        {/* "Changed your mind?" text */}
        <Typography variant='body2'>{t("changed_mind")}</Typography>
  
        {/* Buttons Box */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '2rem',
          }}
        >
          {/* Go to login page button */}
          <Typography
            variant="body1"
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
            onClick={handleCreateAnAccount}
          >
            {t('go_to_login_page')}
          </Typography>
  
          {/* Go to messages button */}
          {/* <Typography
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
            {t('view_messages')}
          </Typography> */}
        </Box>
        
      </Box>
       <Logo
              style={{
                width: size * 0.6,
                height: size * 0.6,
                position: 'absolute',
                top: '15%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                marginTop: '20px',
              }}
              onClick={() => navigate('/auth')}
            />
    </Container>
  );
  
  
  
}

export default Logout;
