import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IP_ADDRESS } from '@env';

const BASE_URL = `http://${IP_ADDRESS}:3000/api/users`;

export const fetchConversationService = async (conversationId: string) => {
  const token = await AsyncStorage.getItem('token');

  const response = await axios.get(`${BASE_URL}/conversations/messages`, {
    params: { conversationId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const sendMessageService = async (receiverId: string, text: string) => {
  const token = await AsyncStorage.getItem('token');

  const response = await axios.post(
    `${BASE_URL}/conversations/message`,
    { receiverId, text },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};

export const deleteConversationService = async (otherUserId: string) => {
  const token = await AsyncStorage.getItem('token');

  const response = await axios.patch(
    `${BASE_URL}/conversations`,
    { id: otherUserId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};
