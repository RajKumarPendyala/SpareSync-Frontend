import React, { useState, useCallback } from 'react';
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
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackParamList } from '../../navigation/StackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IP_ADDRESS } from '@env';
import axios from 'axios';
import { useSpareParts } from '../../context/SparePartsContext';
import Colors from '../../context/colors';


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
  const [role, setRole] = useState<null | string>(null);
  const { spareParts, setSpareParts } = useSpareParts(); // use context

    const fetchSpareParts = async () => {
      try {
          const token = await AsyncStorage.getItem('token');
          const roleName = await AsyncStorage.getItem('role');
          setRole(roleName);

          if (roleName === 'seller') {
            const response = await axios.get(
              `http://${IP_ADDRESS}:3000/api/users/products/seller`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

console.log('daata',response);
            setSpareParts(response.data.SpareParts || []);
            return;
          }

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


  useFocusEffect(
    useCallback(() => {
      fetchSpareParts();
    }, [])
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
    navigation.navigate('SpareParts', { gadgetType: item.value, name: item.name, roleName: role});
  };


  return (
    <View style={styles.container}>

      {
        role === 'admin' ?
        ('') :
        (
          <View style={styles.header}>
            <Text style={styles.logo}>SpareSync</Text>
            {
              role === 'seller' ?
              (
                <TouchableOpacity style={styles.menuButton} onPress={() => {navigation.navigate('AlertScreen', { roleName : role});}}>
                  <Icon name="alert-circle" size={33} color={Colors.black} />
                </TouchableOpacity>
              )
              :
              (
                <TouchableOpacity style={styles.menuButton} onPress={() => {setShowMenu(true);}}>
                  <Icon name="account-circle" size={33} color={Colors.black} />
                </TouchableOpacity>
              )
            }
          </View>
        )
      }

      <View style={styles.line}/>


      <Modal visible={showMenu} transparent>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowMenu(false)}>
          <View style={styles.dropdown}>
            <TouchableOpacity onPress={() => { setShowMenu(false); navigation.navigate('Profile'); }}>
              <Text style={styles.dropdownItem}><Icon name="account-circle-outline" size={16} color={Colors.primary} />   Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setShowMenu(false); navigation.navigate('Wallet'); }}>
              <Text style={styles.dropdownItem}><Icon name="wallet-outline" size={16} color={Colors.primary} />   Wallet</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={[styles.dropdownItem, { color: Colors.secondary }]}><Icon name="logout" size={16} color={Colors.secondary} />   Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <View>
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
              contentContainerStyle={styles.grid2}
              renderItem={({ item }) => (
                <Pressable onPress={() => navigation.navigate('BuyerProductDetails', { partId: item._id, roleName: role })} style={({ pressed }) => [ pressed && { opacity: 0.9 } ]}>
                  <View style={styles.card2}>
                    <Image
                      source={
                        item?.images[0]?.path
                          ? { uri: item?.images[0]?.path }
                          : { uri: 'https://res.cloudinary.com/dxcbw424l/image/upload/v1749116154/rccjtgfk1lt74twuxo3b.jpg' }
                      }
                      style={styles.image}
                      onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                    />
                    <View style={styles.info}>
                      <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.price}>₹{(
                          parseFloat(item.price.$numberDecimal) *
                          (1 - parseFloat(item.discount.$numberDecimal) / 100)
                        ).toFixed(2)}
                      </Text>
                      {parseFloat(item.discount.$numberDecimal || '0') > 0 && (
                        <>
                          <Text style={styles.discount}>-{parseFloat(item.discount.$numberDecimal).toFixed(0)}%</Text>
                        </>
                      )}
                      <View style={styles.ratingContainer}>
                        <Icon name="star" size={16} color="#FFD700" />
                        <Text style={styles.ratingText}>{item.averageRating}</Text>
                      </View>
                    </View>
                    {
                      role === 'buyer' ?
                      (
                        item.quantity >= 1 ?
                        (
                          <TouchableOpacity style={styles.cart} onPress={() => handleAddCart(item)}>
                            <Icon name="cart" size={33} color={Colors.primary} />
                          </TouchableOpacity>
                        )
                        :
                        ''
                      )
                      :
                      (
                        role === 'seller' ?
                        (
                          <TouchableOpacity style={styles.cart}
                          onPress={() => navigation.navigate('EditProductScreen', { sparePartId: item._id })}
                          >
                            <Icon name="pencil" size={30} color={Colors.primary} />
                          </TouchableOpacity>
                        ) : ('')
                      )
                    }
                  </View>
                </Pressable>
              )}
            />
          ) : (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>There are no items available right now.</Text>
            </View>
          )
        }
      </View>
      {
        role === 'seller' ?
        (
          <TouchableOpacity
            style={styles.floatingAddIcon}
            onPress={() => navigation.navigate('AddProductScreen')}
          >
            <Icon name="plus" size={24} color="white" />
          </TouchableOpacity>
        ) : ('')
      }
    </View>
  );
};

const styles = StyleSheet.create({
  line:{
    height:2,
    backgroundColor: Colors.primary,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.black,
  },
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
    width: 130,
  },
  dropdownItem: {
    fontSize: 16,
    marginVertical: 8,
    color: Colors.primary,
  },
  grid: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: -15,
    paddingBottom: 15,
  },
  grid2: {
    paddingBottom: 447,
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
    color: Colors.green,
  },
  price: {
    fontSize: 14,
    color: Colors.black,
    fontWeight: '500',
  },
  discount: {
    fontSize: 12,
    color: Colors.secondary,
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
  floatingAddIcon: {
    position: 'absolute',
    right: 35,
    bottom: 110,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    padding: 14,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 10,
  },
});

export default BuyerHomeScreen;

