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
import { useProfile } from '../../context/ProfileContext';
import axios from 'axios';
import { IP_ADDRESS } from '@env';
import pickAndUploadImage from '../../utils/pickAndUploadImage';
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
  const [url, setUrl] = useState('');

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


  const handleImageUpload = async () => {
    const imageUrl = await pickAndUploadImage();
    if (!imageUrl) {
      Alert.alert('Upload Failed', 'Please try again.');
      return;
    }
    setUrl(imageUrl);
    console.log('handleImageUrl: ',imageUrl);
    setProfile(prev => ({
      ...prev,
      image: { path: imageUrl ?? '' },
    }));
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

      const updateData: any = {
        name: profile.name,
        phoneNumber: profile.phoneNumber,
        houseNo: profile.address.houseNo,
        street: profile.address.street,
        postalCode: profile.address.postalCode,
        city: profile.address.city,
        state: profile.address.state,
      };

      if (url) {
        console.log(url);
        updateData.imagePath = url;
      }

      const response = await axios.patch(
        `http://${IP_ADDRESS}:3000/api/users/profile`,
        { updateData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={
          profile?.image?.path
            ? { uri: profile.image.path }
            : { uri: 'https://res.cloudinary.com/dxcbw424l/image/upload/v1749116154/rccjtgfk1lt74twuxo3b.jpg' }
        }
        style={styles.avatar}
        onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
      />
      {
        editable ?
        (
          <TouchableOpacity
            onPress={handleImageUpload}
          >
            <Text style={styles.uploadText}>Edit Profile Image</Text>
          </TouchableOpacity>
        ) : ''
      }

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
  avatar: { width: 110, height: 110, borderRadius: 55, alignSelf: 'center', marginBottom: 10, borderWidth: 2, borderColor: Colors.inputContainerBD },
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
