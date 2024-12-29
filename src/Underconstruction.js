import React, { useState, useEffect } from 'react';
import './App.css'; // Include your CSS styles

function Underconstruction() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    // Check if the pop-up has already been shown during this session
    const hasSeenPopup = sessionStorage.getItem('hasSeenPopup');
    if (!hasSeenPopup) {
      setIsPopupVisible(true); // Show the pop-up
    }
  }, []);

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    // Set a flag in sessionStorage to indicate the pop-up has been shown
    sessionStorage.setItem('hasSeenPopup', 'true');
  };

  return (
    <>
      {isPopupVisible && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>Welcome!</h2>
            <p>This is a one-time message for your session. Enjoy your stay!</p>
            <button onClick={handleClosePopup} className="close-button">Close</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Underconstruction;