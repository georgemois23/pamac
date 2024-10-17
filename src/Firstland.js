import './App.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';
import { Button, ButtonBase, Container, Typography } from '@mui/material';


function FirstLand({ OnEnter }) {
    const navigate = useNavigate();
    const handleEnter = () => {
        OnEnter();
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
                    maxWidth: '600px',   // Limit the maximum width
                    width: '70%',       // Allow it to take full width up to maxWidth
                    mb: 2,
                }}
            >
    ΚΑΛΩΣ ΗΡΘΕΣ ΣΤΟΝ ΑΝΩΝΥΜΟ ΚΟΣΜΟ </Typography>
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




