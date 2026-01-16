// import '../App.css';
import { useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ReactComponent as Logo } from '../Polyvox.svg';
import errorSvg from '../assets/404.svg';

function ErrorPage() {
  const { t } = useTranslation();
  document.title = `Polyvox | ${t('not_found')}`;
  localStorage.setItem('enter', 'false');
  const navigate = useNavigate();
  
  const goBack = () => {
    navigate('/');
    document.title = 'Polyvox';
  };
  
  const isMobile = window.innerWidth < 600;
  const size = isMobile ? window.innerWidth * 0.32 : window.innerWidth * 0.25;

  return (
    <Container
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        userSelect: 'none',
        gap: 1,
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Background Logo */}
      <Logo
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: size * 2.5,         
          height: size * 2.5,
          opacity: 0.05,           
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',    
          zIndex: 0,
        }}
      />

      {/* Foreground content */}
      <Typography variant='h2' sx={{ zIndex: 2, backgroundColor: 'transparent' }}>
        {t("not_found")} :(
      </Typography>

      <img
        style={{ display: 'block', width: '200px', zIndex: 2, backgroundColor: 'transparent'}}
        draggable={false}
        src={errorSvg}
        alt="404"
      />

      <button
        style={{
            border: '1px solid',
            borderRadius: '10px',
            height: 'fit-content',
            padding: '10px 10px',
            cursor: 'pointer',
             zIndex: 2,
             background: 'none',
             fontSize: '16px',
              color: 'inherit',
        }}
        onClick={goBack}
      >
        {t("visit_home_page")}
      </button>
    </Container>
  );
}

export default ErrorPage;
