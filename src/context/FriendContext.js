import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AuthContext from '../AuthContext'; 
import { useSnackbar } from './SnackbarContext'; 
import { useMessages } from './MessagesContext'; // 1. Import Messages Hook
import { useNavigate } from 'react-router-dom'; // Optional: To redirect to chat

const FriendContext = createContext();

export const useFriendContext = () => useContext(FriendContext);

export const FriendProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const { showSnackbar } = useSnackbar();
  
  // 2. Consume Messages Context
  // Now you have access to the live list of conversations and the setter
  const { conversations, setConversationId } = useMessages(); 
  
  const navigate = useNavigate(); // Optional: used for redirection
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  // --- STATES ---
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]); 
  const [friendRequestStatus, setFriendRequestStatus] = useState([]); 

  // --- NEW: Helper to link Friend -> Conversation ---
  const openChatWithFriend = (friendId) => {
    // A. Search existing conversations for this friend
    // (Assuming conversation.participants is an array of users)
    const existingConvo = conversations.find(c => 
      c.participants && c.participants.some(p => p.id === friendId)
    );

    if (existingConvo) {
      console.log("Found existing chat, opening:", existingConvo.id);
      setConversationId(existingConvo.id); // Set active chat in MessagesContext
      navigate('/chat'); // Redirect to chat page
    } else {
      console.log("No chat found, you might need to create one via API first");
      // Logic to create a new empty conversation via API usually goes here
      // Or set a temporary "new" state
    }
  };

  // --- 1. GET FRIENDS ---
  const fetchFriends = useCallback(async () => {
    if (!user?.accessToken) return;
    try {
      const res = await fetch(`${API_URL}/friendships/friends`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      if (res.ok) setFriends(await res.json());
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  }, [user, API_URL]);

  // --- 2. GET PENDING REQUESTS ---
  const getFriendRequestStatus = useCallback(async () => {
    if (!user?.accessToken) return;
    try {
      const res = await fetch(`${API_URL}/friendships/pending`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setFriendRequestStatus(Array.isArray(data) ? data : [data]);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  }, [user, API_URL]);

  // --- 3. SEARCH USERS ---
  const handleSearch = async (query) => {
    if (!query || query.length === 0) {
      setFriendRequests([]);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/users/search/${query.trim()}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      if (!res.ok) return;
      const users = await res.json();
      
      // Filter out people who are already friends
      // Note: We check against the current 'friends' state
      const friendIds = friends.map(f => f.friend ? f.friend.id : f.id);
      const filteredUsers = users.filter(u => !friendIds.includes(u.id));
      
      setFriendRequests(filteredUsers);
    } catch (err) {
      console.error(err);
    }
  };

  // --- 4. SEND REQUEST ---
  const handleSendRequest = async (userId) => {
    try {
      const res = await fetch(`${API_URL}/friendships/request/${userId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}` 
        },
      });
      if (res.ok) {
        showSnackbar({ message: 'Friend request sent', severity: 'success' });
        setFriendRequests(prev => prev.filter(u => u.id !== userId));
        return true; 
      } else {
        showSnackbar({ message: res.response?.data?.message || 'Failed to send friend request', severity: 'error' });
        return false;
      }
    } catch (error) {
        showSnackbar({ message: 'An error occurred', severity: 'error' });
        return false;
    }
  };

  // --- 5. RESPOND (ACCEPT/REJECT) ---
  const handleFriendshipResponse = async (requestId, accept) => {
    try {
      const res = await fetch(`${API_URL}/friendships/respond/${requestId}`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.accessToken}` 
        },
        body: JSON.stringify({ accept }),
      });
      
      if (res.ok) {
        showSnackbar({ message: accept ? 'Friend request accepted' : 'Friend request rejected', severity: 'success' });
        getFriendRequestStatus(); 
        if(accept) fetchFriends();
        return true;
      } else {
        showSnackbar({ message: 'Failed to accept friend request', severity: 'error' });
      }
    } catch (error) {
        showSnackbar({ message: 'An error occurred', severity: 'error' });
    }
    return false;
  };

  // --- 6. REMOVE FRIEND ---
  const handleRemoveFriend = async (friendshipId) => {
    if(!friendshipId) return;
    try {
      const res = await fetch(`${API_URL}/friendships/remove/${friendshipId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      if (res.ok) {
        showSnackbar({ message: 'Friend removed', severity: 'success' });
        fetchFriends(); 
        return true;
      } else {
        showSnackbar({ message: 'Failed to remove friend', severity: 'error' });
      }
    } catch (error) {
        showSnackbar({ message: 'An error occurred', severity: 'error' });
    }
    return false;
  };

  // --- 7. HELPER FOR PROFILE PAGE ---
  const checkIsFriend = async (userId) => {
     try {
       const res = await fetch(`${API_URL}/friendships/is-friend/${userId}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      });
      if (res.ok) return await res.json();
     } catch(e) { console.error(e); }
     return null;
  }

  useEffect(() => {
    if (user?.accessToken) {
      fetchFriends();
      getFriendRequestStatus();
    }
  }, [user, fetchFriends, getFriendRequestStatus]);

  const refetchFriends = () => {
    fetchFriends();
  }

  return (
    <FriendContext.Provider value={{
      friends,
      friendRequests,       
      friendRequestStatus,  
      handleSearch,
      handleSendRequest,
      getFriendRequestStatus,
      handleFriendshipResponse,
      handleRemoveFriend,
      checkIsFriend,         
      setFriendRequests,      
      refetchFriends,
      conversations,
      openChatWithFriend 
    }}>
      {children}
    </FriendContext.Provider>
  );
};

export default FriendContext;