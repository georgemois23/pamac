import React, { useEffect } from 'react';
import { Box, Typography, Link, GlobalStyles } from '@mui/material';
import { ReactComponent as Logo } from '../Polyvox.svg';

function OutOfService() {
  document.title = 'Out of Service';
  const size = 250;

  const handleNavigate = () => {
    window.location.href = 'https://moysiadis.dev';
  };

  return (
    <>
      {/* This injects CSS to prevent scrolling on the body/html level */}
      <GlobalStyles styles={{ 
        body: { overflow: 'hidden' }, 
        html: { overflow: 'hidden' } 
      }} />

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={3}
        p={{ xs: 2, sm: 4 }}
        // Using 100vh ensures it fills the screen exactly
        height="100vh" 
        width="100vw"
        sx={{ 
          userSelect: 'none', 
          textAlign: 'center',
          overflow: 'hidden', // Prevents internal scrolling
          position: 'fixed', // Fixes it to the viewport
          top: 0,
          left: 0
        }}
      >
        <Logo
          style={{
            width: size * 0.6,
            height: size * 0.6,
            cursor: 'pointer',
            marginBottom: '10px',
          }}
          onClick={handleNavigate}
        />

        <Typography
          variant="h5"
          sx={{ 
            fontWeight: "bold", 
            fontSize: { xs: "1.4rem", sm: "1.6rem", md: "1.8rem" },
            maxWidth: "500px" 
          }}
        >
          Website is temporarily out of service
        </Typography>

        <Typography
          variant="body2"
          sx={{
            maxWidth: { xs: "90%", sm: "400px" },
            fontSize: { xs: "0.85rem", sm: "0.9rem" },
          }}
        >
          We are performing some maintenance. In the meantime, feel free to check out my other work.
        </Typography>

        <Box
          sx={{
            mt: 1,
            p: 2,
            width: { xs: "80%", sm: "350px" },
          }}
        >
          <Typography variant="body1">
            Visit my portfolio:{" "}
            <Link
              component="button"
              variant="body1"
              onClick={handleNavigate}
              sx={{
                textDecoration: 'underline',
                fontWeight: 'bold',
                color: 'primary.main',
                verticalAlign: 'baseline'
              }}
            >
              moysiadis.dev
            </Link>
          </Typography>
        </Box>
      </Box>
    </>
  );
}

export default OutOfService;