import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IP_ADDRESS } from '@env';

export const deleteUserById = async (userId: string): Promise<string> => {
  const token = await AsyncStorage.getItem('token');

  const res = await axios.patch(
    `http://${IP_ADDRESS}:3000/api/users/`,
    { _id: userId, isDeleted: true },
    {
      headers: { Authorization: `Bearer ${token}` },
      validateStatus: (status) => status === 200 || status === 410,
    }
  );

  return res.data.message || 'User deleted successfully';
};
