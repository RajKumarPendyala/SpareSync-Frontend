import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IP_ADDRESS } from '@env';

interface LoginResponse {
  token: string;
  role: 'admin' | 'seller' | 'buyer';
  id: string;
}

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post(
      `http://${IP_ADDRESS}:3000/api/users/login`,
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const { token, role, id } = response.data;

    // Clear old data before setting new session
    await AsyncStorage.multiRemove(['token', 'role', 'id']);
    await AsyncStorage.multiSet([
      ['token', token],
      ['role', role],
      ['id', id],
    ]);

    return { token, role, id };
  } catch (error: any) {
    const message =
      error.response?.data?.message
        ? `Server error: ${error.response.data.message}`
        : error.request
        ? 'No response from server.'
        : `Error: ${error.message}`;
    throw new Error(message);
  }
};
