import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import AuthContext from '../AuthContext';
import { useSnackbar } from './SnackbarContext';
import { apiFetch } from '../api/Fetch';

const MessagesContext = createContext();
const API_URL = process.env.REACT_APP_API_URL;

export const MessagesProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { showSnackbar } = useSnackbar();

  // --- State ---
  const [conversations, setConversations] = useState([]); 
  const [messages, setMessages] = useState([]);           
  const [conversationId, setConversationId] = useState(null); 
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(false);

  const [typing, setTypingState] = useState(false);       // local user typing
  const [typingUsers, setTypingUsers] = useState({}); 


  // Participants state
  const [participantUsername, setParticipantUsername] = useState(null);
  const [participantId, setParticipantId] = useState(null);

  // Actions state
  const [deleteThisMessage, setDeleteThisMessage] = useState(null);
  const [goToProfile, setGoToProfile] = useState(null);

  // --- Refs ---
  const socketRef = useRef(null);

  const setTyping = useCallback((value) => {
  setTypingState(value);

  const socket = socketRef.current;
  if (!socket || !socket.connected || !conversationId) return;

  console.log("EMIT typing:set", { roomId: conversationId, isTyping: value, userId: user?.id });
  socket.emit("typing:set", { roomId: conversationId, isTyping: value, userId: user?.id});
}, [conversationId]);



  const messageQueue = useRef([]);
  const messagesEndRef = useRef(null);
   
  const activeConversationIdRef = useRef(null);

  useEffect(() => {
    activeConversationIdRef.current = conversationId;
  }, [conversationId]);


  // =========================================================
  // 1. FETCH CONVERSATIONS LIST
  // =========================================================
  const fetchConversations = useCallback(async () => {
    try {
      const data = await apiFetch("/conversations");
      setConversations(Array.isArray(data) ? data : []);
    } catch (err) {
      // If not logged in / unauthorized, just clear
      console.error(err);
      setConversations([]);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // =========================================================
  // FIXED: SYNC ACTIVE PARTICIPANT FROM CONVERSATIONS LIST
  // =========================================================
  useEffect(() => {
    // 1. Safety checks
    if (!conversationId || conversations.length === 0 || !user) return;

    // 2. Find the SPECIFIC active conversation in the list
    const activeConv = conversations.find((c) => c.id === conversationId);

    if (activeConv && activeConv.participants) {
        // 3. Find the participant that is NOT the current logged-in user
        // We must look at p.user.id, not p.id
        const otherParticipantWrapper = activeConv.participants.find(
            (p) => p.user?.id !== user.id
        );

        if (otherParticipantWrapper && otherParticipantWrapper.user) {
            const otherUser = otherParticipantWrapper.user;
            
            // Set the correct UUID and Username
            setParticipantUsername(otherUser.username);
            setParticipantId(otherUser.id);
        }
    }
  }, [conversations, conversationId, user]);


  // =========================================================
  // 2. SOCKET CONNECTION & GLOBAL EVENTS
  // =========================================================
  useEffect(() => {

    // Initialize Socket
    const socket = io(API_URL, {
      withCredentials: true,
      autoConnect: true,
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      if (messageQueue.current.length > 0) {
        messageQueue.current.forEach((item) => socket.emit('sendMessage', item));
        messageQueue.current = [];
      }
    });

    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', (err) => console.error(err));

    // Inside MessagesProvider (Frontend)
socket.on("typing:update", (payload) => {
  const { roomId, userId, isTyping } = payload;

  setTypingUsers(prev => {
    const currentUsers = prev[roomId] || [];
    
    if (isTyping) {
      // Add user if not already in list
      if (!currentUsers.includes(userId)) {
        return { ...prev, [roomId]: [...currentUsers, userId] };
      }
    } else {
      // Remove user
      return { ...prev, [roomId]: currentUsers.filter(id => id !== userId) };
    }
    return prev;
  });
});

    // --- HANDLE INCOMING MESSAGES ---
    socket.on('newMessage', (msg) => {
      if (activeConversationIdRef.current === msg.conversationId) {
        setMessages((prev) => {
          if (prev.find((m) => m.id === msg.id)) return prev; 
          return [...prev, msg];
        });
      }
      // This fetch triggers the "Sync" useEffect above!
      fetchConversations();
    });

    socket.on('messageDeleted', (messageId) => {
      fetchConversations();
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    });

    return () => socket.disconnect();
  }, [fetchConversations]); 


  useEffect(() => {
  const socket = socketRef.current;
  if (!socket || !socket.connected || !conversationId) return;

  // Join the active conversation room
  socket.emit("room:join", { roomId: conversationId });

  // Optional: clear typing users when switching conversations
  setTypingUsers(prev => ({ ...prev, [conversationId]: [] }));
}, [conversationId, connected]);

  // =========================================================
  // 3. FETCH ACTIVE CHAT MESSAGES & PARTICIPANTS
  // =========================================================
  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    const loadConversationData = async () => {
      setLoading(true);
      setError(false);

      try {
        // A) Messages
        const msgData = await apiFetch(`/messages/${conversationId}`, {
          headers: {
            "x-frontend-key": process.env.REACT_APP_FRONTEND_KEY || "",
          },
        });
        setMessages(Array.isArray(msgData) ? msgData : []);

        // B) Participants
        const partData = await apiFetch(`/conversations/${conversationId}/participants`, {
          headers: { "Content-Type": "application/json" },
        });

        if (Array.isArray(partData)) {
          const otherParticipant = partData.find((p) => p.id !== user.id);
          if (otherParticipant) {
            setParticipantUsername(otherParticipant.username);
            setParticipantId(otherParticipant.id);
          }
        }
      } catch (err) {
        console.error(err);
        setError(true);
        // showSnackbar({ message: "Failed to load conversation", severity: "error" });
      } finally {
        setLoading(false);
      }
    };

    loadConversationData();
  }, [conversationId, user, showSnackbar]);


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
      messageQueue.current.push(payload);
    }
  }, [user?.id, conversationId]);


  useEffect(() => {
    if (!deleteThisMessage ) return;

    const deleteMessage = async () => {
      try {
        const endpoint = user.role?.toLowerCase() === 'admin'
            ? `${API_URL}/messages/admin/${deleteThisMessage}`
            : `${API_URL}/messages/${deleteThisMessage}`;

        await apiFetch(endpoint, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });


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
  }, [deleteThisMessage, user?.role, showSnackbar]);

  const value = {
    conversations, messages, sendMessage, connected, loading,
    setConversationId, setDeleteThisMessage, setGoToProfile,
    participantUsername, participantId, messagesEndRef, error, typing, setTyping, typingUsers
  };

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
};

export const useMessages = () => useContext(MessagesContext);