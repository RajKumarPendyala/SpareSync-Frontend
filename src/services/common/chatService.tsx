import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IP_ADDRESS } from '@env';

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
    console.error('Error fetching conversations:', error?.response?.data || error.message);
    throw new Error('Failed to fetch conversations');
  }
};
