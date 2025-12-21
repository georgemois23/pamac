// import '../App.css';
import React, { useContext} from 'react';
import { Navigate, useNavigate,useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
// import { useState } from 'react';
import { Box, Button, ButtonBase, Container, Typography } from '@mui/material';
import AuthContext from "../AuthContext"; // Import the context
import { useTranslation } from 'react-i18next';
import { ReactComponent as Logo } from '../Polyvox.svg';
function OutOfService() {
  const { t } = useTranslation();
  document.title='Out of Service'
  
  const handleNavigate=()=>{
    window.location.href='https://moysiadis.dev';
  }

  const location = useLocation();
  const size = 250;


return(
    <Container sx={{userSelect:'none',}}>
    <Typography variant='h2'>Website is temporalily out of service</Typography>
    <br/>
     <Logo
          style={{
            width: size * 0.6,   
            height: size * 0.6,  
            position: 'absolute',
            top: '65%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            marginTop:'20px',
          }}
        />
    {/* <Typography>{t("more_feautures")} <span style={{textDecoration:'underline', cursor:'pointer'}}onClick={handleCreateAnAccount} >{t("create_an_account")}</span></Typography> */}
    <br/>
        <Typography sx={{position: 'absolute',
            top: '85%',
            left: '50%',
            transform: 'translate(-50%, -50%)',}}>Visit my portfolio website <span style={{textDecoration:'underline', cursor:'pointer'}}onClick={handleNavigate} >moysiadis.dev</span></Typography>
    {/* <button onClick={handleCreateAnAccount} className='Enter' style={{fontSize:'35px'}} >Create an account</button> */}
    </Container>
  );

}
export default OutOfService;