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
  const [conversationId, setConversationId] = useState(null); // New state for conversationId

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const messageQueue = useRef([]);

  // --- 1. Initialize Socket.IO --- 
  useEffect(() => {
    if (!user?.accessToken || !conversationId) return; // Only connect if we have a conversationId

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

      // Send queued messages if any
      if (messageQueue.current.length > 0) {
        console.log(`🚀 Sending ${messageQueue.current.length} queued messages`);
        messageQueue.current.forEach((msg) => {
          socket.emit('sendMessage', { message: msg, userId: user.id, conversationId });
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

    // Listen for the message and update state (filter by conversationId)
    socket.on('newMessage', (msg) => {
      console.log('📩 Packet Received via Socket:', msg);

      // Only update the state if the message is for the current conversationId
      if (msg.conversationId === conversationId) {
        setMessages((prev) => {
          if (prev.find((m) => m.id === msg.id)) {
            console.warn("⚠️ Duplicate message detected from socket, ignoring.");
            return prev;
          }
          console.log(`📝 Updating State. Old Count: ${prev.length} -> New Count: ${prev.length + 1}`);
          return [...prev, msg];
        });
      }
    });

    socket.on('messageDeleted', (messageId) => {
      console.log('🗑️ Received deletion event for ID:', messageId);
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    });

    return () => {
      console.log("🧹 Cleaning up Socket...");
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('newMessage');
      socket.off('messageDeleted');
      socket.disconnect();
    };
  }, [user?.accessToken, conversationId]); // Dependency array includes conversationId

  // --- 2. Fetch initial messages --- 
  useEffect(() => {
    // 1. If no user or conversationId, STOP loading and exit.
    if (!user?.accessToken || !conversationId) {
      setLoading(false); // <--- Fixes infinite loading
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoading(true);
        console.log("📥 Fetching message history via REST API...");

        const res = await fetch(`${API_URL}/messages/${conversationId}`, {
          headers: {
            'x-frontend-key': process.env.REACT_APP_FRONTEND_KEY || '',
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
  }, [user?.accessToken, conversationId, showSnackbar]);

  const [participantUsername, setParticipantUsername] = useState(null);
  const [participantId, setParticipantId] = useState(null);
  useEffect(() => {
    if (!conversationId || !user?.accessToken) return;
    fetch(`${API_URL}/conversations/${conversationId}/participants`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`,
        },
      })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch participants');
        return res.json();
      })
      .then((data) => {
        const otherParticipant = data.find((p) => p.id !== user.id);
        if (otherParticipant) {
          setParticipantUsername(otherParticipant.username);
          setParticipantId(otherParticipant.id);
        }
      })
      .catch((error) => {
        console.error('Error fetching participants:', error);

        })}
  , [conversationId]);

  // --- Send a message --- 
  const sendMessage = useCallback((content) => {
    if (!content.trim() || !user?.id || !conversationId) return;

    const currentSocket = socketRef.current;

    console.log(`📤 Attempting send. Socket ID: ${currentSocket?.id} | Connected: ${currentSocket?.connected}`);

    if (currentSocket && currentSocket.connected) {
      currentSocket.emit('sendMessage', {
        message: content,
        userId: user.id,
        conversationId,
      });
    } else {
      console.warn("⏳ Socket disconnected. Queueing message...");
      messageQueue.current.push(content);
      showSnackbar({ message: 'Reconnecting...', severity: 'info' });
    }
  }, [user?.id, conversationId, showSnackbar]);

  // --- Delete a message --- 
  useEffect(() => {
    if (!deleteThisMessage || !user?.accessToken || !conversationId) return;

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
        if (socketRef.current) {
            socketRef.current.emit('deleteMessage', deleteThisMessage);
        }
        showSnackbar({ message: 'Message deleted successfully!', severity: 'success' });
      } catch (err) {
        showSnackbar({ message: 'Message deletion failed!', severity: 'error' });
      } finally {
        setDeleteThisMessage(null);
      }
    };

    deleteMessage();
  }, [deleteThisMessage, user?.accessToken, user?.role, conversationId, showSnackbar]);

  const value = {
    messages,
    sendMessage,
    connected,
    messagesEndRef,
    loading,
    setDeleteThisMessage,
    setGoToProfile,
    setConversationId, // Add setter for conversationId
    participantUsername,
    participantId,
  };

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
};

export const useMessages = () => useContext(MessagesContext);
