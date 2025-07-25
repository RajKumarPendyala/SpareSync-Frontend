import { useEffect, useState } from 'react';
import {
    View,
    Image,
  } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackParamList } from '../../navigation/StackNavigator';
import styles from '../../styles/auth/onBoardingScreenStyle';

type OnBoardingScreenNavigationProp = StackNavigationProp<StackParamList, 'OnBoarding'>;

interface Props {
    navigation: OnBoardingScreenNavigationProp;
}

const OnBoardingScreen: React.FC<Props> = ({ navigation }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>('');

  const partnest_logo = require('../../assets/icons/partnest_logo.png');

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem('token');
        // await AsyncStorage.removeItem('role');
        const role = await AsyncStorage.getItem('role');
        setUserRole(role);
        setIsLoggedIn(!!userData);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn && userRole) {
        navigation.replace(
          userRole === 'admin'
            ? 'AdminTabNav'
            : userRole === 'seller'
            ? 'SellerTabNav'
            : 'BuyerTabNav'
        );
      } else {
        navigation.replace('Login');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isLoggedIn, userRole]);


return (
  <View style={styles.container}>
    <Image source={partnest_logo} style={styles.logo} resizeMode="contain" />
  </View>
);
};

export default OnBoardingScreen;
