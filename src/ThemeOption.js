import { createTheme, responsiveFontSizes, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useState, useEffect } from "react";
import toggle1st from "./assets/toggle_off_1st.svg";
import toggle2nd from "./assets/toggle_on_1st.svg";

const baseTheme = {
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: "Advent Pro, Arial, sans-serif",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#001f3f",
          color: "#a4c2f4",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableRipple: true, // Remove button ripple effect
      },
      styleOverrides: {
        root: {
          color: "#a4c2f4",
          backgroundColor: "#001f3f",
          transition: "all 0.3s ease",
          "&:hover": { backgroundColor: "#a4c2f4", color: "#001f3f" },
          "&:focus": { outline: "none" },
          "&:disabled": { backgroundColor: "#6d8ba7", color: "#4f4f4f" },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          color: "#a4c2f4",
          "& label": { color: "#a4c2f4" },
          "& input": { color: "#a4c2f4" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#a4c2f4" },
            "&:hover fieldset": { borderColor: "#a4c2f4" },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e", // Set the background color for Paper
          color: "#a4c2f4", // Set the text color for Paper
          "--Paper-overlay": "none", // Disable the white overlay
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent", // Ensure Snackbar itself is transparent
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e", // Set the background color for Snackbar content
          color: "#a4c2f4", // Set the text color for Snackbar content
          "& .MuiPaper-root": {
            backgroundColor: "#1e1e1e", // Ensure nested Paper has the correct background
          },
        },
      },
    },
  },
};
export const originalTheme = responsiveFontSizes(
  createTheme({
    ...baseTheme,
    palette: {
      ...baseTheme.palette,
      background: { default: "#001f3f", paper: "#1e1e1e" },
      text: { primary: "#a4c2f4" },
    },
  })
);

export const purpleTheme = responsiveFontSizes(
  createTheme({
    ...baseTheme,
    palette: {
      ...baseTheme.palette,
      background: { default: "#190c25", paper: "#1e1e1e" },
      text: { primary: "#D3D3D3", disabled: "#6d8ba7" },
    },
    components: {
      ...baseTheme.components,
      MuiButton: {
        ...baseTheme.components.MuiButton,
        styleOverrides: {
          root: {
            color: "#D3D3D3",
            backgroundColor: "#190c25",
            transition: "all 0.3s ease",
            "&:hover": { backgroundColor: "#D3D3D3", color: "#190c25" },
            "&:focus": { outline: "none" },
            "&:disabled": { backgroundColor: "#6d8ba7", color: "#4f4f4f" },
          },
        },
      },
    },
  })
);

export const ThemeOption = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "original");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === "purple" ? "original" : "purple";
      localStorage.setItem("theme", newTheme);
      document.body.setAttribute("data-theme", newTheme);
      return newTheme;
    });
  };

  const appliedTheme = theme === "purple" ? purpleTheme : originalTheme;

  return (
    <ThemeProvider theme={appliedTheme}>
      <CssBaseline />
      <img 
        src={theme === "purple" ? toggle2nd : toggle1st} 
        className="theme-option" 
        id={`theme-${theme}`} 
        onClick={handleThemeToggle} 
        title="Change theme color" 
        alt="Toggle Theme"
      />
      {children}
    </ThemeProvider>
  );
};

export default ThemeOption;







// import React, { useState, useEffect } from "react";
// import { ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";
// import toggle1st from './assets/toggle_off_1st.svg';
// import toggle2nd from './assets/toggle_on_1st.svg';

// const ThemeOption = ({ children }) => {
//   // Get the theme **only once** on first render
//   const [theme, setTheme] = useState(() => {
//     return localStorage.getItem('theme') || 'original';
//   });

//   // Apply theme only **if it actually changes**
//   useEffect(() => {
//     document.body.setAttribute('data-theme', theme);
//   }, [theme]); // Re-run only when `theme` changes

//   const handleThemeToggle = () => {
//     setTheme(prevTheme => {
//       const newTheme = prevTheme === 'purple' ? 'original' : 'purple';
//       localStorage.setItem('theme', newTheme);
//       document.body.setAttribute('data-theme', newTheme);
//       return newTheme; // Only update if necessary
//     });
//   };

//   // Select theme
//   const appliedTheme = theme === 'purple' ? purpleTheme : originalTheme;

//   return (
//     <ThemeProvider theme={appliedTheme}>
//       <CssBaseline />
//       <div>
//         <img
//           src={theme === 'purple' ? toggle2nd : toggle1st}
//           className="theme-option"
//           id={`theme-${theme}`}
//           onClick={handleThemeToggle}
//           title="Change theme color"
//         />
//       </div>
//       {children}
//     </ThemeProvider>
//   );
// };

// const originalTheme = responsiveFontSizes(createTheme({
//   palette: {
//     background: { default: '#001f3f' },
//     text: { primary: '#a4c2f4' },
//   },
// }));

// const purpleTheme = createTheme({
//   palette: {
//     background: { default: '#190c25' },
//     text: { disabled: '#6d8ba7', primary: '#D3D3D3' },
//   },
//   typography: { fontFamily: 'Advent Pro' },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           color: '#D3D3D3',
//           backgroundColor: '#190c25',
//           transition: 'all 0.3s ease',
//           '&:hover': { backgroundColor: '#D3D3D3', color: '#190c25' },
//           '&:focus': { backgroundColor: '#D3D3D3', color: '#190c25' },
//           '&:disabled': { backgroundColor: '#6d8ba7', color: '#4f4f4f' },
//         },
//       },
//     },
//   },
// });

// export default ThemeOption;
