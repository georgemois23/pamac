import './App.css';
import React, { useState } from 'react';
import Chat from './Chat';
function Home({name , onMessage }){
    const [message, setMessage] = useState('');
    const handleMessage = (message) => {
        setMessage(message);
        onMessage(message);  // Store the message
      };
return(

    <div className='First'>
        {/* <h1>Hello {name}!</h1> */}
        <Chat onMessage={handleMessage}/>
        {message!=='' ? <h4>{message} malakes</h4> : '' }
    </div>
);
}
export default Home;