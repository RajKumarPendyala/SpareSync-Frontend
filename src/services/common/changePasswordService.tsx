import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IP_ADDRESS } from '@env';

const BASE_URL = `http://${IP_ADDRESS}:3000/api/users`;

export const changePasswordService = async (
  currentPassword: string,
  newPassword: string
): Promise<boolean> => {
  const token = await AsyncStorage.getItem('token');

  const response = await axios.patch(
    `${BASE_URL}/change-password`,
    { currentPassword, newPassword },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.success;
};
