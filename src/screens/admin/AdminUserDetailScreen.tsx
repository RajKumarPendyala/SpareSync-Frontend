import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Alert,
  Button,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { IP_ADDRESS } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../navigation/StackNavigator';
import Colors from '../../context/colors';
import styles from '../../styles/admin/AdminUserDetailScreenStyle';

type RootStackNavigationProp = StackNavigationProp<StackParamList, 'BuyerTabNav'>;

const AdminUserDetailScreen = () => {
  const route = useRoute<RouteProp<StackParamList, 'UserDetailScreen'>>();
  const navigation = useNavigation<RootStackNavigationProp>();
  const { userObject } = route.params;
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const token = await AsyncStorage.getItem('token');
              const res = await axios.patch(`http://${IP_ADDRESS}:3000/api/users/`,
                { _id: userObject._id, isDeleted: true},
                {
                    headers: { Authorization: `Bearer ${token}` },
                    validateStatus: (status) => status === 200 || status === 410,
                }
              );
              Alert.alert('Success', res.data.message || 'User deleted successfully');
              navigation.goBack();
              setLoading(false);
            } catch (err) {
              console.error('Delete user error:', err);
              Alert.alert('Error', 'Failed to delete user.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image
          source={
            userObject?.image?.path
              ? { uri: userObject.image.path }
              : { uri: 'https://res.cloudinary.com/dxcbw424l/image/upload/v1749116154/rccjtgfk1lt74twuxo3b.jpg' }
          }
          style={styles.avatar}
        />

        <View style={styles.infoSection}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{userObject.name}</Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{userObject.email}</Text>

          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{userObject.phoneNumber}</Text>

          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{userObject.role.charAt(0).toUpperCase() + userObject.role.slice(1)}</Text>
        </View>

          {
            userObject?.address ?
            (
                <View style={styles.addressSection}>
                    <Text style={styles.sectionTitle}>Address</Text>
                    <Text style={styles.value}>
                    {userObject?.address?.houseNo}, {userObject?.address?.street}
                    </Text>
                    <Text style={styles.value}>
                    {userObject?.address?.city}, {userObject?.address?.state} - {userObject?.address?.postalCode}
                    </Text>
                </View>
            )
            : ('')
          }


        <View style={styles.deleteBtn}>
          <Button
            title="Delete User"
            color={Colors.secondary}
            onPress={handleDelete}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default AdminUserDetailScreen;
