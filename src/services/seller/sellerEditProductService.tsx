import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IP_ADDRESS } from '@env';

interface SparePartData {
  _id: string;
  name: string;
  description: string;
  price: { $numberDecimal: string };
  discount?: { $numberDecimal?: string };
  quantity: number | string;
  brand: string;
  gadgetType: string;
  dimension?: string;
  color?: string;
  weight?: { $numberDecimal?: string };
  warrentyPeriod?: number | string;
  images: { path: string }[];
}

export const validateSparePart = (data: SparePartData): string | null => {
  const qtyNumber = Number(data.quantity);

  if (!data.name?.trim()) {
    return 'Name is required';
  }
  if (!data.description?.trim()) {
    return 'Description is required';
  }
  if (!data.price?.$numberDecimal || Number(data.price.$numberDecimal) < 0) {
    return 'Price must be zero or positive';
  }
  if (!data.quantity?.toString().trim() || isNaN(qtyNumber) || qtyNumber < 0) {
    return 'Quantity must be zero or positive';
  }
  if (!data.brand?.trim()) {
    return 'Brand is required';
  }
  if (!data.gadgetType) {
    return 'Gadget type is required';
  }

  return null; // No validation errors
};

export const updateSparePart = async (sparePart: SparePartData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      return { success: false, message: 'User not authenticated' };
    }

    const payload = {
      ...sparePart,
      quantity: Number(sparePart.quantity),
      imagePaths: sparePart.images,
    };

    const response = await axios.patch(
      `http://${IP_ADDRESS}:3000/api/users/products/`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return { success: true, message: 'Spare part updated successfully' };
    } else {
      return { success: false, message: 'Update failed' };
    }
  } catch (error: any) {
    console.log('Update error:', error?.response?.data || error.message);
    return { success: false, message: 'Update failed' };
  }
};
