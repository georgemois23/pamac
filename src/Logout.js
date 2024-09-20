// Logout.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear session data and navigate to the home page or login page
    localStorage.removeItem('username');
    sessionStorage.removeItem('messages');
    navigate('/'); // Redirect to the home page
  }, [navigate]);

  return (
    <div>
      <h1>Logging out...</h1>
    </div>
  );
}

export default Logout;
