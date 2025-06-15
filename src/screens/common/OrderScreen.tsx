import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Pressable,
} from 'react-native';
import axios from 'axios';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackParamList } from '../../navigation/StackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import Colors from '../../context/colors';
import { IP_ADDRESS } from '@env';

type  BuyerOrderScreenNavigationProp = StackNavigationProp<StackParamList, 'BuyerTabNav'>;

const BuyerOrderScreen: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleName, setRole] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');


  const navigation = useNavigation<BuyerOrderScreenNavigationProp>();

  const fetchOrders = async (status: string = 'all') => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const role = await AsyncStorage.getItem('role');
      setRole(role);

      if (role === 'admin') {
        const url = status === 'all'
        ? `http://${IP_ADDRESS}:3000/api/users/orders/admin`
        : `http://${IP_ADDRESS}:3000/api/users/orders/admin?status=${status}`;

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(res.data.orders);
      }else {
        const url = status === 'all'
        ? `http://${IP_ADDRESS}:3000/api/users/orders`
        : `http://${IP_ADDRESS}:3000/api/users/orders?status=${status}`;

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(res);
        setOrders(res.data.orders);
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error?.response?.data || error.message);
      Alert.alert('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders(selectedStatus);
    }, [selectedStatus])
  );

  const renderItem = ({ item }: any) => {
    const total = parseFloat(item.totalAmount?.$numberDecimal || '0').toFixed(2);
    const discount = item.discountAmount ? parseFloat(item.discountAmount.$numberDecimal).toFixed(2) : '0.00';
    const finalAmount = (parseFloat(total) - parseFloat(discount)).toFixed(2);
    const createdAt = new Date(item.createdAt).toLocaleDateString();

    return (
      <View style={styles.card}>
        <Pressable
          onPress={() => navigation.navigate('OrderDetailScreen', { OrderObject: item, role: roleName })}
          style={({ pressed }) => [
            pressed && { opacity: 0.9 },
          ]}
        >
          <View style={styles.headerRow}>
            <Text style={styles.orderId}>Order #{item._id.slice(-6).toUpperCase()}</Text>
            <Text style={[styles.status, getStatusStyle(item.shipmentStatus)]}>
              {item.shipmentStatus.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.date}>Placed on: {createdAt}</Text>

          {
            roleName === 'admin' ?
            (
              <Text style={styles.address}>{'Address: ' + item?.userId?.address?.houseNo.trim() + ', ' + item?.userId?.address?.street.trim() + ', ' + item?.userId?.address?.city.trim() + ', ' + item?.userId?.address?.state.trim() + ', ' +  item?.userId?.address?.postalCode.trim() + '.'}</Text>
            )
            : ('')
          }

          <View style={styles.tableHeader}>
            <Text style={[styles.tableText, styles.itemCol]}>Item</Text>
            <Text style={[styles.tableText, styles.qtyCol]}>Qty</Text>
            <Text style={[styles.tableText, styles.priceCol]}>Price</Text>
          </View>

          {item.items.map((itm: any, idx: number) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={[styles.tableValue, styles.itemCol]}>{itm.sparePartId?.name}</Text>
              <Text style={[styles.tableValue, styles.qtyCol]}>{itm.quantity}</Text>
              <Text style={[styles.tableValue, styles.priceCol]}>
                ₹{parseFloat(itm.subTotal?.$numberDecimal || '0').toFixed(2)}
              </Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.label}>Total</Text>
            <Text style={styles.value}>₹{total}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.label}>Discount</Text>
            <Text style={[styles.value, styles.discountValue]}>₹{discount}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.labelBold}>Payable</Text>
            <Text style={styles.valueBold}>₹{finalAmount}</Text>
          </View>

          <Text style={styles.paymentInfo}>Payment via {item.paymentMethod}</Text>
        </Pressable>
      </View>
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

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.primary} style={styles.loadingIndicator} />;
  }

  return (
    <View style={styles.container}>
       <Text style={styles.title}>Orders</Text>

       <View style={styles.filterContainer}>
        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <Pressable
            key={status}
            onPress={() => setSelectedStatus(status)}
            style={[
              styles.statusButton,
              selectedStatus === status && styles.statusButtonActive,
            ]}
          >
            <Text
              style={[
                styles.statusButtonText,
                selectedStatus === status && styles.statusButtonTextActive,
              ]}
            >
              {status.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>

      {
        !orders || orders.length === 0 ?
        (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No orders found.</Text>
          </View>
        )
        :
        (
          <FlatList
            data={orders}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
          />
        )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 16,
    color: Colors.primary,
  },
  card: {
    backgroundColor: Colors.inputContainerBG,
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderId: {
    fontWeight: '600',
    fontSize: 16,
    color: Colors.primary,
  },
  status: {
    fontWeight: 'bold',
    fontSize: 13,
    marginRight: 9,
    marginTop: 8,
    marginBottom: -8,
  },
  date: {
    fontSize: 13,
    color: Colors.black,
    marginVertical: 4,
  },
  address: {
    lineHeight: 17,
  },
  paymentInfo: {
    marginTop: 6,
    fontSize: 12,
    fontStyle: 'italic',
    color: '#777',
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
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 6,
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 6,
  },
  tableText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  tableValue: {
    fontSize: 13,
    color: '#333',
  },
  itemCol: {
    flex: 2,
  },
  qtyCol: {
    flex: 1,
    textAlign: 'center',
  },
  priceCol: {
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  label: {
    fontSize: 13,
    color: '#333',
  },
  value: {
    fontSize: 13,
    color: '#333',
  },
  discountValue: {
    fontSize: 13,
    color: 'green',
  },
  labelBold: {
    fontSize: 14,
    fontWeight: '600',
  },
  valueBold: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  loadingIndicator: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  statusButton: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 4,
  },
  statusButtonActive: {
    backgroundColor: Colors.primary,
  },
  statusButtonText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  statusButtonTextActive: {
    color: 'white',
  },
});


export default BuyerOrderScreen;
