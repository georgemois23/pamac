import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import toggle1st from './assets/toggle_off_1st.svg';
import toggle2nd from './assets/toggle_on_1st.svg';

const ThemeOption = ({ children }) => {
  // Get the theme **only once** on first render
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'original';
  });

  // Apply theme only **if it actually changes**
  useEffect(() => {
    console.log(`ThemeOption Rendered, theme: ${theme} From LocalStorage: ${localStorage.getItem('theme')}`);
    document.body.setAttribute('data-theme', theme);
  }, [theme]); // Re-run only when `theme` changes

  const handleThemeToggle = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'purple' ? 'original' : 'purple';
      localStorage.setItem('theme', newTheme);
      document.body.setAttribute('data-theme', newTheme);
      return newTheme; // Only update if necessary
    });
  };

  // Select theme
  const appliedTheme = theme === 'purple' ? purpleTheme : originalTheme;

  return (
    <ThemeProvider theme={appliedTheme}>
      <CssBaseline />
      <div>
        <img
          src={theme === 'purple' ? toggle2nd : toggle1st}
          className="theme-option"
          id={`theme-${theme}`}
          onClick={handleThemeToggle}
          title="Change theme color"
        />
      </div>
      {children}
    </ThemeProvider>
  );
};

const originalTheme = responsiveFontSizes(createTheme({
  palette: {
    background: { default: '#001f3f' },
    text: { primary: '#a4c2f4' },
  },
}));

const purpleTheme = createTheme({
  palette: {
    background: { default: '#190c25' },
    text: { disabled: '#6d8ba7', primary: '#D3D3D3' },
  },
  typography: { fontFamily: 'Advent Pro' },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#D3D3D3',
          backgroundColor: '#190c25',
          transition: 'all 0.3s ease',
          '&:hover': { backgroundColor: '#D3D3D3', color: '#190c25' },
          '&:focus': { backgroundColor: '#D3D3D3', color: '#190c25' },
          '&:disabled': { backgroundColor: '#6d8ba7', color: '#4f4f4f' },
        },
      },
    },
  },
});

export default ThemeOption;
