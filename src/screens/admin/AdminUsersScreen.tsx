import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Pressable,
  Modal,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackParamList } from '../../navigation/StackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import Colors from '../../context/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../../styles/admin/adminUsersScreenStyle';
import { fetchUsersByRole, User } from '../../services/admin/adminUserService';


type RootStackNavigationProp = StackNavigationProp<StackParamList, 'AdminTabNav'>;

const FILTERS = [
  { label: 'All', value: '' },
  { label: 'Buyers', value: 'buyer' },
  { label: 'Sellers', value: 'seller' },
];

const AdminUsersScreen = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('');

  useFocusEffect(
    useCallback(() => {
      fetchUsers(selectedFilter);
    }, [selectedFilter])
  );

  const fetchUsers = async (role = '') => {
    try {
      setLoading(true);
      const fetchedUsers = await fetchUsersByRole(role);
      setUsers(fetchedUsers);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };


  const renderUser = ({ item }: { item: User }) => (
    <Pressable onPress={() => navigation.navigate('UserDetailScreen', { userObject: item } )} style={({ pressed }) => [ pressed && { opacity: 0.9 } ]}>
      <View style={styles.card}>
        <Image
          source={
            item?.image?.path
              ? { uri: item.image.path }
              : {
                  uri: 'https://res.cloudinary.com/dxcbw424l/image/upload/v1749116154/rccjtgfk1lt74twuxo3b.jpg',
                }
          }
          style={styles.avatar}
          onError={(e) =>
            console.log('Image load error:', e.nativeEvent.error)
          }
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.info}>Email: {item.email}</Text>
          <Text style={styles.info}>Phone: {item.phoneNumber}</Text>
        </View>
      </View>
    </Pressable>
  );

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('role');
            setShowMenu(false);
            navigation.replace('Login');
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      {FILTERS.map((filter) => (
        <TouchableOpacity
          key={filter.label}
          style={[
            styles.filterButton,
            selectedFilter === filter.value && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedFilter(filter.value)}
        >
          <Text
            style={[
              styles.filterText,
              selectedFilter === filter.value && styles.filterTextActive,
            ]}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
      onPress={() => {setShowMenu(true);}}
      >
        <Icon name="dots-vertical" size={30} color={Colors.green} />
      </TouchableOpacity>

      <Modal visible={showMenu} transparent>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowMenu(false)}>
          <View style={styles.dropdown}>
            <TouchableOpacity onPress={() => { setShowMenu(false); navigation.navigate('Profile'); }}>
              <Text style={styles.dropdownItem}><Icon name="account-circle-outline" size={16} color={Colors.green} />   Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setShowMenu(false); navigation.navigate('Wallet'); }}>
              <Text style={styles.dropdownItem}><Icon name="wallet-outline" size={16} color={Colors.green} />   Wallet</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={[styles.dropdownItem, { color: Colors.secondary }]}><Icon name="logout" size={16} color={Colors.secondary} />   Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );


  return (
    <View style={styles.container}>
      <Text style={styles.header}>Users</Text>

      {renderFilterButtons()}

      {loading ? (
        <ActivityIndicator size="large" color={Colors.green} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderUser}
        />
      )}
    </View>
  );
};

export default AdminUsersScreen;
