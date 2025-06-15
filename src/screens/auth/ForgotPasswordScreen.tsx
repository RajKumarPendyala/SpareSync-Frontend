import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackParamList } from '../../navigation/StackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import isValidEmail from '../../utils/isValidEmail';
import Colors from '../../context/colors';
import axios from 'axios';
import { IP_ADDRESS } from '@env';

const { width } = Dimensions.get('window');

type PasswordResetScreenNavigationProp = StackNavigationProp<StackParamList, 'PasswordReset'>;

interface Props {
  navigation: PasswordResetScreenNavigationProp;
}

const ForgotPasswordScreen: React.FC<Props> = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const partnest_logo = require('../../assets/icons/partnest_logo.png');

  const handleSend = async () => {

console.log('forgotPasswordScreen - handleSend');

    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);

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

      if(response){
        setErrorMessage('');
        navigation.replace('PasswordReset', { email });
      }

    } catch (error: any) {
      if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={partnest_logo} style={styles.logo} resizeMode="contain" />

      <Text style={styles.infoText}>
        Enter your email address. An OTP will be sent to your email to reset your password.
      </Text>

      <View style={styles.inputContainer}>
        <Icon name="email-outline" size={20} color={Colors.icon} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={loading}>
        {
          loading ? ( <ActivityIndicator size="small" color={Colors.background} /> ) :
          ( <Text style={styles.sendText}>Send</Text> )
        }
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 25,
  },
  logo: {
    height: width * 0.5,
    width: width * 0.5,
    marginBottom: 30,
  },
  infoText: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.85,
    borderWidth: 1,
    borderColor: Colors.inputContainerBD,
    backgroundColor: Colors.inputContainerBG,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  icon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  sendButton: {
    width: width * 0.85,
    height: 45,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryButtonBG,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  sendText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  errorText: {
    color: Colors.secondary,
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
  },
  successText: {
    color: 'green',
    fontSize: 14,
    marginBottom: 5,
    textAlign: 'center',
  },
});

export default ForgotPasswordScreen;
