import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { IP_ADDRESS } from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import isValidEmail from '../../utils/isValidEmail';
import { StackParamList } from '../../navigation/StackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import Colors from '../../context/colors';
import styles from '../../styles/auth/LoginScreenStyle';


type LoginScreenNavigationProp = StackNavigationProp<StackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setError] = useState('');

  const partnest_logo = require('../../assets/icons/partnest_logo.png');

  const handleLogin = async () => {

console.log('LoginScreen - handleLogin');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
          `http://${IP_ADDRESS}:3000/api/users/login`,
          { email, password },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
      );

      const { token, role, id } = response.data;
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('role');
      await AsyncStorage.removeItem('id');
      await AsyncStorage.setItem('token',token);
      await AsyncStorage.setItem('role',role);
      await AsyncStorage.setItem('id', id);
      if (role === 'admin') {
          navigation.replace('AdminTabNav');
      } else if (role === 'seller') {
          navigation.replace('SellerTabNav');
      } else if (role === 'buyer') {
          navigation.replace('BuyerTabNav');
      }

    } catch (error: any) {
      if (error.response) {
        setError(`Server error: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        setError('No response from server.');
      } else {
        setError(`Error: ${error.message}`);
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={partnest_logo}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Welcome Back</Text>

      <View style={styles.inputContainer}>
        <Icon name="email-outline" size={20} color={Colors.icon} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock-outline" size={20} color={Colors.icon} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          secureTextEntry={hidePassword}
        />
        <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
          <Icon
            name={hidePassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={Colors.icon}
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>

      {errorMessage ? (
          <View>
              <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
      ) : null}

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.forgotPassword}>
          <Text style={styles.forgotText}>Forgot Password ?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        {
          loading ? ( <ActivityIndicator size="small" color={Colors.background} /> ) :
          ( <Text style={styles.loginText}>Login</Text> )
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={()=> navigation.navigate('Personas')}>
          <Text style={styles.registerText}>Don't have an account ?</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default LoginScreen;
