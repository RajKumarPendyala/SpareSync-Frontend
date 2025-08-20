import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IP_ADDRESS } from '@env';

interface ReviewPayload {
  sparePartId: string;
  rating: number;
  comment: string;
  imagePaths: string[];
}

export const submitReview = async ({
  sparePartId,
  rating,
  comment,
  imagePaths,
}: ReviewPayload): Promise<{ success: boolean; message: string }> => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      return { success: false, message: 'Please log in to submit a review.' };
    }

    const response = await axios.post(
      `http://${IP_ADDRESS}:3000/api/users/reviews`,
      {
        sparePartId,
        rating,
        comment,
        imagePaths: imagePaths.map((url) => ({ path: url })),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 201) {
      return { success: true, message: 'Review submitted successfully' };
    } else {
      return { success: false, message: 'Unexpected response from server.' };
    }
  } catch (error: any) {
    console.log('Submit review error:', error?.response?.data || error.message);
    return { success: false, message: 'Failed to submit review.' };
  }
};
