import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Modal,
  Image,
  Alert,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackParamList } from '../../navigation/StackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IP_ADDRESS } from '@env';
import axios from 'axios';
import { useSpareParts } from '../../context/SparePartsContext';
import Colors from '../../context/colors';

const image2 = require('../../assets/icons/partnest_logo.png');

type RootStackNavigationProp = StackNavigationProp<StackParamList, 'BuyerTabNav'>;

const { width } = Dimensions.get('window');

const categories = [
  { id: '1', name: 'Mobile Devices', icon: 'cellphone', value: 'MobileDevices' },
  { id: '2', name: 'Computers & Laptops', icon: 'laptop', value: 'ComputingDevices'},
  { id: '3', name: 'Home Appliances', icon: 'fridge', value: 'HomeAppliances'},
  { id: '4', name: 'Gaming Consoles', icon: 'gamepad-variant', value: 'GamingConsoles'},
  { id: '5', name: 'Wearables & Smart Tech', icon: 'watch-variant', value: 'Wearable&SmartDevices' },
  { id: '6', name: 'Entertainment Devices', icon: 'television', value: 'Entertainment&MediaDevices' },
];

const BuyerHomeScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [showMenu, setShowMenu] = useState(false);
  const { spareParts, setSpareParts } = useSpareParts(); // use context


  useEffect(() => {
    const fetchSpareParts = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const response = await axios.get(
          `http://${IP_ADDRESS}:3000/api/users/products/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

console.log('daata',response);

        setSpareParts(response.data.SpareParts || []);
      } catch (error) {
        console.error('Error fetching spare parts:', error);
      }
    };

    fetchSpareParts();
  }, []);



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

  const handleAddCart = async (item: any) => {
    try {

console.log('BuyerScreen.handleAddCart');

      const token = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `http://${IP_ADDRESS}:3000/api/users/cart/items/`,
        { sparePartId: item._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message) {
        Alert.alert('Item added to cart successfully!');
      }
    } catch (error: any) {
      console.error('Error adding to cart:', error?.response?.data || error.message);
      Alert.alert('Failed to add item to cart.');
    }
  };

  const handleCategoryPress = (item: any) => {
    navigation.navigate('SpareParts', { gadgetType: item.value, name: item.name});
  };


  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.logo}>SpareSync</Text>
        <TouchableOpacity style={styles.menuButton} onPress={() => setShowMenu(true)}>
          <Icon name="account-circle" size={33} color={Colors.black} />
        </TouchableOpacity>
      </View>

      <View style={styles.line}/>

      <Modal visible={showMenu} transparent>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowMenu(false)}>
          <View style={styles.dropdown}>
            <TouchableOpacity onPress={() => { setShowMenu(false); navigation.navigate('Profile'); }}>
              <Text style={styles.dropdownItem}>👤 Profile</Text>
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

      {
        spareParts && spareParts.length > 0 ? (
          <FlatList
            data={spareParts}
            numColumns={1}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <Pressable onPress={() => navigation.navigate('BuyerProductDetails', { partId: item._id })} style={({ pressed }) => [ pressed && { opacity: 0.9 } ]}>
                <View style={styles.card2}>
                  <Image source={image2} style={styles.image} />
                  <View style={styles.info}>
                    <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.price}>₹{parseFloat(item.price.$numberDecimal).toFixed(2)}</Text>
                    <View style={styles.ratingContainer}>
                      <Icon name="star" size={16} color="#FFD700" />
                      <Text style={styles.ratingText}>{item.averageRating}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.cart} onPress={() => handleAddCart(item)}>
                    <Icon name="cart" size={33} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              </Pressable>
            )}
          />
        ) : (
          <Text style={styles.noItemsText}>There are no items available right now.</Text>
        )
      }

    </View>
  );
};

const styles = StyleSheet.create({
  line:{
    height:2,
    backgroundColor: Colors.primary,
  },
  noItemsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    // paddingTop: 15,
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
    fontWeight: '800',
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
    width: 150,
  },
  dropdownItem: {
    fontSize: 16,
    marginVertical: 8,
    color: Colors.primary,
  },
  grid: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 120,
  },
  card: {
    backgroundColor: Colors.secondaryButtonBG,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: width * 0.42,
    margin: 10,
    alignItems: 'center',
    elevation: 1,
  },
  cardText: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
    color: Colors.black,
  },
  card2: {
    flexDirection: 'row',
    backgroundColor: Colors.inputContainerBG,
    borderRadius: 12,
    marginVertical: 7,
    marginHorizontal: 16,
    padding: 10,
    elevation: 2,
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
    color: Colors.secondary,
  },
  price: {
    fontSize: 14,
    color: Colors.black,
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
  cart: {
    justifyContent: 'flex-end',
    marginBottom: 20,
    marginRight: 20,
  },
});

export default BuyerHomeScreen;

