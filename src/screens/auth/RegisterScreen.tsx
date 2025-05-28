import React, { useState, useRef } from 'react';
import { OtpInput } from 'react-native-otp-entry';
import {
  View,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import { IP_ADDRESS } from '@env';
import isValidEmail from '../../utils/isValidEmail';
import validatePassword  from '../../utils/validatePassword';
import validateMobile  from '../../utils/validateMobile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackParamList } from '../../navigation/StackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import Colors from '../../context/colors';
import axios from 'axios';


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
      const response = await axios.patch(
          `http://${IP_ADDRESS}:3000/api/users/register`,
          {
            name : username,
            email,
            phoneNumber : mobile,
            password : newPassword,
            role : role1,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
      );

      const { token, role } = response.data;
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('role');
      await AsyncStorage.setItem('token',token);
      await AsyncStorage.setItem('role',role);
      if (role === 'admin') {
          navigation.replace('AdminTabNav');
      } else if (role === 'seller') {
          navigation.replace('SellerTabNav');
      } else if (role === 'buyer') {
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
      await axios.post(
        `http://${IP_ADDRESS}:3000/api/users/otp`,
        { email },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
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
      const res = await axios.post(
        `http://${IP_ADDRESS}:3000/api/users/verify-email`,
        { email, otp },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if(!res.data.success) {
        Alert.alert('Error', 'Failed to verify email. Please try again.');
        setModalVisible(false);
      }
      setIsEmailVerified(true);
      setModalVisible(false);
      Alert.alert('Success', 'Email verified successful. Please signup.');
    } catch (error: any) {
      if (error.response?.data?.message) {
        Alert.alert('Error', error.response.data.message);
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
          placeholder="Email id"
          keyboardType="email-address"
          value={email}
          editable={!isEmailVerified}
          autoCapitalize="none"
          onChangeText={setEmail}
        />
        <TouchableOpacity style={styles.verifyButton}
          onPress={modal}
          disabled={loading}>
          {
            loading ? ( <ActivityIndicator size="small" color={Colors.background} /> ) :
            ( <Text style={styles.verifyText}>
              {isEmailVerified ? 'verified' : 'verify'}
              </Text> )
          }
        </TouchableOpacity>
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

            <TouchableOpacity style={styles.closeButton}
              onPress={verification}
              disabled={loading}>
              {
                (loading && !isEmailVerified) ? ( <ActivityIndicator size="small" color={Colors.background} /> ) :
                ( <Text style={styles.closeText}>
                    {isEmailVerified ? 'Verified' : 'Verify'}
                  </Text> )
              }
            </TouchableOpacity>
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

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup} disabled={loading}>
        {
          (loading && isEmailVerified) ? ( <ActivityIndicator size="small" color={Colors.background} /> ) :
          ( <Text style={styles.signupText}>Signup</Text> )
        }
      </TouchableOpacity>

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

const styles = StyleSheet.create({
  container: {
    flexGrow : 1,
    alignItems: 'center',
    paddingTop: 55,
    backgroundColor: Colors.background,
  },
  logo: {
    height: width * 0.6,
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 23,
  },
  inputWrapper: {
    flexDirection: 'row',
    width: width * 0.85,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.inputContainerBD,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: Colors.inputContainerBG,
  },
  inputWrapper1: {
    marginBottom: 15,
  },
  pinCodeContainer: {
    height: 45,
  },
  pinCodeText: {
    fontSize: 18,
  },
  timer: {
    alignSelf: 'flex-end',
    marginBottom: 15,
    marginRight: 10,
    marginTop: -10,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  verifyButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: Colors.primaryButtonBG,
    borderRadius: 6,
    marginLeft: 8,
  },
  verifyText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  icon: {
    marginRight: 6,
  },
  eyeIcon: {
    marginLeft: 'auto',
  },
  signupButton: {
    width: width * 0.85,
    height: 45,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryButtonBG,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  signupText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  loginLink: {
    color: Colors.secondary,
  },
  termsText: {
    marginTop: 20,
    color: Colors.black,
  },
  link: {
    color: Colors.primary,
  },
  errorText: {
    color: Colors.secondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#ffebe6',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeText: {
    color: '#d9534f',
    fontWeight: '600',
  },
});

export default RegisterScreen;
