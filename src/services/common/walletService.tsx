import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IP_ADDRESS } from '@env';
import io from 'socket.io-client';

let socket: any;

export const fetchUserProfile = async () => {
  const token = await AsyncStorage.getItem('token');

  const response = await axios.get(`http://${IP_ADDRESS}:3000/api/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateWalletBalance = async (amount: number) => {
  const token = await AsyncStorage.getItem('token');

  await axios.patch(
    `http://${IP_ADDRESS}:3000/api/users/walletc`,
    { amount },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const connectWalletSocket = (userId: string, onWalletUpdate: (walletAmount: number) => void) => {
    // ⚡ Connect socket with userId
    socket = io(`http://${IP_ADDRESS}:3000`, {
    query: { userId },
  });

  // 📡 Listen for wallet updates
  socket.on('walletUpdated', ({ walletAmount }: { walletAmount: number }) => {
    console.log('Wallet updated via socket:', walletAmount);
    onWalletUpdate(walletAmount);
  });
};

export const disconnectWalletSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};
