import './App.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { useState } from 'react';


function FirstLand({ OnEnter }) {
    const navigate = useNavigate();
    const handleEnter = () => {
        OnEnter();
        navigate('/login');  // Navigate to the login page
        
      };
    
return(
    <div className='First'>
        <h1 className='greet'>ΚΑΛΩΣ ΗΡΘΕΣ ΣΤΟΝ ΑΝΩΝΥΜΟ ΚΟΣΜΟ </h1>
        <button className='Enter' onClick={handleEnter}>Enter</button>
    </div>
);
}
export default FirstLand;




