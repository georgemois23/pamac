import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import AuthContext from '../AuthContext'; 
import { useSnackbar } from './SnackbarContext'; 
import { useMessages } from './MessagesContext'; // 1. Import Messages Hook
import { useNavigate } from 'react-router-dom'; // Optional: To redirect to chat
import { apiFetch } from '../api/Fetch';

const FriendContext = createContext();

export const useFriendContext = () => useContext(FriendContext);

export const FriendProvider = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext);
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
    try {
      const data = await apiFetch("/friendships/friends");
      setFriends(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching friends:', error);
      setFriends([]);
    }
  }, [user, API_URL]);

  // --- 2. GET PENDING REQUESTS ---
  const getFriendRequestStatus = useCallback(async () => {
     try {
      const data = await apiFetch("/friendships/pending");
      setFriendRequestStatus(Array.isArray(data) ? data : data ? [data] : []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setFriendRequestStatus([]);
    }
  }, []);

  // --- 3. SEARCH USERS ---
  const handleSearch = async (query) => {
    if (!query || query.length === 0) {
      setFriendRequests([]);
      return;
    }
    try {
      const users = await apiFetch(`/users/search/${encodeURIComponent(query.trim())}`);
      const friendIds = friends.map((f) => (f.friend ? f.friend.id : f.id));
      const filteredUsers = (Array.isArray(users) ? users : []).filter(
        (u) => !friendIds.includes(u.id)
      );
      setFriendRequests(filteredUsers);
    } catch (err) {
      console.error(err);
      setFriendRequests([]);
    }
  };

  // --- 4. SEND REQUEST ---
  const handleSendRequest = async (userId) => {
    try {
      await apiFetch(`/friendships/request/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      showSnackbar({ message: "Friend request sent", severity: "success" });
      setFriendRequests((prev) => prev.filter((u) => u.id !== userId));
      return true;
    } catch (error) {
      showSnackbar({ message: error.message || "Failed to send friend request", severity: "error" });
      return false;
    }
  };

  // --- 5. RESPOND (ACCEPT/REJECT) ---
  const handleFriendshipResponse = async (requestId, accept) => {
    try {
      await apiFetch(`/friendships/respond/${requestId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accept }),
      });

      showSnackbar({
        message: accept ? "Friend request accepted" : "Friend request rejected",
        severity: "success",
      });

      await getFriendRequestStatus();
      if (accept) await fetchFriends();
      return true;
    } catch (error) {
      showSnackbar({ message: error.message || "Failed to respond", severity: "error" });
      return false;
    }
  };

  // --- 6. REMOVE FRIEND ---
  const handleRemoveFriend = async (friendshipId) => {
    if (!friendshipId) return false;
    try {
      await apiFetch(`/friendships/remove/${friendshipId}`, { method: "POST" });

      showSnackbar({ message: "Friend removed", severity: "success" });
      await fetchFriends();
      return true;
    } catch (error) {
      showSnackbar({ message: error.message || "Failed to remove friend", severity: "error" });
      return false;
    }
  };

  // --- 7. HELPER FOR PROFILE PAGE ---
   const checkIsFriend = async (userId) => {
    try {
      return await apiFetch(`/friendships/is-friend/${userId}`);
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  useEffect(() => {
    if (isLoading) return;
     if (!user) {              
    setFriends([]);
    setFriendRequestStatus([]);
    return;
  }
    fetchFriends();
    getFriendRequestStatus();
  }, [isLoading, user, fetchFriends, getFriendRequestStatus]);

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