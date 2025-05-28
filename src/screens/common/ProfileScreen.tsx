import React, { useState, useEffect } from 'react';
import {
  TextInput,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
  Alert,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useProfile } from '../../context/ProfileContext';
import axios from 'axios';
import { IP_ADDRESS } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../navigation/StackNavigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../context/colors';
import validateMobile  from '../../utils/validateMobile';

type ProfileScreenNavigationProp = StackNavigationProp<StackParamList, 'Profile'>;

interface Props {
  navigation: ProfileScreenNavigationProp;
}

const ProfileScreen: React.FC<Props> = ({ navigation }) => {

  const { profile, setProfile } = useProfile();
  const [editable, setEditable] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        const response = await axios.get(
          `http://${IP_ADDRESS}:3000/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

console.log(response);

        setProfile({
          ...response.data.user,
          image: response.data.user.image || { path: '' },
          address: {
            houseNo: '',
            street: '',
            postalCode: '',
            city: '',
            state: '',
            ...response.data.user.address,
          },
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch profile.');
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [setProfile]);

  const handleImageUpload = () => {
console.log('Upload image button clicked');
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      (response) => {
console.log('ImagePicker response:', response);

        if (response.didCancel) {
          console.log('User cancelled image picker');
          return;
        }
        if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
          Alert.alert('Error', 'Failed to select image.');
          return;
        }
        if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;
          setProfile({ ...profile, image: { path: uri } });
        }
      }
    );
  };

  const handleSave = async () => {
    try {

      if (!validateMobile(profile.phoneNumber)) {
        Alert.alert('Error', 'Invalid mobile number.');
        return;
      }

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'User not authenticated.');
        return;
      }

      setEditable(false);

      const updateData = {
        name: profile.name,
        phoneNumber: profile.phoneNumber,
        houseNo: profile.address.houseNo,
        street: profile.address.street,
        postalCode: profile.address.postalCode,
        city: profile.address.city,
        state: profile.address.state,
      };

      const response = await axios.patch(
        `http://${IP_ADDRESS}:3000/api/users/profile`,
        { updateData },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Profile updated successfully.');
        setProfile(response.data.user);
      } else {
        Alert.alert('Error', 'Failed to update profile.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
      console.error('Profile update error:', error);
    }
  };

  const imageUri = `http://${IP_ADDRESS}:3000${profile?.image?.path || ''}`;
  console.log('Image URI:', imageUri);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
      onPress={handleImageUpload}
      >
        <Image
          source={
            profile?.image?.path
              ? { uri: imageUri }
              : require('../../assets/icons/partnest_logo.png')
          }
          style={styles.avatar}
          onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
        />
        <Text style={styles.uploadText}>Upload Profile Image</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        editable={editable}
        value={profile?.name || ''}
        onChangeText={(text) => setProfile({ ...profile, name: text })}
        placeholder="Name"
      />
      <TextInput
        style={styles.input}
        editable={false}
        value={profile?.email || ''}
        placeholder="Email"
      />
      <TextInput
        style={styles.input}
        editable={editable}
        value={String(profile?.phoneNumber || '')}
        onChangeText={(text) => setProfile({ ...profile, phoneNumber: text })}
        placeholder="Phone"
      />

      <Text style={styles.sectionTitle}>Address</Text>

      <TextInput
        style={styles.input}
        editable={editable}
        value={profile?.address?.houseNo || ''}
        onChangeText={(text) => setProfile({ ...profile, address: { ...profile.address, houseNo: text } })}
        placeholder="House No"
      />
      <TextInput
        style={styles.input}
        editable={editable}
        value={profile?.address?.street || ''}
        onChangeText={(text) => setProfile({ ...profile, address: { ...profile.address, street: text } })}
        placeholder="Street"
      />
      <TextInput
        style={styles.input}
        editable={editable}
        value={String(profile?.address?.postalCode || '')}
        onChangeText={(text) => setProfile({ ...profile, address: { ...profile.address, postalCode: text } })}
        placeholder="Postal Code"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        editable={editable}
        value={profile?.address?.city || ''}
        onChangeText={(text) => setProfile({ ...profile, address: { ...profile.address, city: text } })}
        placeholder="City"
      />
      <TextInput
        style={styles.input}
        editable={editable}
        value={profile?.address?.state || ''}
        onChangeText={(text) => setProfile({ ...profile, address: { ...profile.address, state: text } })}
        placeholder="State"
      />

      <Button title={editable ? 'Save' : 'Edit Profile'} onPress={() => (editable ? handleSave() : setEditable(true))} />

      <TouchableOpacity style={styles.changePassword}
        onPress={() => navigation.navigate('ChangePassword')}
      >
        <Icon name="lock" size={20} color="#000" />
        <Text style={styles.changePasswordText}>Change Password</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 10 },
  uploadText: { textAlign: 'center', color: Colors.primary, marginBottom: 20 },
  input: {
    borderBottomWidth: 1,
    borderColor: Colors.inputContainerBD,
    marginBottom: 15,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  changePassword: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    justifyContent: 'center',
  },
  changePasswordText: {
    marginLeft: 8,
    color: '#000',
    fontSize: 16,
  },
});

export default ProfileScreen;
