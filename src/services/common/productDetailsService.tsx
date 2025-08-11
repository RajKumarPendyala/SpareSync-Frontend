import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IP_ADDRESS } from '@env';


export const sendChatMessage = async (addedBy: string) => {
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.post(
    `http://${IP_ADDRESS}:3000/api/users/conversations/message`,
    {
      senderId2: addedBy,
      text: 'How Can I Help You!',
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};


export const addProductToCart = async (productId: string) => {
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.post(
    `http://${IP_ADDRESS}:3000/api/users/cart/items/`,
    { sparePartId: productId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};


export const deleteProduct = async (productId: string) => {
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.patch(
    `http://${IP_ADDRESS}:3000/api/users/products/`,
    { _id: productId, isDeleted: true },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};
