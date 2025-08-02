import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackParamList } from '../../navigation/StackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import isValidEmail from '../../utils/isValidEmail';
import Colors from '../../context/colors';
import styles from '../../styles/auth/forgotPasswordScreenStyle';
import { sendForgotPasswordRequest } from '../../services/auth/forgotPasswordService';
import PrimaryButton from '../../components/primaryButton';

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
      setErrorMessage('Please enter your email.');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email.');
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

      <PrimaryButton
        title="Send"
        loading={loading}
        width={width * 0.85}
        onPress={handleSend}
        disabled={loading}
        height={45}
        borderRadius={8}
        viewStyle={styles.sendButton}
      />

    </ScrollView>
  );
};

export default ForgotPasswordScreen;
