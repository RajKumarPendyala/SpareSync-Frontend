import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IP_ADDRESS } from '@env';

export const fetchOrdersService = async (status: string = 'all') => {
  try {
    const token = await AsyncStorage.getItem('token');
    const role = await AsyncStorage.getItem('role');

    const baseUrl =
      role === 'admin'
        ? `http://${IP_ADDRESS}:3000/api/users/orders/admin`
        : `http://${IP_ADDRESS}:3000/api/users/orders`;

    const url = status === 'all' ? baseUrl : `${baseUrl}?status=${status}`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      success: true,
      data: response.data.orders,
      role: role,
    };
  } catch (error: any) {
    console.log('Error in fetchOrdersService:', error?.response?.data || error.message);
    return {
      success: false,
      message: 'Failed to fetch orders',
    };
  }
};
