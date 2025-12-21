import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import AuthContext from '../AuthContext';
import { useSnackbar } from './SnackbarContext';

const MessagesContext = createContext();
const API_URL = process.env.REACT_APP_API_URL;

export const MessagesProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { showSnackbar } = useSnackbar();

  // --- State ---
  const [conversations, setConversations] = useState([]); // List of all conversations
  const [messages, setMessages] = useState([]);           // Messages of ACTIVE conversation
  const [conversationId, setConversationId] = useState(null); // Currently active conversation
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false); // Changed default to false to prevent initial block
  
  // Participants state
  const [participantUsername, setParticipantUsername] = useState(null);
  const [participantId, setParticipantId] = useState(null);

  // Actions state
  const [deleteThisMessage, setDeleteThisMessage] = useState(null);
  const [goToProfile, setGoToProfile] = useState(null);

  // --- Refs ---
  const socketRef = useRef(null);
  const messageQueue = useRef([]);
  const messagesEndRef = useRef(null);
  
  // We use a Ref to track the active ID inside socket listeners 
  // without re-running the useEffect (which would disconnect the socket)
  const activeConversationIdRef = useRef(null);

  // Sync Ref with State
  useEffect(() => {
    activeConversationIdRef.current = conversationId;
  }, [conversationId]);


  // =========================================================
  // 1. FETCH CONVERSATIONS LIST (Run once on auth)
  // =========================================================
  const fetchConversations = useCallback(async () => {
    if (!user?.accessToken) return;
    try {
      const res = await fetch(`${API_URL}/conversations`, {
        headers: { 'Authorization': `Bearer ${user.accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setConversations(data); 
      }
    } catch (err) {
      console.error(err);
    }
  }, [user?.accessToken]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // =========================================================
  // NEW: SYNC ACTIVE PARTICIPANT FROM CONVERSATIONS LIST
  // =========================================================
  useEffect(() => {
    // 1. Safety checks
    if (!conversationId || conversations.length === 0 || !user) return;

    // 2. Find the SPECIFIC active conversation in the list
    // Note: Use == to match string "5" with number 5 just in case
    const activeConv = conversations.find((c) => c.id == conversationId);

    if (activeConv) {
        // 3. Extract the 'other' user from this specific conversation
        // IMPORTANT: This depends on how your backend sends the 'conversations' list.
        // Usually, it's either an array of participants OR a direct object.
        
        // SCENARIO A: If your backend sends a 'participants' array inside the conversation:
        if (activeConv.participants) {
            const other = activeConv.participants.find(p => p.id !== user.id);
            if (other) {
                setParticipantUsername(other.username);
                setParticipantId(other.id);
            }
        } 
        // SCENARIO B: If your backend pre-calculates the name/id (common in some setups):
        else if (activeConv.username) { 
             setParticipantUsername(activeConv.username);
             setParticipantId(activeConv.otherUserId || activeConv.participantId); 
        }
    }
  }, [conversations, conversationId, user]);


  // =========================================================
  // 2. SOCKET CONNECTION & GLOBAL EVENTS
  // =========================================================
  useEffect(() => {
    if (!user?.accessToken) return;

    console.log("🔌 Initializing Socket Connection...");
    
    // Initialize Socket
    const socket = io(API_URL, {
      auth: { token: user.accessToken },
      autoConnect: true,
      transports: ['websocket'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Connected to WebSocket with ID:', socket.id);
      setConnected(true);

      // Process Queue
      if (messageQueue.current.length > 0) {
        console.log(`🚀 Sending ${messageQueue.current.length} queued messages`);
        messageQueue.current.forEach((item) => {
          socket.emit('sendMessage', item);
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

    // --- HANDLE INCOMING MESSAGES ---
    socket.on('newMessage', (msg) => {
      console.log('📩 New Message:', msg);

      // A. Update Active Chat Window (only if we are looking at this conversation)
      if (activeConversationIdRef.current === msg.conversationId) {
        setMessages((prev) => {
          if (prev.find((m) => m.id === msg.id)) return prev; // Dedup
          return [...prev, msg];
        });
      }

      fetchConversations();
    });

    // --- HANDLE DELETION ---
    socket.on('messageDeleted', (messageId) => {
      console.log('🗑️ Received deletion event:', messageId);
      // Remove from active messages
      fetchConversations();
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      // Optional: You could also update 'lastMessage' in conversations list if the last one was deleted
    });

    return () => {
      console.log("🧹 Cleaning up Socket...");
      socket.disconnect();
    };
  }, [user?.accessToken,fetchConversations]); 


  // =========================================================
  // 3. FETCH ACTIVE CHAT MESSAGES & PARTICIPANTS
  // =========================================================
  useEffect(() => {
    if (!user?.accessToken || !conversationId) {
      setLoading(false);
      return;
    }

    const loadConversationData = async () => {
      setLoading(true);
      try {
        // A. Fetch Messages
        const msgRes = await fetch(`${API_URL}/messages/${conversationId}`, {
          headers: {
            'x-frontend-key': process.env.REACT_APP_FRONTEND_KEY || '',
            'Authorization': `Bearer ${user.accessToken}`,
          },
        });
        if (msgRes.ok) {
          const msgData = await msgRes.json();
          setMessages(msgData);
        }

        // B. Fetch Participants
        const partRes = await fetch(`${API_URL}/conversations/${conversationId}/participants`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`,
          },
        });
        if (partRes.ok) {
          const partData = await partRes.json();
          const otherParticipant = partData.find((p) => p.id !== user.id);
          if (otherParticipant) {
            setParticipantUsername(otherParticipant.username);
            setParticipantId(otherParticipant.id);
          }
        }

      } catch (err) {
        console.error(err);
        showSnackbar({ message: 'Failed to load conversation', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    loadConversationData();
  }, [conversationId, user?.accessToken, user?.id, showSnackbar]);


  // =========================================================
  // 4. ACTIONS (Send, Delete)
  // =========================================================
  const sendMessage = useCallback((content) => {
    if (!content.trim() || !user?.id || !conversationId) return;

    const payload = {
      message: content,
      userId: user.id,
      conversationId,
    };

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('sendMessage', payload);
    } else {
      console.warn("⏳ Socket disconnected. Queueing message...");
      messageQueue.current.push(payload);
      showSnackbar({ message: 'Reconnecting...', severity: 'info' });
    }
  }, [user?.id, conversationId, showSnackbar]);


  useEffect(() => {
    if (!deleteThisMessage || !user?.accessToken) return;

    const deleteMessage = async () => {
      try {
        const endpoint = user.role?.toLowerCase() === 'admin'
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

        // Optimistic update
        setMessages((prev) => prev.filter((msg) => msg.id !== deleteThisMessage));
        
        if (socketRef.current) {
          socketRef.current.emit('deleteMessage', deleteThisMessage);
        }
        showSnackbar({ message: 'Message deleted!', severity: 'success' });
      } catch (err) {
        showSnackbar({ message: 'Deletion failed!', severity: 'error' });
      } finally {
        setDeleteThisMessage(null);
      }
    };

    deleteMessage();
  }, [deleteThisMessage, user?.accessToken, user?.role, showSnackbar]);


  // =========================================================
  // 5. EXPORT
  // =========================================================
  const value = {
    conversations,      // List of all conversations (for sidebar)
    messages,          // Messages of current active conversation
    sendMessage,
    connected,
    loading,
    
    // Setters
    setConversationId, 
    setDeleteThisMessage,
    setGoToProfile,
    
    // Participant Info
    participantUsername,
    participantId,
    
    // Refs
    messagesEndRef,
  };

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
};

export const useMessages = () => useContext(MessagesContext);