import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Pressable,
  Modal,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackParamList } from '../../navigation/StackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSpareParts } from '../../context/SparePartsContext';
import Colors from '../../context/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useProfile } from '../../context/ProfileContext';
import styles from '../../styles/buyer/buyerCartScreenStyle';
import {
  fetchCartItems,
  updateCartItemQuantity,
  removeCartItem,
  placeOrder,
} from '../../services/buyer/buyerCartService';
import { fetchUserProfile } from '../../services/common/profileService';


type RootStackNavigationProp = StackNavigationProp<StackParamList, 'BuyerTabNav'>;


const BuyerCartScreen: React.FC = () => {
  const navigation = useNavigation<RootStackNavigationProp>();
  const { spareParts } = useSpareParts();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orderPlaceable, setOrderPlaceable] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('');
  const { profile, setProfile } = useProfile();


  const handleDelete = async (item: any) => {
    try {
      const response = await removeCartItem(item.sparePartId);
      console.log('cart', response);
      await fetchCart();

      if (response.message) {
        Alert.alert('Success', 'Item removed from cart successfully!');
      }
    } catch (error: any) {
      console.error('Error removing item from cart:', error?.response?.data || error.message);
      Alert.alert('Failed to remove item from cart.');
    }
  };

    useEffect(() => {
      const loadProfile = async () => {
        try {
          const data = await fetchUserProfile();
          setProfile({
            ...data.user,
            image: data.user.image || { path: '' },
            address: {
              houseNo: '',
              street: '',
              postalCode: '',
              city: '',
              state: '',
              ...data.user.address,
            },
          });
        } catch (error) {
          Alert.alert('Error', 'Failed to fetch profile.');
          console.error('Error fetching profile:', error);
        }
      };
      loadProfile();
    }, [setProfile]);


  const fetchCart = async () => {
    try {
      const data = await fetchCartItems();
      setCart(data);
    } catch (err) {
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
      await updateCartItemQuantity(item.sparePartId._id, newQuantity);
      await fetchCart();
    } catch (error: any) {
      console.error('Error updating quantity:', error?.response?.data || error.message);
      Alert.alert('Failed to update quantity.');
    }
  };


  const handlePlaceOrder = async () => {
    if (!isAddressComplete(profile?.address)) {
      Alert.alert(
        'Incomplete Address',
        'Please fill all address fields before placing an order.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {},
          },
          {
            text: 'Yes, Go to Profile',
            onPress: () => navigation.navigate('Profile'),
          },
        ]
      );
      return;
    }

    if (!orderPlaceable) {
      Alert.alert('Warning', 'One or more products out of stock.');
      setOrderPlaceable(true);
      fetchCart();
      return;
    }
    try {
      const response = await placeOrder();
      if (response.status === 201) {
        Alert.alert('Success', 'Order placed successfully!');
        setCart(null);
      }
    } catch (error: any) {
      console.log('Error placing order:', error?.response?.data.message || error.message);
      Alert.alert('Failed to place order', error?.response?.data.message || 'Something went wrong.');
    }
  };

  const isAddressComplete = (address: any) => {
    if (!address) {
        return false;
    }
    const requiredFields = ['houseNo', 'street', 'postalCode', 'city', 'state'];
    return requiredFields.every(
      (field) => address[field] && address[field].toString().trim() !== ''
    );
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

export default BuyerCartScreen;
