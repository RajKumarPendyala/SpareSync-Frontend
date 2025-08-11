import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IP_ADDRESS } from '@env';


export const addSparePartToCart = async (sparePartId: string) => {
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.post(
    `http://${IP_ADDRESS}:3000/api/users/cart/items/`,
    { sparePartId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
