// import './Login.css';
// import  './App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ onLogin }) {
    const [username, setUsername] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (e) => {
      e.preventDefault();
      if (username!==''){
      onLogin(username);  // Perform the login
      navigate('/chat');  // Redirect to home page
    }
    };
    return(
        <div className='Login'>
            <h1>Κάνε Login!</h1>
            <form onSubmit={handleSubmit}>
            <label htmlFor='username'>Username:</label>
            <input
          id='username'
          className='username'
          type='text'
          maxLength={12}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
            {/* <label htmlFor='password'>Password:</label> */}
            {/* <input type='password'/> */}
            <button className='sub' type='submit'>Log In</button>


            </form>
        </div>
    )
}
export default LoginPage;