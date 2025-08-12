import React, { useState } from 'react';
import { View, TextInput, Text, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import validatePassword from '../../utils/validatePassword';
import Colors from '../../context/colors';
import styles from '../../styles/common/changePasswordScreenstyle';
import { changePasswordService } from '../../services/common/changePasswordService';
import { useNavigation } from '@react-navigation/native';



const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [hideCurrentPassword, setHideCurrentPassword] = useState(true);
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideconfirmPassword, setHideconfirmPassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
        setErrorMessage('Please enter current Password and new passwords.');
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
        const success = await changePasswordService(currentPassword, newPassword);

        if (success) {
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          Alert.alert('Success', 'Password changed successfully.', [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]);
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
    <View style={styles.container}>
        <View style={styles.inputWrapper1}>
            <Icon name="lock-outline" size={20} color={Colors.icon} style={styles.icon} />
            <TextInput
            style={styles.input}
            placeholder="Current password"
            secureTextEntry={hideCurrentPassword}
            value={currentPassword}
            autoCapitalize="none"
            onChangeText={setCurrentPassword}
            />
            <TouchableOpacity onPress={() => setHideCurrentPassword(!hideCurrentPassword)}>
            <Icon
                name={hideCurrentPassword ? 'eye-off-outline' : 'eye-outline'}
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
      <TouchableOpacity onPress={handleChangePassword} style={styles.changeButton}>
        {loading ? (
            <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
            <Text style={styles.changeText}>Change Password</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ChangePasswordScreen;
