// import './Login.css';
import  './App.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage({ onLogin }) {
    const [username, setUsername] = useState('');
    const [incognito, setincognito] = useState(false);
    const [signup, setsignup] = useState(false);
    const [login, setlogin] = useState(true);

    const navigate = useNavigate();

    const handleIncognito = (e) => {
      setincognito(true);
      setsignup(false);
      setlogin(false);
      onLogin('');
      navigate('/chat');
      
      // alert('incognito');
    }
    const handlelogin = (e) => {
      setsignup(false);
      setlogin(true);
      setincognito(false);
    }
    const handlesignup = (e) => {
      setsignup(true);
      setlogin(false);
      setincognito(false);
      // alert('signup');
    }
    const handleSubmit = (e) => {
      e.preventDefault();
      if (username!==''){
      onLogin(username);  // Perform the login
      navigate('/chat');  // Redirect to home page
    }
    };
    return(
        <div>
          <div className='choose'>
            {login ? 
            <>
            <h2 onClick={handleIncognito}>Γράψε ανώνυμα</h2>
            <h2 onClick={handlesignup}>Κάνε εγγραφή</h2>
            </>
            : (
              signup ? (
                <>
            <h2 onClick={handleIncognito}>Γράψε ανώνυμα</h2>
            <h2 onClick={handlelogin}>Κάνε login!</h2>
            </>)
            : ''
             )}
          {/* <h2 onClick={handleIncognito}>Γράψε ανώνυμα</h2>
          <h2 onClick={handlesignup}>Κάνε εγγραφή</h2> */}
          </div>
          <div className='Login'>
          {login ?
          <>
            <h1>Κάνε Login!</h1>
            <form onSubmit={handleSubmit}>
            <label html For='username'>Username:</label>
            <input
          id='username'
          className='username'
          type='text'
          maxLength={12}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
            <label htmlFor='password'>Password:</label>
            <input className='username' type='password'/>
            <button className='sub' type='submit'>Log In</button>
          

            </form>
            </>
            :
            ''
            } 
            {signup ?
            <>
            <h1>Κάνε εγγραφή!</h1>
            <form onSubmit={handleSubmit}>
            <label html For='username'>Username:</label>
            <input
          id='username'
          className='username'
          type='text'
          maxLength={12}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
            <label htmlFor='password'>Password:</label> 
             <input className='username' type='password' maxLength={16}/>
            <button className='sub' type='submit'>Sign Up</button>
          

            </form>
            </>
            :''} 
        </div>
        </div>
    )
}
export default LoginPage;