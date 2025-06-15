import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: Colors.inputContainerBG,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.secondaryButtonBG,
    padding: 30,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 60,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: Colors.inputContainerBD,
    marginBottom: 30,
  },
  infoSection: {
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: Colors.icon,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 10,
  },
  addressSection: {
    marginTop: 5,
  },
  deleteBtn: {
    marginTop: 30,
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default AdminUserDetailScreen;
