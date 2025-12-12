import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import AuthContext from '../AuthContext';
import { useSnackbar } from './SnackbarContext';

const MessagesContext = createContext();

const API_URL = process.env.REACT_APP_API_URL;
const socket = io(API_URL, { autoConnect: false });

export const MessagesProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteThisMessage, setDeleteThisMessage] = useState(null);
  const [goToProfile, setGoToProfile] = useState(null);
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);
  const { showSnackbar } = useSnackbar();
  
    useEffect(() => {
    const deleteMessage = async () => {
    if (!deleteThisMessage) return; 

    try {
     if (!user) {
      showSnackbar({ message: 'User not authenticated', severity: 'error' });
      setDeleteThisMessage(null);
      return;
    }

      let res;
      if (user.role?.toLowerCase() === 'admin') {
      res = await fetch(`${API_URL}/messages/admin/${deleteThisMessage}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.accessToken}`,
      },
    });
  } else {
    res = await fetch(`${API_URL}/messages/${deleteThisMessage}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user.accessToken}`,
    },
  });
  }

      if (!res.ok) throw new Error('Failed to delete message');

      setMessages((prev) =>
        prev.filter((msg) => msg.id !== deleteThisMessage)
      );
      showSnackbar({message: 'Message deleted successfully!', severity: 'success' });
    } catch (err) {
      showSnackbar({message: 'Message deleted failed!', severity: 'error' });
    } finally {
      setDeleteThisMessage(null);
    }
  };

  
    deleteMessage();
  }, [deleteThisMessage, user]);


  useEffect(() => {
    if (socket.connected) return;
    setLoading(true);
    socket.connect();

     fetch(`${API_URL}/messages`, { 
      headers: {
        'x-frontend-key': process.env.REACT_APP_FRONTEND_KEY || '',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch((err) => {
        showSnackbar({ message: 'Failed to load messages', severity: 'error' });
        setLoading(false);
      });

    socket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    socket.on('newMessage', (msg) => {
    setMessages((prev) => [...prev, msg]);
});

    return () => {
      socket.off('newMessage');
      socket.disconnect();
    };
  }, [user]);

  const sendMessage = (content) => {
  if (!content.trim()) return;

  socket.emit('sendMessage', { message: content, userId: user.id }, (response) => {
    if (response.success) {
      return;
    } else {
      showSnackbar({ message: 'Message failed to send', severity: 'error' });
    }
    });
  };

  const value = {
    messages,
    sendMessage,
    connected,
    messagesEndRef,
    loading,
    setDeleteThisMessage,
    setGoToProfile,
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => useContext(MessagesContext);
