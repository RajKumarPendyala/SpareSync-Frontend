import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IP_ADDRESS } from '@env';
import validateMobile from '../../utils/validateMobile';


export const fetchUserProfile = async () => {
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.get(
    `http://${IP_ADDRESS}:3000/api/users/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


export const updateUserProfile = async (profile: any, imageUrl?: string) => {
  if (!validateMobile(profile.phoneNumber)) {
    throw new Error('Invalid mobile number.');
  }

  const token = await AsyncStorage.getItem('token');
  if (!token) {
    throw new Error('User not authenticated.');
  }

  const updateData: any = {
    name: profile.name,
    phoneNumber: profile.phoneNumber,
    houseNo: profile.address.houseNo,
    street: profile.address.street,
    postalCode: profile.address.postalCode,
    city: profile.address.city,
    state: profile.address.state,
  };

  if (imageUrl) {
    updateData.imagePath = imageUrl;
  }

  const response = await axios.patch(
    `http://${IP_ADDRESS}:3000/api/users/profile`,
    { updateData },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};


export const logoutUser = async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('role');
};


export const getUserRole = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('role');
};
