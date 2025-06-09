import React, { useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, Image, StyleSheet, Dimensions, Alert, Modal, Pressable } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackParamList } from '../../navigation/StackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { IP_ADDRESS } from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSpareParts } from '../../context/SparePartsContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../context/colors';

const { width } = Dimensions.get('window');

type SparePartsRouteProp = RouteProp<StackParamList, 'SpareParts'>;
type SparePartsScreenNavigationProp = StackNavigationProp<StackParamList, 'SpareParts'>;

const SparePartsScreen: React.FC = () => {
  const navigation = useNavigation<SparePartsScreenNavigationProp>();
  const route = useRoute<SparePartsRouteProp>();

  const { gadgetType, roleName } = route.params;


  const { spareParts } = useSpareParts();

  const uniqueBrands = [...new Set(spareParts.map((part: any) => part.brand))];

  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [priceOrder, setPriceOrder] = useState<'asc' | 'desc' | null>(null);
  const [brandModalVisible, setBrandModalVisible] = useState(false);
  const [priceModalVisible, setPriceModalVisible] = useState(false);

  let filteredParts = spareParts.filter((part: any) => part.gadgetType === gadgetType);

  if (selectedBrand) {
    filteredParts = filteredParts.filter((part: any) => part.brand === selectedBrand);
  }

  if (priceOrder) {
    filteredParts.sort((a: any, b: any) => {
      const priceA = parseFloat(a.price.$numberDecimal);
      const priceB = parseFloat(b.price.$numberDecimal);
      return priceOrder === 'asc' ? priceA - priceB : priceB - priceA;
    });
  }


  const handleAddCart = async (item: any) => {
    try {

console.log('SparePartsScreen.handleAddCart');

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

  const clearFilter = () => {
    setSelectedBrand(null);
    setPriceOrder(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.modalTriggerButton} onPress={() => setBrandModalVisible(true)} >
          <Text style={styles.modalTriggerText}>
            {selectedBrand ? `Brand: ${selectedBrand}` : 'Select Brand'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalTriggerButton} onPress={() => setPriceModalVisible(true)} >
          <Text style={styles.modalTriggerText}>
            {priceOrder ? `Price: ${priceOrder === 'asc' ? 'Low → High' : 'High → Low'}` : 'Sort by Price'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalTriggerButton} onPress={clearFilter}>
          <Text style={styles.modalTriggerText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {
        filteredParts && filteredParts.length > 0 ? (
          <FlatList
            data={filteredParts}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <Pressable onPress={() => navigation.navigate('BuyerProductDetails', { partId: item._id, roleName: null })} style={({ pressed }) => [ pressed && { opacity: 0.9 } ]}>
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
                    <Text style={styles.discount}>-{parseFloat(item.discount.$numberDecimal).toFixed(0)}%</Text>
                    <View style={styles.ratingContainer}>
                      <Icon name="star" size={16} color="#FFD700" />
                      <Text style={styles.ratingText}>{item.averageRating}</Text>
                    </View>
                  </View>
                    {
                      roleName === 'buyer' ?
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
                        <TouchableOpacity style={styles.cart}
                        onPress={() => navigation.navigate('EditProductScreen', { sparePartId: item._id })}
                        >
                          <Icon name="pencil" size={30} color={Colors.primary} />
                        </TouchableOpacity>
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

      <Modal visible={brandModalVisible} animationType="slide" transparent={true} onRequestClose={() => setBrandModalVisible(false)} >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setBrandModalVisible(false)} style={styles.closeIcon}>
              <Icon name="close" size={24} color={Colors.secondary} />
            </TouchableOpacity>
            <View style={styles.dragIndicator} />
            <Text style={styles.modalTitle}>Select Brand</Text>
            {uniqueBrands.map((brand) => (
              <TouchableOpacity
              key={brand as React.Key}
                onPress={() => {
                  setSelectedBrand(brand as string);
                  setBrandModalVisible(false);
                }}
                style={styles.modalOption}
              >
                <Text style={styles.modalOptionText}>{brand as string}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
      <Modal visible={priceModalVisible} animationType="slide" transparent={true} onRequestClose={() => setPriceModalVisible(false)} >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setPriceModalVisible(false)} style={styles.closeIcon}>
              <Icon name="close" size={24} color={Colors.secondary} />
            </TouchableOpacity>
            <View style={styles.dragIndicator} />
            <Text style={styles.modalTitle}>Sort by Price</Text>
            <TouchableOpacity
              onPress={() => {
                setPriceOrder('asc');
                setPriceModalVisible(false);
              }}
              style={styles.modalOption}
            >
              <Text style={styles.modalOptionText}>Low → High</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setPriceOrder('desc');
                setPriceModalVisible(false);
              }}
              style={styles.modalOption}
            >
              <Text style={styles.modalOptionText}>High → Low</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {
        roleName === 'buyer' ? ''
        :
        (
          <TouchableOpacity
            style={styles.floatingAddIcon}
            onPress={() => navigation.navigate('AddProductScreen')}
          >
            <Icon name="plus" size={24} color="white" />
          </TouchableOpacity>
        )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 8,
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
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 5,
  },
  modalTriggerButton: {
    backgroundColor: Colors.secondaryButtonBG,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginRight: 10,
    elevation: 1,
  },
  modalTriggerText: {
    color: Colors.black,
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '50%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: Colors.primary,
  },
  modalOption: {
    paddingVertical: 10,
    width: '100%',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
    color: Colors.black,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginBottom: 10,
  },
  closeIcon: {
    position: 'absolute',
    top: 30,
    color: Colors.secondary,
    right: 30,
    zIndex: 1,
  },
  floatingAddIcon: {
    position: 'absolute',
    right: 35,
    bottom: 150,
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

export default SparePartsScreen;
