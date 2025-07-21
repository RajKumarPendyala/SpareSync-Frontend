import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
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
import styles from '../../styles/common/OrderDetailScreenStyle';


type RootStackNavigationProp = StackNavigationProp<StackParamList, 'BuyerTabNav'>;

const OrderDetailScreen = () => {
  const [orderObject, setOrderObject] = useState<any>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(orderObject?.shipmentStatus || '');
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<RouteProp<StackParamList, 'OrderDetailScreen'>>();
  const { OrderObject, role } = route.params;

  useEffect(() => {
    setOrderObject(OrderObject);
    setSelectedStatus(OrderObject.shipmentStatus);
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
          onPress={() => navigation.navigate('BuyerProductDetails', { partId: item.sparePartId._id, roleName: role })}
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
                orderObject.shipmentStatus === 'delivered' && role === 'buyer' ?
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

  const handleStatusUpdate = async (newStatus: string) => {
    if(orderObject.shipmentStatus === 'cancelled'){
      return;
    }
    const orderId = orderObject._id;
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.patch(
        `http://${IP_ADDRESS}:3000/api/users/orders/admin`,
        { orderId, shipmentStatus: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setOrderObject((prev: any) => ({
          ...prev,
          shipmentStatus: newStatus,
        }));
        setSelectedStatus(newStatus);
        Alert.alert('Success', `Order status updated to ${newStatus}`);
      }
    } catch (error: any) {
      console.error('Status update error:', error?.response?.data || error.message);
      Alert.alert('Failed to update status');
    }
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


  const statusOptions = ['processing', 'shipped', 'delivered', 'cancelled'];

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
    <View
    style={[
      styles.container,
      role === 'buyer' && { paddingBottom: 70 }
    ]}
    >
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
              <Text style={styles.label}>Payment Via:</Text>
              <Text style={styles.value}>{orderObject.paymentMethod}</Text>
          </View>


          {
            role === 'admin' ?
            (
              <>
                <Text style={styles.label}>Update Status:</Text>
                <TouchableOpacity
                  style={styles.dropdown}
                  onPress={() => setShowStatusDropdown(!showStatusDropdown)}
                >
                  <Text style={[styles.dropdownText, getStatusStyle(orderObject.shipmentStatus)]}>
                    {selectedStatus ? selectedStatus.toUpperCase() : 'Select Status'}
                  </Text>
                </TouchableOpacity>

                {showStatusDropdown && (
                  <View style={styles.dropdownList}>
                    {statusOptions.map((status) => (
                      <TouchableOpacity
                        key={status}
                        onPress={() => {
                          setShowStatusDropdown(false);
                          if (status !== selectedStatus) {
                            handleStatusUpdate(status);
                          }
                        }}
                        style={styles.dropdownItem}
                      >
                        <Text style={styles.dropdownItemText}>{status.toUpperCase()}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}



                <View style={styles.divider} />

                <View style={styles.summaryRow}>
                    <Text style={styles.label}>Name:</Text>
                    <Text style={styles.value}>{orderObject.userId?.name}</Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={styles.label}>Mobile:</Text>
                    <Text style={styles.value}>{orderObject.userId?.phoneNumber}</Text>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{orderObject.userId?.email}</Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.label}>Address: </Text>
                  <Text style={styles.address}>{orderObject?.userId?.address?.houseNo.trim() + ', ' + orderObject?.userId?.address?.street.trim() + ', ' + orderObject?.userId?.address?.city.trim() + ', ' + orderObject?.userId?.address?.state.trim() + ', ' +  orderObject?.userId?.address?.postalCode.trim() + '.'}</Text>
                </View>
              </>
            )
            :
            (
              <View style={styles.summaryRow}>
                <Text style={styles.label}>Status:</Text>
                <Text style={[styles.value, getStatusStyle(orderObject.shipmentStatus)]}>{orderObject.shipmentStatus.toUpperCase()}</Text>
              </View>
            )
          }

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
              <Text style={styles.labelBold}>Payable:</Text>
              <Text style={styles.paidText}>₹{(parseFloat(total) - parseFloat(discount)).toFixed(2)}</Text>
          </View>
        </View>

      <FlatList
        data={orderObject.items}
        keyExtractor={(item) => item.sparePartId._id}
        renderItem={renderItem}
      />

      {
        role !== 'admin' ?
        (
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
        )
        : ('')
      }
    </View>
  );
};

export default OrderDetailScreen;
