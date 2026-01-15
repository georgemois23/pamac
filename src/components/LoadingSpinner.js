import React, { useEffect } from 'react'; // 1. Import useEffect
import { CircularProgress, Box } from '@mui/material';
import { ReactComponent as Logo } from '../Polyvox.svg';

const isMobile = window.innerWidth < 910;
const size1 = isMobile ? 190 : 200;

const LoadingSpinner = ({ size = size1, color = 'primary', message  }) => {
  
  // 2. Add this Hook to Lock Scrolling
  useEffect(() => {
    // Disable scrolling on the body
    document.body.style.overflow = 'hidden';

    // Re-enable scrolling when this component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent', 
        backdropFilter: 'blur(50px)', 
        WebkitBackdropFilter: 'blur(50px)', 
        zIndex: 9999,
        // Added touch-action none for extra mobile safety
        touchAction: 'none', 
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress
          size={size}
          color={color}
          thickness={size / 200}
          sx={{ position: 'absolute' }} 
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
            marginTop: 6, 
            fontSize: isMobile ? '1rem' : '1.2rem',
            textAlign: 'center',
            color: 'text.primary',
            textShadow: '0 2px 10px rgba(0,0,0,0.1)', 
            fontWeight: 500,
            maxWidth: '80%',
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