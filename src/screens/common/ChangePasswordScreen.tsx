import React, { useState } from 'react';
import { View, TextInput, Text, Alert, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import validatePassword from '../../utils/validatePassword';
import Colors from '../../context/colors';
import axios from 'axios';
import { IP_ADDRESS } from '@env';

const { width } = Dimensions.get('window');

const ChangePasswordScreen = () => {
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
        const token = await AsyncStorage.getItem('token');

        console.log('Token',token);

        const res = await axios.patch(
            `http://${IP_ADDRESS}:3000/api/users/change-password`,
            {
                currentPassword,
                newPassword,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (res.data.success) {
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            Alert.alert('Success', 'Password changed successful.');
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

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        paddingTop: 60,
        backgroundColor: Colors.background,
    },
    input: {
        flex: 1,
        height: 45,
        fontSize: 16,
    },
    eyeIcon: {
        marginLeft: 'auto',
    },
    icon: {
        marginRight: 6,
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
        marginBottom: 30,
    },
    changeButton: {
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
    changeText: {
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

export default ChangePasswordScreen;
