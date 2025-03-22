import './App.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
// import { useState } from 'react';
import { Container, Typography } from '@mui/material';

function FirstLand() {
    const handleBeforeUnload = () => {
        // localStorage.removeItem('username');
        // localStorage.removeItem('enter');  
        window.location.reload();                         
      };
  
      useEffect(() => {
        // Check if the reload flag exists in localStorage
        const hasReloaded = localStorage.getItem("hasReloaded");
    
        // If the flag doesn't exist, set it and reload the page
        if (!hasReloaded) {
          localStorage.setItem("hasReloaded", "true");
          window.location.reload();
        }
      }, []);

    const navigate = useNavigate();
    const handleEnter = () => {
        // OnEnter();
        navigate('/login');  // Navigate to the login page
        
      };


return(
    // <Container className='First'>
    
    <Container
            // spacing={{ xs: 3, sm: 3, md: 3, l: 3 }}
            sx={{
                display: 'flex',
                flexDirection: 'column',  // Ensures elements stack vertically
                justifyContent: 'center',  // Center items vertically
                alignItems: 'center',      // Center items horizontally
                height: '100vh',           // Full height of the viewport
                textAlign: 'center',       // Center text alignment
            }}
        >
            <Typography
                variant='h3'
                sx={{
                    fontFamily: "Advent Pro",
                    textAlign: 'center', // Center text within the Typography
                    maxWidth: '500px',   // Limit the maximum width
                    width: '60%',       // Allow it to take full width up to maxWidth
                    mb: 2,
                }}
            // >
            >
    {/* ΚΑΛΩΣ ΗΡΘΕΣ ΣΤΟΝ ΑΝΩΝΥΜΟ ΚΟΣΜΟ </Typography> */}
    Welcome to the anonymous world! </Typography>
        {/* <button className='Enter' onClick={handleEnter}>Enter</button> */}
        {/* <Button  className='Enter' onClick={handleEnter}>Enter</Button> */}
        <button
                variant="contained"
                onClick={handleEnter}
                className='Enter'
            >
                Enter
            </button>
        {/* <Button sx={{color: "text.primary", bgcolor: 'background.default', '&:hover': {
              bgcolor: "text.primary", color: 'background.default'
          },'&:focus, &:active': {         // Additional focus/active state for clarity
          bgcolor: 'text.primary',
          color: 'background.default',
       }}}onClick={handleEnter} >Enter</Button> */}
    </Container>
);
}
export default FirstLand;




