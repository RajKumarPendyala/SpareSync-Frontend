import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IP_ADDRESS } from '@env';

export interface SparePartPayload {
  name: string;
  description: string;
  price: { $numberDecimal: string };
  discount?: string;
  quantity: number;
  weight?: string;
  dimension?: string;
  color?: string;
  brand: string;
  warrantyPeriod?: string;
  gadgetType: string;
  images: { path: string }[];
}

export const validateSparePartForAdd = (sparePart: any): string | null => {
  if (!sparePart.name?.trim()) {
    return 'Name is required';
  }
  if (!sparePart.description?.trim()) {
    return 'Description is required';
  }
  if (
    !sparePart.price?.$numberDecimal ||
    Number(sparePart.price.$numberDecimal) < 0
  )
    {
        return 'Price must be zero or positive';
    }
  if (
    sparePart.quantity === null ||
    sparePart.quantity === undefined ||
    isNaN(sparePart.quantity) ||
    sparePart.quantity < 0
  )
    {
        return 'Quantity must be zero or positive';
    }
  if (!sparePart.brand?.trim()) {
    return 'Brand is required';
  }
  if (!sparePart.gadgetType) {
    return 'Gadget type is required';
  }

  return null;
};

export const addSparePart = async (sparePart: SparePartPayload) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      return { success: false, message: 'User not authenticated' };
    }

    const payload = {
      ...sparePart,
      quantity: Number(sparePart.quantity),
      imagePaths: sparePart.images || [],
    };

    const response = await axios.post(
      `http://${IP_ADDRESS}:3000/api/users/products/seller`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 201) {
      return {
        success: true,
        message: 'Spare part added successfully',
        createdSparePart: response.data.createdSparePart,
      };
    } else {
      return { success: false, message: 'Creation failed' };
    }
  } catch (error: any) {
    console.error('Add Product Error:', error?.response?.data || error.message);
    return { success: false, message: 'Creation failed' };
  }
};
