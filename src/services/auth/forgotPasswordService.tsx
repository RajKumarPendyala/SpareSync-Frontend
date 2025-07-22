import axios from 'axios';
import { IP_ADDRESS } from '@env';

export const sendForgotPasswordRequest = async (email: string) => {
  try {
    const response = await axios.post(
      `http://${IP_ADDRESS}:3000/api/users/forgot-password`,
      { email },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || 'Something went wrong. Please try again.';
    throw new Error(message);
  }
};
