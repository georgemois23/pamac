// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import ThemeOption from '../ThemeOption';
// import { 
//   Box, 
//   Button, 
//   Stack, 
//   TextField, 
//   Typography, 
//   Avatar, 
//   IconButton 
// } from '@mui/material';
// import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'; // Make sure to install/import this icon
// import { useTranslation } from 'react-i18next';
// import { useMessages } from '../context/MessagesContext';

// function Chat({ user = {}, handleLogout }) { // Added handleLogout prop if you have one
//   const navigate = useNavigate();
//   const { t } = useTranslation();
//   const [message, setMessage] = useState('');
//   const { sendMessage } = useMessages();

//   // 1. Setup Page Title
//   useEffect(() => {
//     document.title = 'Chat';
//   }, []);

//   // 2. Logic for disabling button
//   const isButtonDisabled = !message || message.trim().length === 0;

//   const handleMessageChange = (event) => {
//     const input = event.target.value;
//     const allowedPattern = /^[\p{Script=Greek}\p{Script=Latin}\P{Letter}]*$/u;
//     if (allowedPattern.test(input)) {
//       setMessage(input);
//     }
//   };

//   const handleSend = (event) => {
//     event.preventDefault();
//     if (message.trim()) {
//       sendMessage(message);
//       document.title = t("messages");
//       setMessage('');
//       navigate('/messages');
//     }
//   };

//   // User Display Name Logic
//   const displayName = !user?.username 
//     ? t("anonymous_user") 
//     : (user.full_name ? user.full_name.split(' ')[0] : user.username);
  
//   // Initials for Avatar (e.g., "GM")
//   const userInitials = user?.username 
//     ? user.username.substring(0, 2).toUpperCase() 
//     : "GM";

//   return (
//     // MAIN CONTAINER: Full screen height, relative for corner items
//     <Box 
//       sx={{ 
//         minHeight: '100vh', 
//         // width: '100vw',
//         display: 'flex', 
//         flexDirection: 'column', 
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         position: 'relative', // Essential for absolute positioning
//         overflow: 'hidden',   // Prevents scrollbars if not needed
//         p: 2 
//       }}
//     >
//       {/* --- TOP LEFT: Avatar & Theme --- */}
//       <Box sx={{ position: 'absolute', top: 30, left: 30, display: 'flex', alignItems: 'center', gap: 2 }}>
       
//         {/* Kept ThemeOption here so it's accessible but out of the way */}
//         <ThemeOption />
//       </Box>

      
//       {/* --- CENTER: Welcome & Form --- */}
//       <Box sx={{ width: '100%', maxWidth: '700px', textAlign: 'center' }}>
        
//         <Typography variant='h3' sx={{ fontWeight: "bold", mb: 4 }}>
//           {t('welcome')} {displayName}!
//         </Typography>

//         <Box
//           component="form"
//           onSubmit={handleSend}
//           spellCheck={false}
//           noValidate
//           autoComplete="off"
//         >
//           <Stack spacing={4} alignItems="center">
            
//             {/* The Input Box */}
//             <TextField
//               id="text"
//               value={message}
//               onChange={handleMessageChange}
//               placeholder="Type your message"
//               multiline
//               minRows={6} // Taller box like the screenshot
//               maxRows={8}
//               fullWidth
//               variant="outlined"
              
//               // Styling to match the "Ghost" look of the screenshot
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: '12px', // Slightly rounded corners
//                   '& fieldset': {
//                     borderWidth: '1px', // Thin border
//                   },
//                 },
//                 '& .MuiOutlinedInput-input': {
//                    textAlign: 'center', // Centers the text typing if desired (optional)
//                 }
//               }}
              
//               inputProps={{
//                 maxLength: 350,
//                 spellCheck: 'false',
//                 // Center the placeholder text
//                 sx: { textAlign: 'center' } 
//               }}
//             />

//             {/* The Send Button */}
//             <Button
//               type="submit"
//               variant="outlined" // Changed to 'outlined' to match screenshot style
//               disabled={isButtonDisabled}
//               sx={{ 
//                 fontSize: '1.2rem',
//               }}
//             >
//               {t("send")}
//             </Button>

//           </Stack>
//         </Box>
//       </Box>

      

//     </Box>
//   );
// }

// export default Chat;
import React, { useState } from 'react';
import { 
  Box, 
  IconButton, 
  Stack, 
  TextField, 
  Paper,
  InputAdornment
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send'; // Import Send Icon
import { useTranslation } from 'react-i18next';
import { useMessages } from '../context/MessagesContext';

function Chat({ user = {} }) { 
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const { sendMessage } = useMessages();

  // Logic for disabling button
  const isButtonDisabled = !message || message.trim().length === 0;

  const handleMessageChange = (event) => {
    const input = event.target.value;
    // Keep your existing regex validation
    const allowedPattern = /^[\p{Script=Greek}\p{Script=Latin}\P{Letter}]*$/u;
    if (allowedPattern.test(input)) {
      setMessage(input);
    }
  };

  const handleSend = (event) => {
    event.preventDefault();
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
      // We don't need navigate('/messages') if this component is already ON the messages page
    }
  };

  const handleKeyDown = (event) => {
    // Allow sending with "Enter" key (Shift+Enter for new line)
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!isButtonDisabled) {
        handleSend(event);
      }
    }
  };

  return (
    // FIXED FOOTER CONTAINER
    <Paper 
      elevation={3}
      sx={{ 
        position: 'relative',
        // bottom: 0, 
        // left: 0, 
        // right: 0, 
        zIndex: 11000000, // Higher than other content
        p: 2,
        backgroundColor: 'inherit',
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSend}
        noValidate
        autoComplete="off"
        sx={{ 
            maxWidth: '1000px', 
            margin: '0 auto',
            width: '100%' 
        }}
      >
        <Stack direction="row" spacing={2} alignItems="flex-end">
          
          {/* The Messenger-style Input Bubble */}
          <TextField
            id="text"
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            placeholder={"Type a message..."}
            multiline
            maxRows={1} // Grows up to 4 lines then scrolls
            fullWidth
            variant="outlined"
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px', // Pill shape like Messenger
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                '& fieldset': {
                  border: 'none', // Remove the default border for a cleaner look
                },
              },
            }}
          />

          {/* The Send Button (Icon) */}
          <IconButton
            type="submit"
            color="primary"
            disabled={isButtonDisabled}
            sx={{ 
              mb: 0.5, // Aligns icon with the first line of text
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.1)' }
            }}
          >
            <SendIcon />
          </IconButton>

        </Stack>
      </Box>
    </Paper>
  );
}

export default Chat;