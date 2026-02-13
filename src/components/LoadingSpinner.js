import React, { useEffect, useState } from 'react';
import { CircularProgress, Box } from '@mui/material';
import { ReactComponent as Logo } from '../Polyvox.svg';

const isMobile = window.innerWidth < 910;
const size1 = isMobile ? 190 : 200;

// tweak here if you want
const SHOW_DELAY_MS = 250;

const LoadingSpinner = ({
  size = size1,
  color = 'primary',
  message,
  fullscreen = true,
}) => {
  const [visible, setVisible] = useState(false);

  // Delay showing to avoid flicker
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  // Lock scroll only when fullscreen AND actually visible
  useEffect(() => {
    if (!fullscreen || !visible) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev || 'unset';
    };
  }, [fullscreen, visible]);

  if (!visible) return null;

  return (
    <Box
      sx={{
        position: fullscreen ? 'fixed' : 'absolute',
        inset: 0,
        width: fullscreen ? '100vw' : '100%',
        height: fullscreen ? '100vh' : '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        backdropFilter: 'blur(50px)',
        WebkitBackdropFilter: 'blur(50px)',
        zIndex: fullscreen ? 9999 : 1,
        touchAction: fullscreen ? 'none' : 'auto',
        opacity: 0,
        animation: 'fadeIn 0.3s forwards',
        '@keyframes fadeIn': { to: { opacity: 1 } },
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
              '@keyframes slowFade': { to: { opacity: 1 } },
            }}
          >
            ...
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default LoadingSpinner;
