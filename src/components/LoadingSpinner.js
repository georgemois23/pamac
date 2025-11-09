import React from 'react';
import { CircularProgress, Box } from '@mui/material';
import { ReactComponent as Logo } from '../Polyvox.svg';

const LoadingSpinner = ({ size = 200, color = 'primary' }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
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
    </Box>
  );
};

export default LoadingSpinner;
