import { createTheme, responsiveFontSizes, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useState, useEffect } from "react";

// 1. Define your specific brand colors here
const brandColors = {
  darkBlue: "#001f3f",
  lightBlue: "#a4c2f4",
  greyText: "#6d8ba7",
  paperBg: "#1e1e1e",
};

const baseTheme = {
  palette: {
    mode: "dark",
    background: { 
      default: brandColors.darkBlue, 
      paper: brandColors.paperBg 
    },
    text: { 
      primary: brandColors.lightBlue 
    },
    primary: {
      main: brandColors.lightBlue,
    },
  },
  typography: {
    fontFamily: "Inter, Arial, sans-serif",
    // fontFamily: "Advent Pro, Arial, sans-serif",
  },
  components: {
    // Global CSS Reset for Body
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: brandColors.darkBlue,
          color: brandColors.lightBlue,
        },
      },
    },
    // Standard Button Defaults (Normal size, not huge)
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px", // Standard radius for all buttons
          textTransform: "none", // Optional: prevents UPPERCASE text
          width: "fit-content",
          padding: 6,
        },
      },
    },
    // Fix IconButton color generally
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: brandColors.lightBlue,
        },
      },
    },
  },
};

export const originalTheme = responsiveFontSizes(createTheme(baseTheme));

export const ThemeOption = ({ children }) => {
  const [theme] = useState("original");
  
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeProvider theme={originalTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

export default ThemeOption;