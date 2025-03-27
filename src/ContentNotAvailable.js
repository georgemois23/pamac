import './App.css';
import React, { useContext} from 'react';
import { Navigate, useNavigate,useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
// import { useState } from 'react';
import { Box, Button, ButtonBase, Container, Typography } from '@mui/material';
import AuthContext from "./AuthContext"; // Import the context
function ContentNotAvaiable() {
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
    <Container>
    <Typography variant='h2'>Content is only available to registered users, not anonymous users!</Typography>
    <br/>
    <Typography>If you want to access more features of this website, please <span style={{textDecoration:'underline', cursor:'pointer'}}onClick={handleCreateAnAccount} >create an account.</span></Typography>
    <br/>
    {/* <button onClick={handleCreateAnAccount} className='Enter' style={{fontSize:'35px'}} >Create an account</button> */}
    </Container>
  );

}
export default ContentNotAvaiable;