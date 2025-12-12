import { createTheme, responsiveFontSizes, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import React, { useState, useEffect } from "react";

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

    // -------------------------------------------------------
    // ✅ BUTTON OVERRIDES (Your original custom button theme)
    // -------------------------------------------------------
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          transition: "background-color 0.3s ease, color 0.3s ease",
          "&:focus": {
            outline: "none",
          },
          "&:focus-visible": {
            outline: "2px solid #a4c2f4",
            outlineOffset: "2px",
          },
        },

        contained: {
          color: "#a4c2f4",
          backgroundColor: "#001f3f",
          borderColor: "#a4c2f4",
          border: "2px solid",
          borderRadius: "8px",
          height: "fit-content",
          "&:hover": {
            backgroundColor: "#a4c2f4",
            color: "#001f3f",
          },
          "&:disabled": {
            backgroundColor: "#6d8ba7",
            color: "#4f4f4f",
          },
        },

        outlined: {
          color: "#a4c2f4",
          borderColor: "#a4c2f4",
          border: "2px solid",
          borderRadius: "8px",
          height: "fit-content",
          "&:hover": {
            backgroundColor: "rgba(164, 194, 244, 0.1)",
            borderColor: "#a4c2f4",
          },
          "&:disabled": {
            borderColor: "#6d8ba7",
            color: "#6d8ba7",
          },
        },

        text: {
          color: "#a4c2f4",
          "&:hover": {
            backgroundColor: "rgba(164, 194, 244, 0.1)",
          },
          "&:disabled": {
            color: "#6d8ba7",
          },
        },
      },
    },

    // -------------------------------------------------------
    // ❌ TEXTFIELD — RESET TO DEFAULT (no custom styles)
    // -------------------------------------------------------
    MuiTextField: {
      styleOverrides: {
        root: {},
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {},
        input: {},
        notchedOutline: {},
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {},
      },
    },

    // -------------------------------------------------------
    // Other components already safe
    // -------------------------------------------------------
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e",
          color: "#a4c2f4",
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e1e1e",
          color: "#a4c2f4",
        },
      },
    },
  },
};

// FINAL THEME
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

// Wrapper with theme provider
export const ThemeOption = ({ children }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "original"
  );

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
