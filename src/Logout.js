import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from './GlobalContext'; // Import the global context

function Logout() {
  const { handleLogout, logoutbutton } = useContext(GlobalContext); // Access global context

  const navigate = useNavigate();
  const handleLogoutClick = () => {
    handleLogout(); // Perform logout actions (e.g., clearing localStorage)
    navigate('/login'); // Redirect to the login page
  };
  return (
    <button onClick={handleLogoutClick} className="logout-button">
      {logoutbutton}
    </button>
  );
}

export default Logout;
