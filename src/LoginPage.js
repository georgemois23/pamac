// Import necessary modules
import './App.css';
import { usePopUp } from './App'; 
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { Icon } from 'react-icons-kit';
// import { eyeOff } from 'react-icons-kit/feather/eyeOff';
// import { eye } from 'react-icons-kit/feather/eye';
import PopUps from './PopUps';
import supabase from './config/supabaseClient';
import ThemeOption from './ThemeOption';
import axios from './api/axios';

function LoginPage({ onLogin }) {

  const showPopUp = usePopUp();

  
  const [username, setUsername] = useState('');
  const [incognito, setincognito] = useState(false);
  const [signup, setsignup] = useState(false);
  const [login, setlogin] = useState(true);

  const [errormessage, setErrormessage] = useState('');
  const [password, setPassword] = useState('');
  const [type, setType] = useState('password');
  // const [icon, setIcon] = useState(eyeOff);
  const [typepassword, setTypepassword] = useState(false);

  const handleToggle = () => {
    if (type === 'password') {
      // setIcon(eye);
      setType('text');
    } else {
      // setIcon(eyeOff);
      setType('password');
    }
  };
  
  const handleUsernameChange = (e) => {
    // setUsername(e.target.value.replace(/\s/g, ''));
    setErrormessage("");
    // input.value = input.value.replace(/[^a-zA-Z0-9]/g, '');
    if (/[^a-zA-Z0-9]/.test(e.target.value)) {
      setErrormessage('*Only letters and numbers are allowed in username*')
    }  
    setUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, ''));
  };
  const handlePasswordChange = (e) => {
    // Prevent whitespace by replacing spaces with an empty string
    setTypepassword(true);
    setErrormessage("");
    setPassword(e.target.value.replace(/\s/g, ''));
    setPassword(e.target.value);
  };

  const handleKeyDown = (e) => {
    // Block space and tab keys
    if (e.key === ' ' || e.key === 'Tab') {
      e.preventDefault();
    }
  };
  const navigate = useNavigate();

  const handleIncognito = () => {
    setErrormessage("");
    setincognito(true);
    setsignup(false);
    setlogin(false);
    onLogin('');
    navigate('/chat');
    document.title='Chat';
  };

  const handlelogin = () => {
    document.title='Login';
    setErrormessage("");
    setsignup(false);
    setlogin(true);
    setincognito(false);
  };

  const handlesignup = () => {
    document.title='Signup';
    setErrormessage("");
    setsignup(true);
    setlogin(false);
    setincognito(false);
  };

  const handleLoginbutton = async(e) => {
    e.preventDefault();
    // try {
      // await axios.post('http://localhost:8000/login', {username,password})
    // } catch (error) {
      // console.log(error);
    // }
    onLogin(username); // Perform the login
      
    navigate('/chat'); // Redirect to home page

  }
  const handleSignUp = async (e) => {
    e.preventDefault();
    // try {
      // await axios.post('http://localhost:8000/register', {username,password})
    // } catch (error) {
      // console.log(error);
    // }

    onLogin(username); // Perform the login
    navigate('/chat');
     {/*
    const {data,error} = await supabase
    .from('user1')
    .insert([User])
  
  if(error){
    setErrormessage('This username already exists');
  }

  

fetch(`${supabaseUrl}/rest/v1/user1`, {
  method: 'POST',
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${supabasePublicKey}`, // Include your Supabase public key
    "Accept": "application/json"
  },
  body: JSON.stringify(User) // User object should contain the data you want to send
})
.then(response => {
  if (!response.ok) {
    if (response.status === 409 || response.status === 401) {
      setErrormessage("* This username already exists *");
      console.log('This username already exists');
      return;  // Stop further execution if the username exists
    } else {
      console.log(`Request failed with status: ${response.status}`);
      setErrormessage(`Request failed with status: ${response.status}`);
      return;  // Stop further execution for other failed statuses
    }
  }
  
  // If the response is successful, return the JSON data
  return response.json(); // This will now correctly parse the JSON response
})
.then(data => {
  if (data) {
    console.log("User added successfully:", data);
    onLogin(username); // Perform the login
    navigate('/chat'); // Redirect to the chat page
  }
})
.catch(error => {
  console.error("There was an error:", error.message);
  setErrormessage("Unexpected error: " + error.message);
});

    // fetch("http://localhost:8080/user/add",{
    //   method:'POST',
    //   headers:{"Content-Type":"application/json"},
    //   body:JSON.stringify(User)
    // })
    // .then(response => {
    //   if (!response.ok) {
    //     if (response.status === 409 || response.status === 401) {
    //       setErrormessage("* This username already exists *");
    //       console.log('This username already exists');
    //       return;  // Stop further execution if the username exists
    //     } else {
    //       console.log(`Request failed with status: ${response.status}`);
    //       setErrormessage(`Request failed with status: ${response.status}`);
    //       return;  // Stop further execution for other failed statuses
    //     }
    //   }
      
    //   // If the response is successful, return the JSON data
    //   return response.json(); // This will now correctly parse the JSON response
    // })
    // .then(data => {
    //   if (data) {
    //     console.log("User added successfully:", data);
    //     onLogin(username); // Perform the login
    //     navigate('/chat'); // Redirect to the chat page
    //   }
    // })
    // .catch(error => {
    //   console.error("There was an error:", error.message);
    //   setErrormessage("Unexpected error: " + error.message);
    // });

    */}
  }
  return (
    <div>
      <ThemeOption/>
      <div className="choose">
        {login ? (
          <>
            {/* <h2 onClick={handleIncognito}>Γράψε ανώνυμα</h2> */}
            <h2 onClick={handleIncognito}>Go incognito</h2>
            {/* <h2 onClick={handlesignup}>Κάνε εγγραφή</h2> */}
            <h2 onClick={handlesignup}>Sign up</h2>
          </>
        ) : signup ? (
          <>
            <h2 onClick={handleIncognito}>Go incognito</h2>
            <h2 onClick={handlelogin}>Log in</h2>
          </>
        ) : (
          ''
        )}
      </div>
      <div className="Login">
        {login ? (
          <>
            <h1>Log in!</h1>
            
            <form onSubmit={handleLoginbutton}>
              <label htmlFor="username">Username: {errormessage!=='' ? <div className='ERROR'>{errormessage}</div> : null}</label>
              <input
                id="username"
                className="username"
                type="text"
                maxLength={12}
                value={username}
                onChange={handleUsernameChange}
              />
              <label htmlFor="password">Password:</label>
              <div className="password-container">
                <input
                  className="username password-input"
                  type={type}
                  value={password}
                  onChange={handlePasswordChange}
                  onKeyDown={handleKeyDown}
                  maxLength={12}
                  
                />
                <span className="password-icon" onClick={handleToggle}>
                  {/* <Icon icon={icon} size={12} /> */}
                </span>
              </div>
              <button disabled={(!username || !password)} className="sub" type="submit">
                Log In
              </button>
            </form>
          </>
        ) : (
          ''
        )}
        {signup ? (
          <>
            <h1>Sign up!</h1>
            {errormessage!=='' ? <h4 className='ERROR'>{errormessage}</h4> : null}
            <form onSubmit={handleSignUp}>
              <label htmlFor="username">Username:</label>
              <input
                id="username"
                className="username"
                type="text"
                maxLength={12}
                value={username}
                // onChange={(e) => setUsername(e.target.value)}
                onChange={handleUsernameChange}
              />
              <label htmlFor="password">Password:</label>
              <div className="password-container">
                <input
                  className="username password-input"
                  type={type}
                  value={password}
                  onChange={handlePasswordChange}
                  onKeyDown={handleKeyDown}
                  maxLength={12}
                />
               <span className="password-icon" onClick={handleToggle}>
                  {/* <Icon icon={icon} size={12} /> */}
                </span>
              </div>
              <button disabled={(!username || !password)} className="sub" type="submit">
                Sign Up
              </button>
            </form>
          </>
        ) : (
          null
        )}
      </div>
    </div>
  );
}

export default LoginPage;
