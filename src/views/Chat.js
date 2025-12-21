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
        position: 'fixed',
        bottom: 0, 
        left: 0, 
        right: 0, 
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