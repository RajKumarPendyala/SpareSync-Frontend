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
  Modal,
} from 'react-native';
import axios from 'axios';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackParamList } from '../../navigation/StackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSpareParts } from '../../context/SparePartsContext';
import Colors from '../../context/colors';
import { IP_ADDRESS } from '@env';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type RootStackNavigationProp = StackNavigationProp<StackParamList, 'BuyerTabNav'>;

const { width } = Dimensions.get('window');

const CartScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
    const { spareParts } = useSpareParts();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orderPlaceable, setOrderPlaceable] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('');

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
      Alert.alert('Success','Item removed from cart successfully!');
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
      setCart(null);
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

  const handlePlaceOrder = async () => {
    if (!orderPlaceable) {
      Alert.alert('Warning', 'One or more products out of stock.');
      setOrderPlaceable(true);
      fetchCart();
      return;
    }
    try {
      const token = await AsyncStorage.getItem('token');
      console.log(token);
      const response = await axios.post(
        `http://${IP_ADDRESS}:3000/api/users/orders/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        Alert.alert('Success','Order placed successfully!');
        setCart(null);
      }
    } catch (error: any) {
      console.log('Error placing order:', error?.response?.data.message || error.message);
      Alert.alert('Fail', error?.response?.data.message);
    }
  };

  const renderItem = ({ item }: any) => {
    const part = item.sparePartId;
    const partName = typeof part === 'object' ? part?.name : 'Spare Part';
    const price = parseFloat(item.subTotal?.$numberDecimal || '0').toFixed(2);
    const discount = item.subTotalDiscount ? parseFloat(item.subTotalDiscount.$numberDecimal).toFixed(2) : null;
    const product = spareParts.find((x: any) => x._id === part._id);

    return (
      <View style={styles.card}>
        <Pressable
          onPress={() => navigation.navigate('BuyerProductDetails', { partId: item.sparePartId._id, roleName: null })}
          style={({ pressed }) => [
            { flexDirection: 'row', flex: 1, alignItems: 'center' },
            pressed && { opacity: 0.9 },
          ]}
        >
        <Image
          source={
            part?.images[0]?.path
              ? { uri: part?.images[0]?.path }
              : { uri: 'https://res.cloudinary.com/dxcbw424l/image/upload/v1749116154/rccjtgfk1lt74twuxo3b.jpg' }
          }
          style={styles.image}
          onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
        />
          <View style={styles.details}>
            <Text style={styles.name}>{partName}</Text>

            {product.quantity >= item.quantity ? (
              <>
                <View style={styles.priceDiscount}>
                  {parseFloat(discount || '0') > 0 && (
                    <Text style={styles.price}>₹{price}</Text>
                  )}
                  <Text style={styles.discountPrice}>
                    ₹{(parseFloat(price) - parseFloat(discount || '0')).toFixed(2)}
                  </Text>
                </View>

                {parseFloat(discount || '0') > 0 && (
                  <Text style={styles.discount}>- ₹{discount} off</Text>
                )}
              </>
            ) : (
              <>
                <Text style={styles.outOfStock}>Out of Stock</Text>
                {setOrderPlaceable(false)}
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
              disabled={item.quantity >= 5 || product.quantity <= item.quantity}
              style={[
                styles.quantityButton,
                (item.quantity >= 5 || product.quantity <= item.quantity) && styles.disabledButton,
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
    return <ActivityIndicator size="large" color={Colors.primary} />;
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
      <View style={styles.priceDiscount}>
        <Text style={styles.totalText}>Total:</Text>
              {parseFloat(discount || '0') > 0 && (
                <>
                  <Text style={styles.totalText2}>₹{total}</Text>
                </>
              )}
              <Text style={styles.totalText}>₹{(parseFloat(total) - parseFloat(discount || '0')).toFixed(2)}</Text>
            </View>
        <Text style={styles.discountText}>Discount: ₹{discount}</Text>
        <TouchableOpacity style={styles.checkoutButton} onPress={() => setShowPaymentModal(true) }>
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        visible={showPaymentModal}
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Payment Method</Text>

            {['Credit Card', 'UPI', 'Digital Wallet', 'Cash on Delivery'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.paymentOption,
                  selectedPayment === option && styles.selectedOption,
                ]}
                onPress={() => setSelectedPayment(option)}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                if (selectedPayment === 'Digital Wallet') {
                  Alert.alert(
                    'Confirm Payment',
                    'Are you sure you want to place the order using Digital Wallet?',
                    [
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                      {
                        text: 'Yes, Place Order',
                        onPress: () => {
                          setShowPaymentModal(false);
                          handlePlaceOrder();
                        },
                      },
                    ]
                  );
                } else {
                  setShowPaymentModal(false);
                  Alert.alert('Info', `${selectedPayment} payment option is coming soon.`);
                }
              }}
              disabled={!selectedPayment}
            >
              <Text style={styles.confirmText}>
                {selectedPayment ? `Pay with ${selectedPayment}` : 'Select Option'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  totalText2: {
    fontSize: 17,
    fontWeight: '400',
    color: Colors.icon,
    marginRight: 10,
    marginLeft: 10,
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
  outOfStock: {
    color: 'red',
    fontWeight: '600',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.primary,
  },
  paymentOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.inputContainerBD,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  selectedOption: {
    borderColor: Colors.green,
    backgroundColor: Colors.inputContainerBG,
  },
  optionText: {
    fontSize: 16,
    color: Colors.black,
  },
  confirmButton: {
    backgroundColor: Colors.green,
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  confirmText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelText: {
    color: Colors.secondary,
    marginTop: 15,
    fontSize: 16,
  },
});


export default CartScreen;
