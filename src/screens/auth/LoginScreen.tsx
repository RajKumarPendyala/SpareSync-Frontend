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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import isValidEmail from '../../utils/isValidEmail';
import { StackParamList } from '../../navigation/StackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import Colors from '../../context/colors';
import styles from '../../styles/auth/loginScreenStyle';
import { loginUser } from '../../services/auth/loginService';


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
      const { role } = await loginUser(email, password);

      if (role === 'admin') {
        navigation.replace('AdminTabNav');
      } else if (role === 'seller') {
        navigation.replace('SellerTabNav');
      } else if (role === 'buyer') {
        navigation.replace('BuyerTabNav');
      }
    } catch (err: any) {
      setError(err.message);
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
