import React, { useState, useEffect, useRef } from 'react';
import { OtpInput } from 'react-native-otp-entry';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../navigation/StackNavigator';
import validatePassword from '../../utils/validatePassword';
import Colors from '../../context/colors';
import styles from '../../styles/auth/passwordResetScreenStyle';
import { resendOtp, resetPassword } from '../../services/auth/passwordResetService';



type PasswordResetScreenNavigationProp = StackNavigationProp<StackParamList, 'PasswordReset'>;

interface Props {
  navigation: PasswordResetScreenNavigationProp;
  route: {
    params: {
      email: string;
    };
  };
}

const PasswordResetScreen: React.FC<Props> = ({ navigation, route }) => {
  const { email } = route.params;

  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timer, setTimer] = useState(120);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideconfirmPassword, setHideconfirmPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const partnest_logo = require('../../assets/icons/partnest_logo.png');

  useEffect(() => {
    startTimer();
    return () => clearInterval(intervalRef.current as ReturnType<typeof setInterval>);
  }, []);

  const startTimer = () => {
    setIsResendEnabled(false);
    setTimer(120);

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current as ReturnType<typeof setInterval>);
          setIsResendEnabled(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleResendOtp = async () => {
    console.log('PasswordResetScreen - handleResendOtp', email);

    if (!isResendEnabled) {
      return;
    }

    try {
      await resendOtp(email);
      startTimer();
      setErrorMessage('OTP sent successfully.');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };


  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      setErrorMessage('Please enter OTP and passwords.');
      return;
    }

    const validationError = validatePassword(newPassword);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please try again.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      await resetPassword(email, otp, newPassword);
      navigation.replace('Login');
      Alert.alert('Success', 'Password reset successful. Please login.');
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };


  const handleCancel = () => {
    clearInterval(intervalRef.current as ReturnType<typeof setInterval>);
    navigation.replace('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={partnest_logo} style={styles.logo} resizeMode="contain" />
      <View style={styles.inputWrapper}>
        <OtpInput
          numberOfDigits={6}
          onTextChange={setOtp}
          focusColor={Colors.primary}
          type="numeric"
          hideStick={true}
          placeholder="******"
          theme={{
            pinCodeContainerStyle: styles.pinCodeContainer,
            pinCodeTextStyle: styles.pinCodeText,
          }}
        />
      </View>

      <TouchableOpacity disabled={!isResendEnabled} onPress={handleResendOtp} style={styles.timer}>
        <Text style={[styles.timerText, { color: isResendEnabled ? Colors.primary : Colors.secondary }]}>
          {isResendEnabled ? 'Resend OTP' : formatTime(timer)}
        </Text>
      </TouchableOpacity>

      <View style={styles.inputWrapper1}>
        <Icon name="lock-outline" size={20} color={Colors.icon} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="New password"
          secureTextEntry={hideNewPassword}
          value={newPassword}
          autoCapitalize="none"
          onChangeText={setNewPassword}
        />
        <TouchableOpacity onPress={() => setHideNewPassword(!hideNewPassword)}>
          <Icon
            name={hideNewPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={Colors.icon}
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputWrapper1}>
        <Icon name="lock-outline" size={20} color={Colors.icon} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          secureTextEntry={hideconfirmPassword}
          value={confirmPassword}
          autoCapitalize="none"
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity onPress={() => setHideconfirmPassword(!hideconfirmPassword)}>
          <Icon
            name={hideconfirmPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={Colors.icon}
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Text style={styles.resetText}>Reset</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} disabled={loading}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PasswordResetScreen;
