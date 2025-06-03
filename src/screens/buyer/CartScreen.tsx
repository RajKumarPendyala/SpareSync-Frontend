import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackParamList } from '../../navigation/StackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import Colors from '../../context/colors';
import { IP_ADDRESS } from '@env';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type RootStackNavigationProp = StackNavigationProp<StackParamList, 'BuyerTabNav'>;

const { width } = Dimensions.get('window');

const CartScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

const handleDelete = async (item: any) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.patch(
      `http://${IP_ADDRESS}:3000/api/users/cart/items/buyer`,
      { sparePartId: item.sparePartId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('cart',response);
    await fetchCart();

    if (response.data.message) {
      Alert.alert('Item removed from cart successfully!');
    }
  } catch (error: any) {
    console.error('Error removing to cart:', error?.response?.data || error.message);
    Alert.alert('Failed to remove item from cart.');
  }
};

  const fetchCart = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get(`http://${IP_ADDRESS}:3000/api/users/cart/items/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.cartData);

    } catch (err: any) {

      Alert.alert('Error fetching cart');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, [])
  );

  const updateQuantity = async (item: any, newQuantity: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.patch(
        `http://${IP_ADDRESS}:3000/api/users/cart/items/`,
        {
          sparePartId: item.sparePartId._id,
          quantity: newQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await fetchCart();
    } catch (error: any) {
      console.error('Error updating quantity:', error?.response?.data || error.message);
      Alert.alert('Failed to update quantity.');
    }
  };

  const renderItem = ({ item }: any) => {
    const part = item.sparePartId;
    const partName = typeof part === 'object' ? part?.name : 'Spare Part';
    const price = parseFloat(item.subTotal?.$numberDecimal || '0').toFixed(2);
    const discount = item.subTotalDiscount ? parseFloat(item.subTotalDiscount.$numberDecimal).toFixed(2) : null;

    return (
      <View style={styles.card}>
        <Pressable
          onPress={() => navigation.navigate('BuyerProductDetails', { partId: item.sparePartId._id })}
          style={({ pressed }) => [
            { flexDirection: 'row', flex: 1, alignItems: 'center' },
            pressed && { opacity: 0.9 },
          ]}
        >
          <Image source={require('../../assets/icons/partnest_logo.png')} style={styles.image} />
          <View style={styles.details}>
            <Text style={styles.name}>{partName}</Text>
            <View style={styles.priceDiscount}>
              {parseFloat(discount || '0') > 0 && (
                <>
                  <Text style={styles.price}>₹{price}</Text>
                </>
              )}
              <Text style={styles.discountPrice}>₹{(parseFloat(price) - parseFloat(discount || '0')).toFixed(2)}</Text>
            </View>
            {parseFloat(discount || '0') > 0 && (
              <>
                <Text style={styles.discount}>- ₹{discount} off</Text>
              </>
            )}
          </View>
        </Pressable>

        <View style={styles.manipulateContainer}>
          <TouchableOpacity onPress={() => handleDelete(item)} disabled={loading}>
            {
              loading ? ( <ActivityIndicator size="small" color={Colors.background} /> ) :
              ( <Icon name="delete" size={26} color={Colors.secondary} /> )
            }
          </TouchableOpacity>


          <View style={styles.quantityControl}>
            <TouchableOpacity
              onPress={() => updateQuantity(item, item.quantity - 1)}
              disabled={item.quantity <= 1}
              style={[
                styles.quantityButton,
                item.quantity <= 1 && styles.disabledButton,
              ]}
            >
              {
                loading ? ( <ActivityIndicator size="small" color={Colors.background} /> ) :
                ( <Text style={styles.buttonText}>-</Text> )
              }
            </TouchableOpacity>

            <Text style={styles.quantityText}>{item.quantity}</Text>

            <TouchableOpacity
              onPress={() => updateQuantity(item, item.quantity + 1)}
              disabled={item.quantity >= 10}
              style={[
                styles.quantityButton,
                item.quantity >= 10 && styles.disabledButton,
              ]}
            >
              {
                loading ? ( <ActivityIndicator size="small" color={Colors.background} /> ) :
                ( <Text style={styles.buttonText}>+</Text> )
              }
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      </View>
    );
  }

  const total = parseFloat(cart.totalAmount.$numberDecimal).toFixed(2);
  const discount = cart.discountAmount ? parseFloat(cart.discountAmount.$numberDecimal).toFixed(2) : '0.00';

  return (
    <View style={styles.container}>
      <FlatList
        data={cart.items}
        keyExtractor={(item) => item.sparePartId._id}
        renderItem={renderItem}
      />
      <View style={styles.summary}>
        <Text style={styles.totalText}>Total: ₹{total}</Text>
        <Text style={styles.discountText}>Discount: ₹{discount}</Text>
        <TouchableOpacity style={styles.checkoutButton} onPress={() => Alert.alert('Proceed to Checkout')}>
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 30,
    paddingBottom: 136,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.inputContainerBG,
    marginHorizontal: 16,
    marginVertical: 5,
    padding: 12,
    borderRadius: 12,
    elevation: 1,
    alignItems: 'center',
  },
  image: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: 10,
  },
  details: {
    flex: 1,
    marginLeft: 12,
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.green,
  },
  quantity: {
    fontSize: 14,
    marginVertical: 4,
    color: Colors.black,
  },
  priceDiscount: {
    flex: 1,
    flexDirection: 'row',
  },
  price: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.icon,
    marginRight: 10,
    textDecorationLine: 'line-through',
  },
  discountPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  discount: {
    fontSize: 12,
    color: Colors.secondary,
  },
  summary: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: Colors.primaryButtonBG,
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  discountText: {
    fontSize: 14,
    color: Colors.secondary,
    marginTop: 4,
  },
  checkoutButton: {
    marginTop: 10,
    backgroundColor: Colors.green,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
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
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  quantityButton: {
    backgroundColor: Colors.inputContainerBD,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  disabledButton: {
    backgroundColor: Colors.primaryButtonBG,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 10,
  },
  manipulateContainer: {
    flexDirection: 'column',
    gap: 15,
    alignItems: 'center',
  },
});


export default CartScreen;
