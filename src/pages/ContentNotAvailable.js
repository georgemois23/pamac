import '../App.css';
import React, { useContext} from 'react';
import { Navigate, useNavigate,useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
// import { useState } from 'react';
import { Box, Button, ButtonBase, Container, Typography } from '@mui/material';
import AuthContext from "../AuthContext"; // Import the context
import { useTranslation } from 'react-i18next';
import { ReactComponent as Logo } from '../Polyvox.svg';
function ContentNotAvaiable() {
  const { t } = useTranslation();
    const navigate = useNavigate();
  const {logout} = useContext(AuthContext);
  document.title='Unauthorized'
  const handleCreateAnAccount = () => {
    logout();
    navigate('/auth/register');
  };

  const isMobile = window.innerWidth < 600;
const size = isMobile ? window.innerWidth * 0.35 : window.innerWidth * 0.17; // smaller

  const location = useLocation();

  useEffect(() => {
    if (location.state?.from !== "redirect") {
      // If accessed manually, send them away
      navigate("/chat", { replace: true }); // Redirect to home or any other page
    }
  }, [location, navigate]);


return(
    <Container sx={{userSelect:'none', height: '100vh', maxHeight: '100vh', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:2}}>
      <Logo
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: size * 3,         
          height: size * 2,
          opacity: 0.05,           
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',    
          zIndex: 0,
        }}
      />
    <Typography variant='h2'>{t("content_registered")}</Typography>
    <br/>
    <Typography>{t("more_feautures")} <Box component={'span'} style={{textDecoration:'underline', cursor:'pointer'}}onClick={handleCreateAnAccount} >{t("create_an_account")}</Box></Typography>
    <br/>
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
    opacity: 1,         
  }}
  onClick={() => navigate(-1)}
>
  {t("go_back")}
</button>
    {/* <button onClick={handleCreateAnAccount} className='Enter' style={{fontSize:'35px'}} >Create an account</button> */}
    </Container>
  );

}
export default ContentNotAvaiable;