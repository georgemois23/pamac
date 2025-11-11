import '../App.css';
import React, { useContext} from 'react';
import { Navigate, useNavigate,useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
// import { useState } from 'react';
import { Box, Button, ButtonBase, Container, Typography } from '@mui/material';
import AuthContext from "../AuthContext"; // Import the context
import { useTranslation } from 'react-i18next';
function OutOfService() {
  const { t } = useTranslation();
  document.title='Out of Service'
  

  const location = useLocation();



return(
    <Container sx={{userSelect:'none',}}>
    <Typography variant='h2'>Website is temporalily out of service</Typography>
    <br/>
    {/* <Typography>{t("more_feautures")} <span style={{textDecoration:'underline', cursor:'pointer'}}onClick={handleCreateAnAccount} >{t("create_an_account")}</span></Typography> */}
    <br/>
    {/* <button onClick={handleCreateAnAccount} className='Enter' style={{fontSize:'35px'}} >Create an account</button> */}
    </Container>
  );

}
export default OutOfService;