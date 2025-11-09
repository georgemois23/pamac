import '../App.css';
import React, { useContext} from 'react';
import { Navigate, useNavigate,useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
// import { useState } from 'react';
import { Box, Button, ButtonBase, Container, Typography } from '@mui/material';
import AuthContext from "../AuthContext"; // Import the context
import { useTranslation } from 'react-i18next';
function ContentNotAvaiable() {
  const { t } = useTranslation();
    const navigate = useNavigate();
  const {logout} = useContext(AuthContext);
  document.title='Unauthorized'
  const handleCreateAnAccount = () => {
    logout();
    navigate('/auth/register');
  };

  const location = useLocation();

  useEffect(() => {
    if (location.state?.from !== "redirect") {
      // If accessed manually, send them away
      navigate("/chat", { replace: true }); // Redirect to home or any other page
    }
  }, [location, navigate]);


return(
    <Container sx={{userSelect:'none',}}>
    <Typography variant='h2'>{t("content_registered")}</Typography>
    <br/>
    <Typography>{t("more_feautures")} <span style={{textDecoration:'underline', cursor:'pointer'}}onClick={handleCreateAnAccount} >{t("create_an_account")}</span></Typography>
    <br/>
    {/* <button onClick={handleCreateAnAccount} className='Enter' style={{fontSize:'35px'}} >Create an account</button> */}
    </Container>
  );

}
export default ContentNotAvaiable;