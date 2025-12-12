import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
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
  const messageQueue = useRef([]);

  // --- 1. Initialize Socket.IO ---
  useEffect(() => {
    // Wait for the user to be logged in
    if (!user?.accessToken) return;

    // Disconnect old socket if it exists to prevent duplicates
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    console.log("🔌 Initializing Socket Connection...");

    // Initialize new socket
    const socket = io(API_URL, {
      auth: { token: user.accessToken },
      autoConnect: true,
      transports: ['websocket'], // Force WebSocket
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Connected to WebSocket with ID:', socket.id);
      setConnected(true);

      // Send queued messages
      if (messageQueue.current.length > 0) {
        console.log(`🚀 Sending ${messageQueue.current.length} queued messages`);
        messageQueue.current.forEach((msg) => {
          socket.emit('sendMessage', { message: msg, userId: user.id });
        });
        messageQueue.current = [];
      }
    });

    socket.on('disconnect', (reason) => {
      console.warn('⚠️ Disconnected from server:', reason);
      setConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Connection Error:', err.message);
    });

    // 👇 VITAL: Listen for the message and update state
    socket.on('newMessage', (msg) => {
      console.log('📩 New Message Received on Client:', msg); // <--- CHECK CONSOLE FOR THIS
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      console.log("🧹 Cleaning up Socket...");
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('newMessage');
      socket.disconnect();
    };
    // ⚠️ removed showSnackbar from dependencies to prevent connection loops
  }, [user?.accessToken]); 

  // --- 2. Fetch initial messages (FIXED) ---
  useEffect(() => {
    // Wait for user token before fetching
    if (!user?.accessToken) {
        setLoading(false); // <--- ADD THIS LINE to fix infinite loading
        return;
    }

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/messages`, {
          headers: {
            'x-frontend-key': process.env.REACT_APP_FRONTEND_KEY || '',
            // 👇 THIS WAS MISSING IN YOUR CODE
            'Authorization': `Bearer ${user.accessToken}`, 
          },
        });

        if (!res.ok) throw new Error(`Error ${res.status}: Failed to load messages`);
        
        const data = await res.json();
        setMessages(data);
        console.log(`📚 Fetched ${data.length} historical messages`);
      } catch (err) {
        console.error(err);
        showSnackbar({ message: 'Failed to load messages', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user?.accessToken, showSnackbar]); // Added user.accessToken dependency

  // --- Send a message ---
  const sendMessage = useCallback((content) => {
    if (!content.trim() || !user?.id) return;

    if (socketRef.current && socketRef.current.connected) {
      console.log("📤 Sending message via Socket");
      socketRef.current.emit('sendMessage', {
        message: content,
        userId: user.id,
      });
    } else {
      console.warn("⏳ Socket not connected. Queueing message.");
      messageQueue.current.push(content);
      showSnackbar({ message: 'Reconnecting...', severity: 'info' });
    }
  }, [user?.id, showSnackbar]);

  // --- Delete a message ---
  useEffect(() => {
    if (!deleteThisMessage || !user?.accessToken) return;

    const deleteMessage = async () => {
      try {
        const endpoint =
          user.role?.toLowerCase() === 'admin'
            ? `${API_URL}/messages/admin/${deleteThisMessage}`
            : `${API_URL}/messages/${deleteThisMessage}`;

        const res = await fetch(endpoint, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
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
  }, [deleteThisMessage, user?.accessToken, user?.role, showSnackbar]);

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