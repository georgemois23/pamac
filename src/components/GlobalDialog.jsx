import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// Keep the custom styling provided in your prompt
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export default function GlobalDialog({ 
  open, 
  onClose, 
  title, 
  children, 
  primaryButtonText = "Save",
  onPrimaryClick,
  secondaryButtonText = "Cancel", 
  onSecondaryClick
}) {
  
  // If no specific logic is passed for the secondary button, 
  // default to closing the dialog
  const handleSecondaryClick = () => {
    if (onSecondaryClick) {
      onSecondaryClick();
    } else {
      onClose();
    }
  };

  return (
    <BootstrapDialog
      onClose={onClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      fullWidth
      maxWidth="sm" // You can change this to 'md' or 'lg' if needed
    >
      {/* --- Title Section --- */}
      <DialogTitle sx={{ m: 0, p: 2, backgroundColor:'background.default' }} id="customized-dialog-title">
        {title}
      </DialogTitle>
      
      {/* --- Close 'X' Icon --- */}
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          // Use 'inherit' to grab the #a4c2f4 from your theme
          color: 'inherit', 
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* --- Body Content --- */}
      <DialogContent dividers sx={{ backgroundColor:'background.default' }}>
        {children}
      </DialogContent>

      {/* --- Footer / Buttons --- */}
      <DialogActions sx={{ backgroundColor:'background.default' }}>
        <Button autoFocus onClick={handleSecondaryClick} color="secondary">
          {secondaryButtonText}
        </Button>
        <Button onClick={onPrimaryClick} variant="contained" autoFocus>
          {primaryButtonText}
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}

// Optional: Define prop types for better error checking
GlobalDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  primaryButtonText: PropTypes.string,
  onPrimaryClick: PropTypes.func,
  secondaryButtonText: PropTypes.string,
  onSecondaryClick: PropTypes.func,
};