import { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    Image,
  } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackParamList } from '../../navigation/StackNavigator';
import Colors from '../../contexts/colors';

const { width } = Dimensions.get('window');

type OnBoardingScreenNavigationProp = StackNavigationProp<StackParamList, 'OnBoarding'>;

interface Props {
    navigation: OnBoardingScreenNavigationProp;
}

const OnBoardingScreen: React.FC<Props> = ({ navigation }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userRole, setUserRole] = useState('buyer');

  const partnest_logo = require('../../assets/icons/partnest_logo.png');

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem('token');
        const role = await AsyncStorage.getItem('role');
        setUserRole(role);
        setIsLoggedIn(!!userData);
      } catch (error) {
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();

    const timer = setTimeout(() => {

      navigation.replace(
        isLoggedIn
          ? userRole === 'admin'
            ? 'AdminTabNav'
            : userRole === 'seller'
            ? 'SellerTabNav'
            : 'BuyerTabNav'
          : 'Login'
      );

    }, 1000);

    return () => clearTimeout(timer);

  }, []);


return (
  <View style={styles.container}>
    <Image source={partnest_logo} style={styles.logo} resizeMode="contain" />
  </View>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: Colors.background,
},
logo: {
  height: width * 0.8,
  marginBottom: 80,
},
});

export default OnBoardingScreen;
