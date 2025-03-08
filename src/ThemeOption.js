import { createTheme, responsiveFontSizes, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useState, useEffect } from "react";
import toggle1st from "./assets/toggle_off_1st.svg";
import toggle2nd from "./assets/toggle_on_1st.svg";

// Base theme configuration
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
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px", // Rounded border
            textAlign: "center",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#a4c2f4", // Set border color
              "& legend": {
                width: "0px !important", // Hide the default legend
              },
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#a4c2f4", // Set border color on hover
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#a4c2f4", // Set border color on focus
              borderWidth: "2px", // Increase border width on focus to prevent gap
            },
          },
          "& .MuiInputLabel-root": {
            color: "#a4c2f4", // Label color
            left: "12px", // Moves label slightly left to avoid gap
            transformOrigin: "top left", // Ensures smooth shrinking
          },
          "& .MuiInputLabel-shrink": {
            transform: "translate(0, -6px) scale(0.75) !important", // Ensures label moves correctly
          },
          "& .MuiOutlinedInput-input": {
            padding: "10px 12px", // Ensures consistent spacing inside input
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e", // Paper background color
          color: "#a4c2f4", // Paper text color
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent", // Transparent Snackbar background
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e", // Snackbar content background color
          color: "#a4c2f4", // Snackbar text color
        },
      },
    },
  },
};

// Original theme setup
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

// Commented out purple theme setup
/* export const purpleTheme = responsiveFontSizes(
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
); */

// ThemeOption component to toggle themes
export const ThemeOption = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "original");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "original" ? "original" : "original"; // Only "original" theme
      localStorage.setItem("theme", newTheme);
      document.body.setAttribute("data-theme", newTheme);
      return newTheme;
    });
  };

  const appliedTheme = originalTheme; // Only applying the original theme

  return (
    <ThemeProvider theme={appliedTheme}>
      <CssBaseline />
      {/* <img
        src={toggle1st}
        className="theme-option"
        id={`theme-original`}
        onClick={handleThemeToggle}
        title="Change theme color"
        alt="Toggle Theme"
      /> */}
      {children}
    </ThemeProvider>
  );
};

export default ThemeOption;
