import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IP_ADDRESS } from '@env';

import io from 'socket.io-client';
let socket: any;

export const fetchConversations = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`http://${IP_ADDRESS}:3000/api/users/conversations`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      conversations: response.data.conversations,
      userId: response.data.userId,
    };
  } catch (error: any) {
    console.log('Error fetching conversations:', error?.response?.data || error.message);
    throw new Error('Failed to fetch conversations');
  }
};

export const connectConversationsSocket = (userid: string,
  setConversations: (conversations: any) => void,
  setCurrentUserId: (currentUserId: any) => void) => {
  // ⚡ Connect socket with userId
  socket = io(`http://${IP_ADDRESS}:3000`, {
    query: { userId : userid },
  });

  // 📡 Listen
  socket.on('conversations', ({ conversations, userId }: { conversations: any, userId: any }) => {
    console.log('socket conversations:', conversations);
    setCurrentUserId(userId);
    setConversations(conversations);
  });
};

export const disconnectConversationsSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};
