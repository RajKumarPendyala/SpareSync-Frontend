import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IP_ADDRESS } from '@env';

export const fetchSparePartsService = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const roleName = await AsyncStorage.getItem('role');

    const url =
      roleName === 'seller'
        ? `http://${IP_ADDRESS}:3000/api/users/products/seller`
        : `http://${IP_ADDRESS}:3000/api/users/products/`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      role: roleName,
      sparePart: response.data.SpareParts || [],
    };
  } catch (error: any) {
    console.error('Error fetching spare parts:', error?.response?.data || error.message);
    throw new Error('Failed to fetch spare parts');
  }
};

export const addToCartService = async (sparePartId: string) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(
      `http://${IP_ADDRESS}:3000/api/users/cart/items/`,
      { sparePartId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.message;
  } catch (error: any) {
    console.error('Error adding to cart:', error?.response?.data || error.message);
    throw new Error('Failed to add item to cart');
  }
};
