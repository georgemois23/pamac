// 
import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme, responsiveFontSizes} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import toggle1st from './assets/toggle_off_1st.svg';
import toggle2nd from './assets/toggle_on_1st.svg';
// import './App.css';

// // Define your themes
// const originalTheme = createTheme({
//   palette: {
//     background: {
//       default: '#001f3f', // Original background color
//     },
//     text: {
//       primary: '#a4c2f4', // Original text color
//     },
//   },
//   typography: {
//     fontFamily: 'Advent Pro',
//   },
// });

// const purpleTheme = createTheme({
//   palette: {
//     background: {
//       default: '#190c25', // Purple theme background color
//     },
//     text: {
//       disabled: '#6d8ba7',
//       primary: '#D3D3D3', // Purple theme text color
//     },
//   },
//   typography: {
//     fontFamily: 'Advent Pro',
//   },
// });

const ThemeOption = ({ children }) => {
  const storedTheme = localStorage.getItem('theme') || 'original';
  const [theme, setTheme] = useState(storedTheme);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme); // Apply the theme on mount
  }, [theme]);

  const handleThemeToggle = () => {
    const newTheme = (theme === 'purple') ? 'original' : 'purple';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.setAttribute('data-theme', newTheme); // Apply the new theme to body
  };

  // Select the appropriate theme for MUI
  const appliedTheme = theme === 'purple' ? purpleTheme : originalTheme;

  return (
    <ThemeProvider theme={appliedTheme}>
      <CssBaseline /> {/* Reset CSS */}
      {/* Render the children (wrapped content) with the applied theme */}
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

// export default ThemeOption;


const originalTheme = responsiveFontSizes(createTheme({
  palette: {
    background: {
      default: '#001f3f',
    },
    text: {
      primary: '#a4c2f4',
    },}})

  );


const purpleTheme = createTheme({
  palette: {
    background: {
      default: '#190c25', // Purple theme background color
    },
    text: {
      disabled: '#6d8ba7', // Disabled text color
      primary: '#D3D3D3', // Purple theme text color
    },
  },
  typography: {
    fontFamily: 'Advent Pro',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#D3D3D3', // Button text color in purple theme
          backgroundColor: '#190c25', // Button background in purple theme
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: '#D3D3D3', // Hover background color in purple theme
            color: '#190c25', // Hover text color in purple theme
          },
          '&:focus': {
            backgroundColor: '#D3D3D3', // Focus background color in purple theme
            color: '#190c25', // Focus text color in purple theme
          },
          '&:disabled': {
            backgroundColor: '#6d8ba7', // Disabled background color
            color: '#4f4f4f', // Disabled text color in purple theme
          },
        },
      },
    },
  },
});

export default ThemeOption;