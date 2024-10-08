import React,{useState} from "react";
import './App.css';
import toggle1st from './assets/toggle_off_1st.svg';
import toggle2nd from './assets/toggle_on_1st.svg';

const ThemeOption = () => {
  const storedTheme = localStorage.getItem('theme') || 'original';
  const [theme, setTheme] = useState(storedTheme);
  const handleThemeToggle = () => {
    const newTheme = (theme === 'purple') ? 'original' : 'purple';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.setAttribute('data-theme', newTheme); // Apply the new theme
  };
  return (
    <img 
    // <div 
      src={theme==='purple' ? toggle2nd : toggle1st}
      className="theme-option" 
      id={`theme-${theme}`} 
      onClick={handleThemeToggle} 
    //   alt="Palette Icon"
    />
    // >Change theme</div>
  );
};

export default ThemeOption;
