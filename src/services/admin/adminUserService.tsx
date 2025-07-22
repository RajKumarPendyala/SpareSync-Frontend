import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IP_ADDRESS } from '@env';

export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: number;
  image?: {
    path: string;
  };
}

export const fetchUsersByRole = async (role = ''): Promise<User[]> => {
  const token = await AsyncStorage.getItem('token');

  const res = await axios.get(`http://${IP_ADDRESS}:3000/api/users/`, {
    params: { role },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.users;
};
