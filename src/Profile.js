import './App.css';
import React, { useContext} from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
// import { useState } from 'react';
import { Box, Button, ButtonBase, Container, Typography } from '@mui/material';
import e from 'cors';
import AuthContext from "./AuthContext"; // Import the context
import ContentNotAvaiable from './ContentNotAvailable';
function Profile({user}) {
  const {logout} = useContext(AuthContext);
  const navigate = useNavigate();
  document.title='Profile'
  const handleCreateAnAccount = () => {
    logout();
  };

  const InfoBox = ({ label, value, fallback }) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '0.5rem'
      }}
    >
      <Typography variant="p">{label}:</Typography>
  
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid',
          borderColor: 'text.primary',
          borderRadius: '15px',
          padding: '1rem',
          minHeight: '3rem'
        }}
      >
        <Typography variant="span" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          {value ?? (
            <>
              <Typography component="span" variant="inherit" sx={{ fontStyle: 'italic' }}>
                {fallback}
              </Typography>{' '}
              has not provided any {label.toLowerCase()} yet
            </>
          )}
        </Typography>
      </Box>
    </Box>
  );

//   if(incognito){
//     return <ContentNotAvaiable/>;
//   }
// else{
    return(
    <Container sx={{
        display: 'flex',
        flexDirection: 'column',  // Ensures elements stack vertically
        alignItems: 'center',      // Center items horizontally
        height: '100vh',           // Full height of the viewport
        textAlign: 'center',       // Center text alignment
    }}>
           <Typography
                        variant='h3'
                        sx={{
                            fontFamily: "Advent Pro",
                            textAlign: 'center', // Center text within the Typography
                            maxWidth: '500px',   // Limit the maximum width
                            width: '60%',       // Allow it to take full width up to maxWidth
                            mb: 2,
                            marginTop: '1rem'
                        }}
                    // >
                    >
            Hello{user.username ? ' '+user.username+'!' : '!'}
            </Typography>


            <Container sx={{display:'flex', gap:'1rem',flexDirection:'column', width:'fit-content'}}>
            <Box 
  sx={{
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'center',  // Ensures vertical alignment
    gap: '0.5rem' // Adjusts spacing between "Email:" and the box
  }}
>
  <Typography variant='p'>Username:</Typography>
  
  <Box
    sx={{
      display: 'flex', 
      alignItems: 'center', // Centers content inside
      justifyContent: 'center', // Centers text horizontally
      border: '2px solid', 
      borderColor: 'text.primary', 
      borderRadius: '15px', 
      padding: '1rem',
      minHeight: '3rem' // Ensures a consistent height
    }}
  >
    <Typography variant='span' sx={{ fontWeight: 'bold', textAlign: 'center' }}>
      {user.username ? user.username : "Username is currently not available :("}
    </Typography>
  </Box>
</Box>
<Box 
  sx={{
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'center',  // Ensures vertical alignment
    gap: '0.5rem' // Adjusts spacing between "Email:" and the box
  }}
>
  <Typography variant='p'>Email:</Typography>
  
  <Box
    sx={{
      display: 'flex', 
      alignItems: 'center', // Centers content inside
      justifyContent: 'center', // Centers text horizontally
      border: '2px solid', 
      borderColor: 'text.primary', 
      borderRadius: '15px', 
      padding: '1rem',
      minHeight: '3rem' // Ensures a consistent height
    }}
  >
    <Typography variant='span' sx={{ fontWeight: 'bold', textAlign: 'center' }}>
      {user.email ? user.email :  <>
      <Typography component="span" variant="inherit" sx={{ fontStyle: 'italic' }}>
        {user.username}
      </Typography>
      {' has not provided any email yet'}
    </>}
    </Typography>
  </Box>
</Box>
<Box 
  sx={{
    display: 'flex', 
    flexDirection: 'row', 
    alignItems: 'center',  // Ensures vertical alignment
    gap: '0.5rem' // Adjusts spacing between "Email:" and the box
  }}
>
  <Typography variant='p'>Full name:</Typography>
  
  <Box
    sx={{
      display: 'flex', 
      alignItems: 'center', // Centers content inside
      justifyContent: 'center', // Centers text horizontally
      border: '2px solid', 
      borderColor: 'text.primary', 
      borderRadius: '15px', 
      padding: '1rem',
      minHeight: '3rem' // Ensures a consistent height
    }}
  >
    <Typography variant='span' sx={{ fontWeight: 'bold', textAlign: 'center' }}>
      {user.full_name ? user.full_name : `${user.username} has not provide full name yet`}
    </Typography>
  </Box>
  
</Box>
{/* <InfoBox label="Email" value={user.email} fallback={user.username} />
<InfoBox label="Full name" value={user.full_name} fallback={user.username} /> */}
        </Container>
    </Container>



);

} 
// }

export default Profile;