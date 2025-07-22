import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IP_ADDRESS } from '@env';

export const fetchCartItems = async () => {
  const token = await AsyncStorage.getItem('token');
  const res = await axios.get(`http://${IP_ADDRESS}:3000/api/users/cart/items/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.cartData;
};

export const updateCartItemQuantity = async (sparePartId: string, quantity: number) => {
  const token = await AsyncStorage.getItem('token');
  await axios.patch(
    `http://${IP_ADDRESS}:3000/api/users/cart/items/`,
    { sparePartId, quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const removeCartItem = async (sparePartId: string) => {
  const token = await AsyncStorage.getItem('token');
  const response = await axios.patch(
    `http://${IP_ADDRESS}:3000/api/users/cart/items/buyer`,
    { sparePartId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const placeOrder = async () => {
  const token = await AsyncStorage.getItem('token');
  const response = await axios.post(
    `http://${IP_ADDRESS}:3000/api/users/orders/`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};
