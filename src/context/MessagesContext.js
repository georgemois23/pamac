import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import AuthContext from '../AuthContext';
import { useSnackbar } from './SnackbarContext';

const MessagesContext = createContext();
const API_URL = process.env.REACT_APP_API_URL;

export const MessagesProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { showSnackbar } = useSnackbar();

  console.log("🔄 Current User State:", user);

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
      console.log("♻️ Disconnecting old socket...");
      socketRef.current.disconnect();
    }

    console.log("🔌 Initializing Socket Connection...");
    console.log(`🔑 Token prefix: ${user.accessToken.substring(0, 10)}...`);

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
      console.log('📩 Packet Received via Socket:', msg);

      setMessages((prev) => {
        // Prevent duplicates
        if (prev.find(m => m.id === msg.id)) {
          console.warn("⚠️ Duplicate message detected from socket, ignoring.");
          return prev;
        }
        console.log(`📝 Updating State. Old Count: ${prev.length} -> New Count: ${prev.length + 1}`);
        return [...prev, msg];
      });
    });

    return () => {
      console.log("🧹 Cleaning up Socket...");
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('newMessage');
      socket.disconnect();
    };
  }, [user?.accessToken]);

  // --- 2. Fetch initial messages ---
  useEffect(() => {
    // 1. If no user, STOP loading and exit.
    if (!user?.accessToken) {
      setLoading(false); // <--- Fixes infinite loading
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoading(true);
        console.log("📥 Fetching message history via REST API...");

        const res = await fetch(`${API_URL}/messages`, {
          headers: {
            'x-frontend-key': process.env.REACT_APP_FRONTEND_KEY || '',
            // 👇 Fixes 403 Forbidden
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
  }, [user?.accessToken, showSnackbar]);

  // --- Send a message ---
  const sendMessage = useCallback((content) => {
    if (!content.trim() || !user?.id) return;

    const currentSocket = socketRef.current;

    // 👇 Debug: Check exactly which socket ID is trying to send
    console.log(`📤 Attempting send. Socket ID: ${currentSocket?.id} | Connected: ${currentSocket?.connected}`);

    if (currentSocket && currentSocket.connected) {
      currentSocket.emit('sendMessage', {
        message: content,
        userId: user.id,
      });
    } else {
      console.warn("⏳ Socket disconnected. Queueing message...");
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