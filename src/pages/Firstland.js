import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ReactComponent as PolyvoxLogo } from '../Polyvox.svg';
import '../App.css';

function FirstLand() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const hasReloaded = localStorage.getItem('hasReloaded');
    if (!hasReloaded) {
      localStorage.setItem('hasReloaded', 'true');
      window.location.reload();
    }
  }, []);

  const handleEnter = () => {
    localStorage.setItem('enter', 'true');
    navigate('/auth');
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'background.default',
        textAlign: 'center',
        px: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '900px',
          gap: 5,
        }}
      >
        {/* Inline headline (real inline flow, not flexbox) */}
        <Typography
          variant="h2"
          sx={{
            fontFamily: 'Advent Pro',
            fontWeight: 600,
            fontSize: { xs: '1.8rem', sm: '2.3rem', md: '2.8rem' },
            lineHeight: 1.3,
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          <span>Welcome to </span>
          <Box
            component={PolyvoxLogo}
            alt="Polyvox Logo"
            draggable="false"
            sx={{
              display: 'inline-block',
              width: { xs: '110px', sm: '140px', md: '180px' },
              height: 'auto',
              verticalAlign: 'middle', 
              transform: 'translateY(-2px)', 
            }}
          />
          <span> an open chat wall designed for freedom. Join instantly, sign up to build your identity.</span>
        </Typography>

      

        <Button
          variant="contained"
          onClick={handleEnter}
          sx={{
            fontSize: { xs: '.9rem', sm: '1.05rem' },
            fontFamily: 'Advent Pro',
            textTransform: 'uppercase',
            // px: 5,
            py: 1.4,
            borderRadius: '8px',
            boxShadow: 'none',
            transition: 'transform 0.2s ease',
            '&:hover': { transform: 'translateY(-2px)' },
          }}
        >
          {t('enter')}
        </Button>
      </Box>
    </Container>
  );
}

export default FirstLand;
