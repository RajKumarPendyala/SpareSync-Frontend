import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StackParamList } from '../../navigation/StackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useSpareParts } from '../../context/SparePartsContext';
import { IP_ADDRESS } from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../../styles/common/productDetailsScreenStyle';


type BuyerProductDetailsScreenNavigationProp = StackNavigationProp<
  StackParamList,
  'BuyerProductDetails'
>;

interface Props {
  navigation: BuyerProductDetailsScreenNavigationProp;
  route: {
    params: {
      partId: string;
      roleName: string | null;
    };
  };
}

const ProductDetailsScreen: React.FC<Props> = ({ route }) => {
  const { partId, roleName } = route.params;
console.log(partId);
    const { spareParts, setSpareParts } = useSpareParts();

  const navigation = useNavigation<BuyerProductDetailsScreenNavigationProp>();

  const product = spareParts.find((item: any) => item._id === partId);

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Product not found.</Text>
      </View>
    );
  }

  const handleChatOption = async () => {
    const token = await AsyncStorage.getItem('token');

    try {
      const response = await axios.post(
        `http://${IP_ADDRESS}:3000/api/users/conversations/message`,
        {
          senderId2: product.addedBy,
          text: 'How Can I Help You!',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      (navigation as StackNavigationProp<StackParamList, 'BuyerProductDetails'>).navigate('ChatDetail', { conversationId: response.data.conversation._id });


    } catch (error: any) {
      console.error('Send message failed:', error?.response?.data || error.message);
      Alert.alert('Fail', 'Failed to enable chat option');
    }
  };

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

  const handleDelete = async (item: any) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete product?',
      [
        {
          text: 'No',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');

              const response = await axios.patch(
                `http://${IP_ADDRESS}:3000/api/users/products/seller`,
                { _id: item._id, isDeleted: true },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              if (response.status === 200) {
                setSpareParts((prevParts: any) => prevParts.filter((part: any) => part._id !== item._id));
                Alert.alert('Success', 'Product deleted successfully');
                navigation.goBack();
              }
            } catch (error: any) {
              console.error('Error deleting product:', error?.response?.data || error.message);
              Alert.alert('Failed to delete product.');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };
console.log('role name: ',roleName);


  return (
    <View style={styles.screen}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.star}>
            <Icon
              name={ 'star'}
              size={16}
              color="#f1c40f"
            />
            {product.averageRating || 0}/5
          </Text>
        </View>

        <FlatList
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          data={product.images}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <Image
              source={
                item?.path
                  ? { uri: item?.path }
                  : { uri: 'https://res.cloudinary.com/dxcbw424l/image/upload/v1749116154/rccjtgfk1lt74twuxo3b.jpg' }
              }
              style={styles.image}
              onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
            />
          )}
        />

        <View style={styles.detailsContainer}>
          <View style={styles.priceDiscount}>
            {parseFloat(product.discount.$numberDecimal) > 0 && (
              <>
                <Text style={styles.price}>
                  {'₹' + parseFloat(product.price.$numberDecimal).toFixed(2)}
                </Text>
                <Text style={styles.discount}>
                  {'  -' + parseFloat(product.discount.$numberDecimal).toFixed(0)}%
                </Text>
              </>
            )}
            <Text style={styles.discountPrice}>
              ₹
              {(
                parseFloat(product.price.$numberDecimal) *
                (1 - parseFloat(product.discount.$numberDecimal) / 100)
              ).toFixed(2)}
            </Text>
          </View>
          <Text style={styles.label}>Brand: <Text style={styles.value}>{product.brand}</Text></Text>
          <Text style={styles.label}>Type: <Text style={styles.value}>{product.gadgetType}</Text></Text>
          <Text style={styles.label}>Color: <Text style={styles.value}>{product.color || 'N/A'}</Text></Text>
          <Text style={styles.label}>Weight: <Text style={styles.value}>{product.weight ? parseFloat(product.weight.$numberDecimal).toFixed(2) + ' kg' : 'N/A'}</Text></Text>
          <Text style={styles.label}>Warranty: <Text style={styles.value}>{product.warrentyPeriod || 0} months</Text></Text>
          <Text style={styles.label}>Quantity Available: <Text style={styles.value}>{product.quantity}</Text></Text>
          <Text style={styles.label}>Dimensions: <Text style={styles.value}>{product.dimension || 'N/A'}</Text></Text>
          <Text style={styles.descTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          <Text style={styles.reviewTitle}>Customer Reviews</Text>
          {product.reviews?.length ? (
            product.reviews.map((review: any, index: number) => (
              <View key={index} style={styles.reviewContainer}>
                <View style={styles.reviewHeader}>
                  <Image
                    source={
                      review.userImage?.path
                        ? { uri: review.userImage?.path }
                        : { uri: 'https://res.cloudinary.com/dxcbw424l/image/upload/v1749116154/rccjtgfk1lt74twuxo3b.jpg' }
                    }
                    style={styles.userImage}
                    onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                  />
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{review.userName}</Text>
                    <View style={styles.ratingRow}>
                      {[...Array(5)].map((_, i) => (
                        <Icon
                          key={i}
                          name={i < review.rating ? 'star' : 'star-o'}
                          size={16}
                          color="#f1c40f"
                        />
                      ))}
                    </View>
                  </View>
                </View>
                <Text style={styles.comment}>{review.comment}</Text>
                <ScrollView horizontal>
                  {review.images?.map((img: any, idx: number) => (
                    <Image
                      key={idx}
                      source={
                        img?.path
                          ? { uri: img?.path }
                          : { uri: 'https://res.cloudinary.com/dxcbw424l/image/upload/v1749116154/rccjtgfk1lt74twuxo3b.jpg' }
                      }
                      style={styles.reviewImage}
                      onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                    />
                  ))}
                </ScrollView>
              </View>
            ))
          ) : (
            <Text style={styles.noReviews}>No reviews yet.</Text>
          )}
        </View>
      </ScrollView>

      {
        roleName === 'buyer' ?
        (
          <TouchableOpacity
            style={styles.floatingChatIcon}
            onPress={() => handleChatOption()}
          >
            <Icon name="comments" size={24} color="white" />
          </TouchableOpacity>
        )
        :
        (
          roleName === 'seller' ?
          (
            <TouchableOpacity style={styles.floatingChatIcon}
            onPress={() => navigation.navigate('EditProductScreen', { sparePartId: product._id })}
            >
              <Icon name="pencil" size={25} color="white" />
            </TouchableOpacity>
          ) : ('')
        )
      }

      {
        roleName === 'buyer' ?
        (
          product.quantity >= 1 ?
          (
            <TouchableOpacity style={styles.cartButton} onPress={() => handleAddCart(product)}>
              <Text style={styles.cartButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          )
          :
          (
            <View style={styles.stockButton}>
              <Text style={styles.cartButtonText}>Out of Stock</Text>
            </View>
          )
        )
        :
        (
          <TouchableOpacity style={styles.stockButton} onPress={() => handleDelete(product)}>
            <Text style={styles.cartButtonText}>Delete The Product</Text>
          </TouchableOpacity>
        )
      }
    </View>
  );
};


export default ProductDetailsScreen;
