import React, { useContext, useEffect, useState } from 'react';
import {
  Box, TextField, IconButton, Typography, List, ListItem, 
  Paper, Chip, InputAdornment, CircularProgress, Divider, Stack,
  Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { ReactComponent as Logo } from '../Polyvox.svg';
import { MessagesProvider, useMessages } from '../context/MessagesContext';
import { useNavigate } from 'react-router-dom';

const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360; // 0–359
  const saturation = 65;            // fixed → vivid
  const lightness = 60;             // fixed → readable on blue

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const ConversationInfo = ({ conversationId, onClose}) => {
  const [loading, setLoading] = useState(false);
  const {participantUsername, participantId} = useMessages()
  const navigate = useNavigate();

  
  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      bgcolor: { xs: 'background.default', md: 'transparent' },
      backdropFilter: {sm:'blur(60px) saturate(180%)', md:'none'}, 
      color: '#fff',
      zIndex: 11000009
    }}>
      
      {/* HEADER - Transparent to see Aurora */}
      <Box sx={{ 
        height: '60px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        px: 2, 
        borderBottom: '1px solid', 
        borderColor: 'divider' 
      }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{cursor: 'default', userSelect: 'none'}}>
  

  <Box
    display="flex"
    alignItems="center"
    gap={0.5}
  >
    <Typography
      variant="subtitle1"
      fontWeight={700}
      sx={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}
    >
      Details
      </Typography>
      {/* <Box
        component="span"
        sx={{
          fontSize: '0.75rem',
          fontWeight: 600,
          opacity: 0.9
        }}
      >
        by
      </Box>
    </Typography>
  <Logo
    style={{
      width: 90,
      height: 90,
    }}
  />*/}
  </Box> 
</Stack>
        <IconButton onClick={onClose} size="small" sx={{ color: 'inherit' }}><CloseIcon fontSize="small" /></IconButton>
      </Box>

      <Box p={2}>
        <Typography>Members</Typography>

<Stack
  direction="row"
  spacing={1}
  alignItems="center"
  sx={{ pt:2, minWidth: 0, cursor:'pointer' }} // lets Typography noWrap work properly
  onClick={() => navigate(`/profile/${participantId}`)}

>
  <Avatar
    sx={{
      width: 36,
      height: 36,
      bgcolor: stringToColor(participantUsername ?? ""),
      fontSize: "1rem",
      boxShadow: 3,
      flexShrink: 0,
    }}
  >
    {(participantUsername?.[0] ?? "?").toUpperCase()}
  </Avatar>

  <Typography
    variant="span"
    component="div"
    fontWeight={600}
    noWrap
    sx={{ minWidth: 0 }} // prevents overflow issues in flex rows
  >
    {participantUsername ?? ""}
  </Typography>
</Stack>

      </Box>

    </Box>
  );
};

export default ConversationInfo;