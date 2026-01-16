import React, { createContext, useCallback, useContext, useState } from 'react';
import { Snackbar, Alert, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Create context
const SnackbarContext = createContext({ showSnackbar: () => {} });

// Provider component
const Provider = ({ children }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState({
    message: '',
    severity: 'info', // still used for icon
  });

  const { t } = useTranslation();

  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  const showSnackbar = useCallback((messageObj) => {
    setSnackbarMessage(messageObj);
    setSnackbarOpen(true);
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={handleSnackbarClose}
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        sx={{
        marginBottom: 0,
        padding: 0,
        backgroundColor: 'transparent',
        zIndex: 13000000,
      }}
      >
        <Alert
          variant="outlined"
          severity={snackbarMessage.severity}
          sx={{
          backgroundColor: 'background.default',
          color: 'text.primary',
          borderColor: 'text.primary',
          minHeight: '0 !important',         
          padding: '2px 8px',           
          lineHeight: 1,             
          display: 'inline-flex',   
          alignItems: 'center',
          '& .MuiAlert-message': {
            margin: 0,
            padding: 0,
          },
          '& .MuiAlert-action': {
            margin: 0,
            padding: 0,
          },
          fontSize: '0.8rem',
          }}
        >
          <Typography>{snackbarMessage.message}</Typography>
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

// Export provider and hook
export const SnackbarProvider = ({ children }) => <Provider>{children}</Provider>;
export const useSnackbar = () => useContext(SnackbarContext);
