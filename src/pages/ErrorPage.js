import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ReactComponent as Logo } from '../Polyvox.svg';
import errorSvg from '../assets/404.svg';

function ErrorPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Side effects
  document.title = `Polyvox • ${t('not_found')}`;
  localStorage.setItem('enter', 'false');

  const goBack = () => {
    navigate('/');
    document.title = 'Polyvox';
  };

  return (
    <Container
      component="main"
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        gap: 3,
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Background Logo - Using SX for responsiveness instead of manual JS math */}
      <Box
        component={Logo}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: { xs: '75vw', md: '60vw' },
          height: 'auto',
          opacity: 0.04,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 0,
          color: 'text.primary', // Inherits theme color
        }}
      />

      {/* Foreground Content */}
      <Box sx={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Box
          component="img"
          src={errorSvg}
          alt="404"
          draggable={false}
          sx={{
            width: { xs: 100, md: 140 },
            opacity: 0.8,
            filter: 'grayscale(1)',
          }}
        />

        <Box>
          <Typography
            variant="h5" // Smaller than h2 for that minimalist look
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 1,
              letterSpacing: '-0.02em',
            }}
          >
            {t('not_found')}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 300, mx: 'auto', mb: 1 }}
          >
            The page you're looking for doesn't exist or has been moved.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={goBack}
          sx={{
            textTransform: 'none',
            borderRadius: '10px',
            px: 4,
            py: 1,
            borderColor: 'divider',
            color: 'text.primary',
            fontWeight: 600,
            '&:hover': {
              borderColor: 'text.primary',
              backgroundColor: 'rgba(0,0,0,0.03)',
            },
          }}
        >
          {t('go_back')} {/* Using translation for the button too */}
        </Button>
      </Box>
    </Container>
  );
}

export default ErrorPage;