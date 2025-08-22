import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import styles from '../../styles/common/walletScreenStyles';
import PrimaryButton from '../../components/primaryButton';
import SecondaryButton from '../../components/secondaryButton';
import { RouteProp, useRoute } from '@react-navigation/native';
import { StackParamList } from '../../navigation/StackNavigator';
import { useProfile } from '../../context/ProfileContext';
import {
  fetchUserProfile,
  updateWalletBalance,
  connectWalletSocket,
  disconnectWalletSocket,
} from '../../services/common/walletService';

const quickAmounts = [100, 1000, 10000, 200, 2000, 20000, 500, 5000, 50000];


const WalletScreen = () => {
  const [wAmount, setWalletAmount] = useState<number>(0);
  const [inputAmount, setInputAmount] = useState('');
  const { setProfile } = useProfile();
  const route = useRoute<RouteProp<StackParamList, 'Wallet'>>();
  const roleName = route.params?.roleName ?? null;

  console.log(roleName);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const data = await fetchUserProfile();
        const user = data.user;

    console.log(data);

        setProfile({
          ...user,
          image: user.image || { path: '' },
          address: {
            houseNo: '',
            street: '',
            postalCode: '',
            city: '',
            state: '',
            ...user.address,
          },
        });

        setWalletAmount(parseFloat(user.walletAmount?.$numberDecimal || '0'));

        connectWalletSocket(user._id, (walletAmount: number) => {
          setWalletAmount(walletAmount);
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch balance.');
        console.log('Error fetching balance:', error);
      }
    };

    fetchBalance();
    return () => {
      disconnectWalletSocket();
    };
  }, [setProfile]);

  const handleAddInputAmount = () => {
    const amount = parseFloat(inputAmount);
    if (amount <= 0) {
      return Alert.alert('Invalid', 'Enter a valid amount');
    }
    if(!amount) {
      return;
    }
    Alert.alert('Confirm', `Add ₹${amount}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          setInputAmount('');
          await updateWalletBalance(amount);
        },
      },
    ]);
  };

  const handleQuickAmount = (amount: number) => {
    Alert.alert('Confirm', `Add ₹${amount}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: async () => {
          await updateWalletBalance(amount);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={roleName !== 'seller' ? styles.headerText : styles.headerText2}>DIGITAL WALLET</Text>
      <Image source={require('../../assets/images/wallet.png')} style={styles.image} resizeMode="contain" />

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Wallet Balance</Text>
        <Text style={styles.balanceValue}>₹ {wAmount.toFixed(2)}</Text>
      </View>

      {roleName !== 'seller' && (
        <>
          <View style={styles.inputRow}>
            <TextInput
              placeholder="Enter amount"
              keyboardType="numeric"
              value={inputAmount}
              onChangeText={setInputAmount}
              style={styles.input}
            />
            <PrimaryButton
              title="Add"
              onPress={handleAddInputAmount}
              viewStyle={styles.addButtonStyle}
            />
          </View>

          <Text style={styles.quickLabel}>Quick Add</Text>
          <View style={styles.quickGrid}>
            {quickAmounts.map(amount => (
              <SecondaryButton
                key={amount}
                title={`₹${amount}`}
                onPress={() => handleQuickAmount(amount)}
                viewStyle={styles.quickButtonStyle}
              />
            ))}
          </View>
        </>
      )}

    </View>
  );
};

export default WalletScreen;
