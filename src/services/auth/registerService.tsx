import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IP_ADDRESS } from '@env';

const BASE_URL = `http://${IP_ADDRESS}:3000/api/users`;

export const handleSignupService = async (
  username: string,
  email: string,
  mobile: string,
  password: string,
  role: string
) => {
  const response = await axios.patch(`${BASE_URL}/register`, {
    name: username,
    email,
    phoneNumber: mobile,
    password,
    role,
  }, {
    headers: { 'Content-Type': 'application/json' },
  });

  const { token, role: userRole } = response.data;
  await AsyncStorage.multiRemove(['token', 'role']);
  await AsyncStorage.setItem('token', token);
  await AsyncStorage.setItem('role', userRole);

  return userRole;
};

export const sendOtpService = async (email: string) => {
  await axios.post(`${BASE_URL}/otp`, { email }, {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const verifyEmailService = async (email: string, otp: string) => {
  const response = await axios.post(`${BASE_URL}/verify-email`, { email, otp }, {
    headers: { 'Content-Type': 'application/json' },
  });

  return response.data.success;
};
