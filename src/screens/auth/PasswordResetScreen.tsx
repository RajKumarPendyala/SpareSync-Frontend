import React, { useState, useEffect, useRef } from 'react';
import { OtpInput } from 'react-native-otp-entry';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../navigation/StackNavigator';
import validatePassword from '../../utils/validatePassword';
import Colors from '../../contexts/colors';
import axios from 'axios';
import { IP_ADDRESS } from '@env';

const { width } = Dimensions.get('window');

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
    if (!isResendEnabled) {return;}
    try {
      await axios.post(
        `http://${IP_ADDRESS}:3000/api/users/forgot-password`,
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      startTimer();
      setErrorMessage('OTP sent successfully.');
    } catch (err) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
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

    if (!(newPassword === confirmPassword)) {
      setErrorMessage('Passwords do not match. Please try again.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const res = await axios.patch(
        `http://${IP_ADDRESS}:3000/api/users/reset-password`,
        {
          email,
          otp,
          newPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data.success) {
        navigation.replace('Login');
        Alert.alert('Success', 'Password reset successful. Please login.');
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

  const handleCancel = () => {
    clearInterval(intervalRef.current as ReturnType<typeof setInterval>);
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    backgroundColor: Colors.background,
  },
    logo: {
    height: width * 0.5,
    width: width * 0.5,
    marginBottom: 20,
  },
  icon: {
    marginRight: 6,
  },
  eyeIcon: {
    marginLeft: 'auto',
  },
  inputWrapper1: {
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
  inputWrapper: {
    width: width * 0.85,
    marginBottom: 10,
  },
  pinCodeContainer: {
    height: 45,
  },
  pinCodeText: {
    fontSize: 18,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  timer: {
    alignSelf: 'flex-end',
    marginBottom: 15,
    marginRight: 40,
    marginTop: -2,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resetButton: {
    width: width * 0.85,
    height: 45,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: '#e6f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  resetText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  cancelButton: {
    width: width * 0.85,
    height: 45,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.secondary,
    backgroundColor: Colors.secondaryButtonBG,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  cancelText: {
    color: Colors.secondary,
    fontWeight: '600',
  },
  errorText: {
    color: Colors.secondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 5,
  },
});

export default PasswordResetScreen;
