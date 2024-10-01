import './App.css'
import { useEffect } from 'react';

function PopUps({ message, onClose }) {
    
    useEffect(() => {
        const timer = setTimeout(() => {
          // Close the pop-up after 3 seconds
          const popUpElement = document.querySelector('.Pop-up');
          if (popUpElement) {
            popUpElement.style.display = 'none';
          }
          else popUpElement.style.display = 'block';

        }, 3000); // 3000 milliseconds = 3 seconds
    
        return () => clearTimeout(timer); // Cleanup the timeout on unmount
      }, []);

    return (
      <div className='Pop-up'>
        <div className='pop-up-content'>
          <h3>{message}</h3>
          
        </div>
      </div>
    );
  }

export default PopUps;