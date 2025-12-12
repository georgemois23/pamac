import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import AuthContext from '../AuthContext';
import { useSnackbar } from './SnackbarContext';

const MessagesContext = createContext();
const API_URL = process.env.REACT_APP_API_URL;

export const MessagesProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { showSnackbar } = useSnackbar();

  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteThisMessage, setDeleteThisMessage] = useState(null);
  const [goToProfile, setGoToProfile] = useState(null);

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

 // --- Initialize Socket.IO ---
  useEffect(() => {
    // 1. Prevent connection if there is no token (stop the loop before it starts)
    if (!user?.accessToken) return;

    // 2. Initialize Socket with the CURRENT token
    socketRef.current = io(API_URL, {
      auth: { token: user.accessToken },
      autoConnect: true,
      transports: ['websocket'],
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to server', socket.id);
      setConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
      setConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.log('Connection Error:', err.message);
      // Optional: stop retrying if auth fails
      if (err.message.includes("Unauthorized")) {
         socket.disconnect();
      }
    });

    socket.on('newMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // 3. Cleanup: Disconnect the old socket before creating a new one
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('newMessage');
      socket.disconnect(); // <--- Crucial!
    };
    
  // 4. Add the token to the dependency array
  }, [user?.accessToken]);

  // --- Fetch initial messages ---
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_URL}/messages`, {
          headers: {
            'x-frontend-key': process.env.REACT_APP_FRONTEND_KEY || '',
          },
        });

        if (!res.ok) throw new Error('Failed to load messages');
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        showSnackbar({ message: 'Failed to load messages', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // --- Send a message ---
  const sendMessage = (content) => {
    if (!content.trim() || !user?.id) return;

    socketRef.current.emit('sendMessage', {
      message: content,
      userId: user.id,
    });
  };

  // --- Delete a message ---
  useEffect(() => {
    if (!deleteThisMessage) return;

    const deleteMessage = async () => {
      if (!user) {
        showSnackbar({ message: 'User not authenticated', severity: 'error' });
        setDeleteThisMessage(null);
        return;
      }

      try {
        const endpoint =
          user.role?.toLowerCase() === 'admin'
            ? `${API_URL}/messages/admin/${deleteThisMessage}`
            : `${API_URL}/messages/${deleteThisMessage}`;

        const res = await fetch(endpoint, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accessToken}`,
          },
        });

        if (!res.ok) throw new Error('Failed to delete message');

        setMessages((prev) => prev.filter((msg) => msg.id !== deleteThisMessage));
        showSnackbar({ message: 'Message deleted successfully!', severity: 'success' });
      } catch (err) {
        showSnackbar({ message: 'Message deletion failed!', severity: 'error' });
      } finally {
        setDeleteThisMessage(null);
      }
    };

    deleteMessage();
  }, [deleteThisMessage, user]);

  const value = {
    messages,
    sendMessage,
    connected,
    messagesEndRef,
    loading,
    setDeleteThisMessage,
    setGoToProfile,
  };

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
};

export const useMessages = () => useContext(MessagesContext);
