import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../navigation/StackNavigator';
import Colors from '../../context/colors';
import styles from '../../styles/admin/adminUserDetailScreenStyle';
import { deleteUserById } from '../../services/admin/adminUserDetailService';
import SecondaryButton from '../../components/secondaryButton';

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
              const message = await deleteUserById(userObject._id);
              Alert.alert('Success', message);
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete user.');
            } finally {
              setLoading(false);
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

          <SecondaryButton
            title="DELETE USER"
            onPress={handleDelete}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default AdminUserDetailScreen;
