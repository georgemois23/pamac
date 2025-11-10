import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import AuthContext from '../AuthContext';
import { set } from 'mongoose';
import { useSnackbar } from './SnackbarContext';


const MessagesContext = createContext();

const API_URL = process.env.REACT_APP_API_URL;
const socket = io(API_URL, { autoConnect: false });

export const MessagesProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteThisMessage, setDeleteThisMessage] = useState(null);
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);

const { showSnackbar } = useSnackbar();
  useEffect(() => {
  const deleteMessage = async () => {
    if (!deleteThisMessage) return; 

    try {
      if (!user) throw new Error('User not authenticated');

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
    } catch (err) {
      console.error(err);
    } finally {
      showSnackbar({message: 'Message deleted successfully!', severity: 'success' });
      setDeleteThisMessage(null);
    }
  };

  deleteMessage();
}, [deleteThisMessage, user]);


  useEffect(() => {
    if (!user) return; 

    setLoading(true);
    socket.connect();

     fetch(`${API_URL}/messages`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load messages', err);
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
  if (msg.user.id === user.id) return; // don’t duplicate your own
  setMessages((prev) => [...prev, msg]);
});

    return () => {
      socket.off('newMessage');
      socket.disconnect();
    };
  }, [user]);

const sendMessage = (content) => {
  if (!content.trim()) return;

  const tempId = Date.now(); // temporary unique id for the message
  const newMsg = {
    id: tempId,
    content,
    user: { ...user },
    createdAt: new Date().toISOString(),
    pending: true, // mark as pending
  };

  // Show message immediately
  setMessages((prev) => [...prev, newMsg]);

  // Send to server
  socket.emit('sendMessage', { message: content, userId: user.id }, (response) => {
    // Callback from server with success/failure
    if (response.success) {
      // Replace temp message with server message (if server adds id or timestamp)
      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempId ? { ...msg, ...response.message, pending: false } : msg))
      );
    } else {
      // Remove the message if server rejects
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      console.error('Message failed to send:', response.error);
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
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => useContext(MessagesContext);
