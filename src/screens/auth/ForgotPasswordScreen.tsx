import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackParamList } from '../../navigation/StackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import isValidEmail from '../../utils/isValidEmail';
import Colors from '../../context/colors';
import styles from '../../styles/auth/forgotPasswordScreenStyle';
import { sendForgotPasswordRequest } from '../../services/auth/forgotPasswordService';



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
      await sendForgotPasswordRequest(email);
      setErrorMessage('');
      navigation.replace('PasswordReset', { email });
    } catch (error: any) {
      setErrorMessage(error.message);
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

export default ForgotPasswordScreen;
