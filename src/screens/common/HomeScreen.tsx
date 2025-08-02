import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
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
import { useSpareParts } from '../../context/SparePartsContext';
import Colors from '../../context/colors';
import styles from '../../styles/common/homeScreenStyle';
import { connectSparePartSocket, disconnectSparePartSocket, fetchSparePartsService, addToCartService } from '../../services/common/homeService';



type RootStackNavigationProp = StackNavigationProp<StackParamList, 'BuyerTabNav'>;

const categories = [
  { id: '1', name: 'Mobile Devices', icon: 'cellphone', value: 'MobileDevices' },
  { id: '2', name: 'Computers & Laptops', icon: 'laptop', value: 'ComputingDevices'},
  { id: '3', name: 'Home Appliances', icon: 'fridge', value: 'HomeAppliances'},
  { id: '4', name: 'Gaming Consoles', icon: 'gamepad-variant', value: 'GamingConsoles'},
  { id: '5', name: 'Wearables & Smart Tech', icon: 'watch-variant', value: 'Wearable&SmartDevices' },
  { id: '6', name: 'Entertainment Devices', icon: 'television', value: 'Entertainment&MediaDevices' },
];

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [showMenu, setShowMenu] = useState(false);
  const [role, setRole] = useState<null | string>(null);
  const { spareParts, setSpareParts } = useSpareParts(); // use context

  useEffect(() => {
    const fetchSpareParts = async () => {
      try {
        const { role: roleName, sparePart } = await fetchSparePartsService();
        const userId = await AsyncStorage.getItem('id');
        setRole(roleName);
        setSpareParts(sparePart);

        if (!userId) {return;}
        connectSparePartSocket(userId, (sparepart: any) => {
          console.log(sparePart);
          const updatedFiltered = roleName === 'seller'
            ? sparepart.filter((part: any) => part.addedBy === userId)
            : sparepart;
          console.log(userId);
          console.log(updatedFiltered);

          setSpareParts(updatedFiltered);
        });

      } catch (error) {
        console.error(error);
      }
    };
    fetchSpareParts();
    return () => {
      disconnectSparePartSocket();
    };
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
      const message = await addToCartService(item._id);
      if (message) {
        Alert.alert('Item added to cart successfully!');
      }
    } catch (error) {
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
            <Text style={styles.logo}>PartNest</Text>
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
      </View>

      <View style={styles.card3}>
        {
          spareParts && spareParts.length > 0 ? (
            <FlatList
              data={spareParts}
              numColumns={1}
              keyExtractor={(item) => item._id}
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

export default HomeScreen;

