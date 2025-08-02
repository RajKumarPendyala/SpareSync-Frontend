import React, { useState, useRef } from 'react';
import { OtpInput } from 'react-native-otp-entry';
import {
  View,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import isValidEmail from '../../utils/isValidEmail';
import validatePassword  from '../../utils/validatePassword';
import validateMobile  from '../../utils/validateMobile';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackParamList } from '../../navigation/StackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import Colors from '../../context/colors';
import styles from '../../styles/auth/registerScreenStyle';
import PrimaryButton from '../../components/primaryButton';
import SecondaryButton from '../../components/secondaryButton';
import {
  handleSignupService,
  sendOtpService,
  verifyEmailService,
} from '../../services/auth/registerService';

const { width } = Dimensions.get('window');

type RegisterScreenNavigationProp = StackNavigationProp<StackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
  route: {
    params: {
      role1: string;
    };
  };
}

const RegisterScreen: React.FC<Props> = ({ navigation, route }) => {
  const { role1 } = route.params;
  const [username, setUsername] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideconfirmPassword, setHideconfirmPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(120);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const partnest_logo = require('../../assets/icons/partnest_logo.png');


  const handleSignup = async () => {
    if (!username || !mobile || !email || !newPassword || !confirmPassword || !role1) {
      setErrorMessage('Please fill all fields.');
      return;
    }

    if (!validateMobile(mobile)) {
      setErrorMessage('Invalid mobile number.');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Invalid email address');
      return;
    }

    if (!isEmailVerified) {
      setErrorMessage('Please verify email address.');
      return;
    }

    const validationError = validatePassword(newPassword);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    if (!(newPassword === confirmPassword)) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const role = await handleSignupService(username, email, mobile, newPassword, role1);
      if (role === 'admin') {
        navigation.replace('AdminTabNav');
      } else if (role === 'seller') {
        navigation.replace('SellerTabNav');
      } else {
        navigation.replace('BuyerTabNav');
      }

    } catch (error: any) {
      if (error.response) {
        setErrorMessage(`Server error: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        setErrorMessage('No response from server.');
      } else {
        setErrorMessage(`Error: ${error.message}`);
      }

    } finally {
      setLoading(false);
    }

  };

  const modal = async () => {
    if (isEmailVerified) {return;}

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Invalid email address');
      return;
    }
    if (await handleResendOtp()) {
      setModalVisible(true);
      startTimer();
      return () => clearInterval(intervalRef.current as ReturnType<typeof setInterval>);
    }
  };

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

console.log('RegisterScreen - handleSignup');

    setLoading(true);
    // if (!isResendEnabled) {return;}
    try {
      await sendOtpService(email);
      startTimer();
      return true;
    } catch (error: any) {
      if (error.response?.data?.message) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } finally{
      setLoading(false);
    }
  };


  const verification = async () => {
    setLoading(true);
    try {
      const success = await verifyEmailService(email, otp);
      if (!success) {
        Alert.alert('Error', 'Failed to verify email. Please try again.');
        setModalVisible(false);
        return;
      }
      setIsEmailVerified(true);
      setModalVisible(false);
      Alert.alert('Success', 'Email verified successfully. Please signup.');
    } catch (error: any) {
      if (error.response?.data?.message) {
        console.log('Error: ', error.response.data.message);
        Alert.alert('Error', 'Failed to verify email. Please try again.');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
      setModalVisible(false);
    } finally{
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={partnest_logo} style={styles.logo} resizeMode="contain" />

      <Text style={styles.title}>Become a {role1 === 'seller' ? 'Seller' : 'Buyer'}</Text>

      <View style={styles.inputWrapper}>
        <Icon name="account-outline" size={20} color={Colors.icon} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="User name"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Icon name="phone-outline" size={20} color={Colors.icon} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Mobile No"
          keyboardType="phone-pad"
          maxLength={10}
          value={mobile}
          onChangeText={setMobile}
        />
      </View>


      <View style={styles.inputWrapper}>
        <Icon name="email-outline" size={20} color={Colors.icon} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          editable={!isEmailVerified}
          autoCapitalize="none"
          onChangeText={setEmail}
        />
        <PrimaryButton
          title={isEmailVerified ? 'verified' : 'verify'}
          disabled={loading}
          onPress={modal}
          loading={loading}
          borderRadius={6}
          textStyle={styles.verifyText}
          viewStyle={styles.verifyButton}
        />
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <View style={styles.inputWrapper1}>
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
              {
                loading ? ( <ActivityIndicator size="small" color={Colors.background} /> ) :
                <Text style={[styles.timerText, { color: isResendEnabled ? Colors.primary : Colors.secondary }]}>
                  {isResendEnabled ? 'Resend OTP' : formatTime(timer)}
                </Text>
              }
            </TouchableOpacity>

            <SecondaryButton
              title="Verify"
              disabled={loading}
              onPress={verification}
              loading={loading && !isEmailVerified}
            />
          </View>
        </View>
      </Modal>


      <View style={styles.inputWrapper}>
        <Icon name="lock-outline" size={20} color={Colors.icon} style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
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

      <View style={styles.inputWrapper}>
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

      {errorMessage ? (
        <View>
            <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : null}

      <PrimaryButton
        title="Signup"
        width={width * 0.85}
        height={45}
        disabled={loading}
        borderRadius={8}
        onPress={handleSignup}
        loading={loading && isEmailVerified}
        viewStyle={styles.signupButton}
      />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>Already have an account?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
      <Text style={styles.termsText}>
        By signing up you accept our{' '}
        <Text style={styles.link}>terms & conditions</Text>.
      </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default RegisterScreen;
