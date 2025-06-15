import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Pressable,
  Modal,
  Alert,
} from 'react-native';
import axios from 'axios';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackParamList } from '../../navigation/StackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { IP_ADDRESS } from '@env';
import Colors from '../../context/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


type RootStackNavigationProp = StackNavigationProp<StackParamList, 'AdminTabNav'>;

interface User {
  _id: string;
  name: string;
  email: string;
  phoneNumber: number;
  image?: {
    path: string;
  };
}

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
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`http://${IP_ADDRESS}:3000/api/users/`, {
        params: { role },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch users', error);
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.green,
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: Colors.inputContainerBG,
    borderWidth: 1,
    borderColor: Colors.green,
  },
  filterButtonActive: {
    backgroundColor: Colors.green,
  },
  filterText: {
    color: Colors.green,
    fontWeight: '600',
  },
  filterTextActive: {
    color: 'white',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginVertical: 6,
    backgroundColor: Colors.inputContainerBG,
    borderRadius: 10,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    backgroundColor: '#eee',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.green,
  },
  info: {
    fontSize: 14,
    color: Colors.black,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 20,
  },
  dropdown: {
    backgroundColor: Colors.primaryButtonBG,
    padding: 13,
    borderRadius: 12,
    width: 120,
  },
  dropdownItem: {
    fontSize: 16,
    marginVertical: 5,
    color: Colors.green,
  },
});
