import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Link, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ReactComponent as PolyvoxLogo } from '../Polyvox.svg';
import { InfoOutlined } from '@mui/icons-material';

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
        alignItems: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        px: 2,
        py: 3, // Added padding so footer doesn't touch the very edge
      }}
    >
      {/* 1. This Box wraps the main content and stays centered */}
      <Box
        sx={{
          flexGrow: 1, // Takes up available space to push footer down
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', // Centers content vertically
          alignItems: 'center',
          width: '100%',
          maxWidth: '900px',
          gap: 5,
          userSelect: 'none',
        }}
      >
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
            py: 1.4,
            px: 4,
            borderRadius: '8px',
            boxShadow: 'none',
            transition: 'transform 0.2s ease',
            '&:hover': { transform: 'translateY(-2px)' },
          }}
        >
          {t('enter')}
        </Button>
      </Box>

      {/* 2. Footer Typography: mt: 'auto' pushes it to the bottom */}
      <Typography
        variant="body2"
        sx={{
          mt: 'auto', // Pushes element to the bottom of the flex container
          fontFamily: 'Advent Pro',
          color: 'text.secondary',
          maxWidth: '600px',
        }}
      >
        <InfoOutlined fontSize="xs" sx={{ verticalAlign: 'middle', mr: 0.5, mb:0.5 }} />
        Developed by{' '}
  <Link
    href="https://moysiadis.dev"
    target="_blank"           // Opens in new tab
    rel="noopener noreferrer" // Security best practice
    underline="hover"         // Only shows underline on hover
    sx={{
      // color: 'primary.main',   // Uses your theme's primary color
      fontWeight: 600,
    }}
  >
    George Moysiadis
  </Link>.
      </Typography>
    </Container>
  );
}

export default FirstLand;