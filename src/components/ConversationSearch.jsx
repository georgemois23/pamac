import React, { useEffect, useState } from 'react';
import {
  Box, TextField, IconButton, Typography, List, ListItem, 
  Paper, Chip, InputAdornment, CircularProgress, Divider, Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import PsychologyIcon from '@mui/icons-material/Psychology';
import { ReactComponent as Logo } from '../Polyvox.svg';

const ConversationSearch = ({ conversationId, onClose,query, 
  setQuery, 
  results, 
  setResults }) => {
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  useEffect(() => {
    setResults([]);
    setQuery('');
  }, [conversationId]);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/ai/search?query=${encodeURIComponent(query)}&conversationId=${conversationId}`
      );
      const data = await response.json();

      const cleanResults = (data.results || [])
        .filter((res) => res.content.length > 3)
        .map((res) => ({
          ...res,
          matchPercent: Math.round(res.similarity * 100),
        }));

      setResults(cleanResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultTap = (messageId) => {
  onClose(); 

  const el = document.getElementById(messageId);
  if (!el) return;

  el.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {

        // ⏳ small delay before animation starts
        setTimeout(() => {
          entry.target.animate([
            { 
              backgroundColor: 'rgba(56, 189, 248, 0.6)', 
              transform: 'scale(1)',
              boxShadow: '0 0 0px rgba(56, 189, 248, 0)'
            },
            { 
              backgroundColor: 'rgba(56, 189, 248, 0.3)', 
              transform: 'scale(1.04)',
              boxShadow: '0 0 25px rgba(56, 189, 248, 0.5)'
            },
            { 
              backgroundColor: 'transparent', 
              transform: 'scale(1)',
              boxShadow: '0 0 0px rgba(56, 189, 248, 0)'
            }
          ], {
            duration: 1200,
            easing: 'ease-out',
            fill: 'forwards'
          });
        }, 200); // 👈 tweak this (150–300ms feels great)

        observer.unobserve(entry.target);
      }
    });
  }, { 
    threshold: 0.5
  });

  observer.observe(el);
};


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
  <PsychologyIcon color="primary" />

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
      AI Search
      <Box
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
  />
  </Box>
</Stack>
        <IconButton onClick={onClose} size="small" sx={{ color: 'inherit' }}><CloseIcon fontSize="small" /></IconButton>
      </Box>

      {/* SEARCH INPUT */}
      <Box sx={{ p: 2 }}>
        <form onSubmit={handleSearch}>
          <TextField
            fullWidth size="small" placeholder="What are you looking for?"
            value={query} onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearch} edge="end" sx={{ color: 'inherit' }}>
                    {loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                  </IconButton>
                </InputAdornment>
              ),
              // Glass styling for the input itself
              sx: { 
                bgcolor: 'rgba(255,255,255,0.05)', 
                borderRadius: 4,
                backdropFilter: 'blur(5px)',
                color: 'inherit'
              }
            }}
          />
        </form>
      </Box>

      {/* RESULTS LIST */}
      <List sx={{ 
        flexGrow: 1, 
        overflow: 'auto', 
        px: 2, 
        pb: 2,
        // Custom Scrollbar
        '&::-webkit-scrollbar': { width: '5px' },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': { 
          background: 'rgba(255, 255, 255, 0.2)', 
          borderRadius: '10px' 
        },
        '&::-webkit-scrollbar-thumb:hover': { background: 'rgba(255, 255, 255, 0.3)' }
      }}>
        {results.map((res) => (
          <ListItem key={res.id} disablePadding sx={{ mb: 1.5 }} onClick={() => handleResultTap(res.id)}>
            <Paper elevation={0} sx={{ 
                p: 2, width: '100%', cursor: 'pointer',
                bgcolor: 'rgba(255, 255, 255, 0.05)', 
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.12)', borderColor: '#38bdf8' } 
            }}>
              {/* Ellipsis and Clamping logic applied here */}
              <Typography 
                variant="body2" 
                sx={{ 
                  fontStyle: 'italic', 
                  mb: 1, 
                  color: '#e2e8f0',
                  display: '-webkit-box',
                  WebkitLineClamp: 3, // Show only 3 lines
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                "{res.content}"
              </Typography>
              <Chip label={`${res.matchPercent}% Match`} size="small" color="primary" sx={{ fontSize: '0.6rem', fontWeight: 'bold' }} />
            </Paper>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ConversationSearch;