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
    if (localStorage.getItem('vst') !== 'true' && localStorage.getItem('enter') !== 'true' ) {
      setOpen(true);
    }
  }, []);
 

  const handleClose = () => {
    setOpen(false);
    localStorage.setItem('enter', 'true');
  };

  return (
    <Snackbar
      open={open}
      sx={{
        border: "2px solid",
        borderRadius: "10px",
        marginBottom: "0.3rem",
        backgroundColor: "transparent",
      }}
      onClose={handleClose}
      TransitionComponent={GrowTransition}
      message={message}
      autoHideDuration={4000}
    />
  );
}
