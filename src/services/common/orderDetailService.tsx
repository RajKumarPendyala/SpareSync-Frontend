import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IP_ADDRESS } from '@env';

export const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await axios.patch(
      `http://${IP_ADDRESS}:3000/api/users/orders/admin`,
      { orderId, shipmentStatus: newStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return 'success';
    }
  } catch (error: any) {
    return error?.response?.data?.message || error.message;
  }
};

export const cancelOrder = async (orderId: string) => {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await axios.patch(
      `http://${IP_ADDRESS}:3000/api/users/orders`,
      { orderId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.status === 200;
  } catch (error: any) {
    console.error('Error canceling order:', error?.response?.data || error.message);
    throw new Error('Failed to cancel order');
  }
};
