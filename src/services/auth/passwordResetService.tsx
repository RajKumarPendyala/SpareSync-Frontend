import axios from 'axios';
import { IP_ADDRESS } from '@env';

// Resend OTP
export const resendOtp = async (email: string): Promise<void> => {
  try {
    await axios.post(`http://${IP_ADDRESS}:3000/api/users/forgot-password`, { email }, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    throw new Error('Failed to resend OTP. Please try again.');
  }
};

// Reset Password
export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
): Promise<void> => {
  try {
    const response = await axios.patch(`http://${IP_ADDRESS}:3000/api/users/reset-password`, {
      email,
      otp,
      newPassword,
    }, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.data.success) {
      throw new Error('Password reset failed. Please try again.');
    }
  } catch (error: any) {
    const message =
      error.response?.data?.message || 'Something went wrong. Please try again.';
    throw new Error(message);
  }
};
