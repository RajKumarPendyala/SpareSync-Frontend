import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Pressable,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackParamList } from '../../navigation/StackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { IP_ADDRESS } from '@env';
import Colors from '../../context/colors';

const { width } = Dimensions.get('window');

type RootStackNavigationProp = StackNavigationProp<StackParamList, 'BuyerTabNav'>;

const BuyerOrderDetailScreen = () => {
  const [orderObject, setOrderObject] = useState<any>(null);
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<RouteProp<StackParamList, 'OrderDetailScreen'>>();
  const { OrderObject } = route.params;

  useEffect(() => {
    setOrderObject(OrderObject);
    console.log('orderObject',OrderObject);
  }, [OrderObject]);

  if (!orderObject) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Loading order details...</Text>
      </View>
    );
  }

  const renderItem = ({ item }: any) => {
    const part = item.sparePartId;
    const partName = typeof part === 'object' ? part?.name : 'Spare Part';
    const price = parseFloat(item.subTotal?.$numberDecimal || '0').toFixed(2);
    const discount = item.subTotalDiscount
      ? parseFloat(item.subTotalDiscount.$numberDecimal).toFixed(2)
      : null;

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
            <View style={styles.priceDiscount}>
              {parseFloat(discount || '0') > 0 && (
                <Text style={styles.price}>₹{price}</Text>
              )}
              <Text style={styles.discountPrice}>₹{(parseFloat(price) - parseFloat(discount || '0')).toFixed(2)}</Text>
            </View>
            {parseFloat(discount || '0') > 0 && (
              <Text style={styles.discount}>- ₹{discount} off</Text>
            )}
          </View>

        </Pressable>
        <View style={styles.reviewOption}>
            <Text style={styles.quantityText}>{item.quantity}X</Text>
            {
                orderObject.shipmentStatus === 'delivered' ?
                    <TouchableOpacity
                        style={styles.reviewButton}
                        onPress={() =>
                            navigation.navigate('ReviewScreen', { sparePartId: item.sparePartId._id})
                        }
                    >
                        <Text style={styles.reviewText}>Review</Text>
                    </TouchableOpacity>
                : ''
            }
        </View>
      </View>
    );
  };

  const handleCancelOrder = async () => {
    if(['shipped', 'delivered', 'cancelled'].includes(orderObject.shipmentStatus)){
        return;
    }

    Alert.alert(
      'Confirm Cancel',
      'Are you sure you want to cancel order?',
      [
        {
          text: 'No',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            const orderId = orderObject._id;
            try {
              const token = await AsyncStorage.getItem('token');
              const response = await axios.patch(
                `http://${IP_ADDRESS}:3000/api/users/orders`,
                { orderId },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              console.log('afterUpdate',response);
              setOrderObject((prevOrder: any) => ({
                  ...prevOrder,
                  shipmentStatus: 'cancelled',
              }));
              if (response.status === 200) {
                Alert.alert('Success','Order cancelled successfully!');
              }
            } catch (error: any) {
              console.error('Error order cancel :', error?.response?.data || error.message);
              Alert.alert('Failed to cancel order.');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return { color: 'green' };
      case 'cancelled': return { color: 'red' };
      case 'pending': return { color: 'orange' };
      default: return { color: Colors.black };
    }
  };

  const total = parseFloat(orderObject.totalAmount?.$numberDecimal || '0').toFixed(2);
  const discount = parseFloat(orderObject.discountAmount?.$numberDecimal || '0').toFixed(2);

  return (
    <View style={styles.container}>
        <View style={styles.orderSummaryCard}>
            <Text style={styles.summaryHeader}>Order Summary</Text>

            <View style={styles.summaryRow}>
                <Text style={styles.label}>Order ID:</Text>
                <Text style={styles.value}>{orderObject._id.slice(-6).toUpperCase()}</Text>
            </View>

            <View style={styles.summaryRow}>
                <Text style={styles.label}>Placed On:</Text>
                <Text style={styles.value}>{new Date(orderObject.createdAt).toLocaleDateString()}</Text>
            </View>

            <View style={styles.summaryRow}>
                <Text style={styles.label}>Paid Via:</Text>
                <Text style={styles.value}>{orderObject.paymentMethod}</Text>
            </View>

            <View style={styles.summaryRow}>
                <Text style={styles.label}>Status:</Text>
                <Text style={[styles.value, getStatusStyle(orderObject.shipmentStatus)]}>
                {orderObject.shipmentStatus.toUpperCase()}
                </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
                <Text style={styles.label}>Total:</Text>
                <Text style={styles.value}>₹{total}</Text>
            </View>

            <View style={styles.summaryRow}>
                <Text style={styles.label}>Discount:</Text>
                <Text style={[styles.value, styles.discountText]}>₹{discount}</Text>
            </View>

            <View style={styles.summaryRow}>
                <Text style={styles.labelBold}>Paid:</Text>
                <Text style={styles.paidText}>₹{(parseFloat(total) - parseFloat(discount)).toFixed(2)}</Text>
            </View>
        </View>

      <FlatList
        data={orderObject.items}
        keyExtractor={(item) => item.sparePartId._id}
        renderItem={renderItem}
      />
      <View style={styles.summary}>
        <TouchableOpacity style={styles.cancelButton}
        onPress={() => handleCancelOrder()}
        >
            <Text style={styles.cancelText}>
                {
                    ['shipped', 'delivered', 'cancelled'].includes(orderObject.shipmentStatus) ? 'Cannot Cancel Order' : 'Cancel Order'
                }
            </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 20,
    paddingBottom: 70,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.inputContainerBG,
    marginHorizontal: 20,
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
    padding: 16,
  },
  label: {
    fontSize: 15,
    color: Colors.black,
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: Colors.secondary,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelText: {
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
  quantityText: {
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 10,
    color: Colors.icon,
  },
  orderSummaryCard: {
    backgroundColor: Colors.primaryButtonBG,
    marginHorizontal: 16,
    marginBottom: 9,
    padding: 16,
    borderRadius: 12,
    elevation: 5,
  },
  summaryHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.black,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.icon,
  },
  labelBold: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
  },
  paidText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  discountText: {
    color: Colors.green,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  reviewButton: {
    marginTop: 10,
    backgroundColor: Colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  reviewText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '500',
  },
  reviewOption: {
    alignItems: 'center',
  },
});


export default BuyerOrderDetailScreen;
