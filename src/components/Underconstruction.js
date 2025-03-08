import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Grow from '@mui/material/Grow';
import {useState } from 'react';
function GrowTransition(props) {
  return <Grow {...props} />;
}

export default function UnderConstruction({message}) {
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    if (localStorage.getItem('vst') !== 'true') {
      setOpen(true);
    }
  }, []);
 

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      sx={{
        border: "2px solid",
        borderRadius: "10px",
        marginBottom: "0.3rem"
      }}
      onClose={handleClose}
      TransitionComponent={GrowTransition}
      message={message}
      autoHideDuration={4000}
    />
  );
}
