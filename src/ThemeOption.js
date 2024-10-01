import React from "react";
import './App.css';
import toggle1st from './assets/toggle_off_1st.svg';
import toggle2nd from './assets/toggle_on_1st.svg';

const ThemeOption = ({ theme, toggleTheme }) => {
  return (
    <img 
    // <div 
      src={theme==='purple' ? toggle2nd : toggle1st}
      className="theme-option" 
      id={`theme-${theme}`} 
      onClick={toggleTheme} 
    //   alt="Palette Icon"
    />
    // >Change theme</div>
  );
};

export default ThemeOption;
