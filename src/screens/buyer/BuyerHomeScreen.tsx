import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Modal,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackParamList } from '../../navigation/StackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../contexts/colors';
const image2 = require('../../assets/icons/partnest_logo.png');

type RootStackNavigationProp = StackNavigationProp<StackParamList, 'BuyerTabNav'>;

const { width } = Dimensions.get('window');

const categories = [
  { id: '1', name: 'Mobile Devices', icon: 'cellphone', value: 'MobileDevices' },
  { id: '2', name: 'Computers & Laptops', icon: 'laptop', value: 'ComputingDevices'},
  { id: '3', name: 'Home Appliances', icon: 'fridge', value: 'HomeAppliances'},
  { id: '4', name: 'Wearables & Smart Tech', icon: 'watch-variant', value: 'Wearable&SmartDevices' },
  { id: '5', name: 'Entertainment Devices', icon: 'television', value: 'Entertainment&MediaDevices' },
  { id: '6', name: 'Gaming Consoles', icon: 'gamepad-variant', value: 'GamingConsoles'},
];

const items = [
  { id: '1',  name: 'Daliah Drop Shoulder', price: 32.00, rating: 4.3},
  { id: '2',  name: 'Daliah Drop Shoulder', price: 32.00, rating: 4.3},
  { id: '3',  name: 'Daliah Drop Shoulder', price: 32.00, rating: 4.3},
  { id: '4',  name: 'Daliah Drop Shoulder', price: 32.00, rating: 4.3},
  { id: '5',  name: 'Daliah Drop Shoulder', price: 32.00, rating: 4.3},
];

const BuyerHomeScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [showMenu, setShowMenu] = useState(false);

  const handleCategoryPress = (item: any) => {
    navigation.navigate('SpareParts', { gadgetType: item.value });
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('role');
    setShowMenu(false);
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.logo}>SpareSync</Text>
        <TouchableOpacity style={styles.menuButton} onPress={() => setShowMenu(true)}>
          <Icon name="account-circle" size={30} color={Colors.primary} />
        </TouchableOpacity>
      </View>


      <Modal visible={showMenu} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowMenu(false)}>
          <View style={styles.dropdown}>
            <TouchableOpacity onPress={() => { setShowMenu(false); navigation.navigate('Profile'); }}>
              <Text style={styles.dropdownItem}>👤 View Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setShowMenu(false); navigation.navigate('Wallet'); }}>
              <Text style={styles.dropdownItem}>💰 Wallet</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={[styles.dropdownItem, { color: Colors.secondary }]}>🚪 Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <FlatList
        data={categories}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleCategoryPress(item)}>
            <Icon name={item.icon} size={36} color={Colors.primary} />
            <Text style={styles.cardText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card1}>
            <Image source={image2} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.price}>USD {item.price.toFixed(2)}</Text>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
              </View>
            </View>
          </View>
        )}
      />


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  logo: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  menuButton: {
    padding: 5,
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
    padding: 15,
    borderRadius: 12,
    width: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  dropdownItem: {
    fontSize: 16,
    marginVertical: 8,
    color: Colors.primary,
  },
  grid: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  card: {
    backgroundColor: Colors.secondaryButtonBG,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: width * 0.42,
    margin: 10,
    alignItems: 'center',
    elevation: 2,
  },
  cardText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
    color: Colors.black,
  },
  card1: {
    flexDirection: 'row',
    backgroundColor: Colors.inputContainerBG,
    borderRadius: 12,
    marginVertical: 5,
    marginHorizontal: 16,
    padding: 10,
    elevation: 1,
  },
  image: {
    width: width * 0.25,
    height: width * 0.25,
    borderRadius: 10,
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
  },
  price: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: Colors.black,
  },
});

export default BuyerHomeScreen;

