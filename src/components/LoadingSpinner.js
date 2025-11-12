import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { ReactComponent as Logo } from '../Polyvox.svg';

const isMobile = window.innerWidth < 910;
const size1 = isMobile ? 190 : 200;

const LoadingSpinner = ({ size = size1, color = 'primary', message  }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        opacity: 0,
        animation: 'fadeIn 0.3s forwards',
        '@keyframes fadeIn': {
          to: { opacity: 1 },
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: size,
          height: size,
        }}
      >
        <CircularProgress
          size={size}
          color={color}
          thickness={size / 200}
          sx={{ position: 'absolute', top: 0, left: 0 }}
        />
        <Logo
          style={{
            width: size * 0.6,
            height: size * 0.6,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </Box>
      {message && (
        <Box
          sx={{
            marginTop: 4, 
            fontSize: isMobile ? '1rem' : '1.2rem',
            textAlign: 'center',
            color: 'text.primary',
          }}
        >
          {message}
           <Box
            component="span"
            sx={{
              opacity: 0,
              animation: 'slowFade 2.5s forwards infinite',
              '@keyframes slowFade': {
                to: { opacity: 1 },
              },
            }}
          >...</Box>
        </Box>
      )}
    </Box>
  );
};

export default LoadingSpinner;
