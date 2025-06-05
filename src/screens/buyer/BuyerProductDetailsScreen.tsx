import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { StackParamList } from '../../navigation/StackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSpareParts } from '../../context/SparePartsContext';
import { IP_ADDRESS } from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../context/colors';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');

type BuyerProductDetailsScreenNavigationProp = StackNavigationProp<
  StackParamList,
  'BuyerProductDetails'
>;

interface Props {
  navigation: BuyerProductDetailsScreenNavigationProp;
  route: {
    params: {
      partId: string;
    };
  };
}

const BuyerProductDetailsScreen: React.FC<Props> = ({ route }) => {
  const { partId } = route.params;
console.log(partId);
  const { spareParts } = useSpareParts();

  const product = spareParts.find((item: any) => item._id === partId);

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Product not found.</Text>
      </View>
    );
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

      <TouchableOpacity style={styles.cartButton} onPress={() => handleAddCart(product)}>
        <Text style={styles.cartButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width,
    padding: 20,
    marginTop: 40,
  },
  star: {
    flex: 1,
    textAlign: 'right',
    color: Colors.primary,
  },
  image: {
    marginLeft: 10,
    width : width * 0.9,
    height: width * 0.7,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
  },
  priceDiscount: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  price: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.icon,
    textDecorationLine: 'line-through',
    marginTop: 1,
  },
  discountPrice: {
    fontSize: 20,
    fontWeight: '500',
    color: Colors.primary,
    marginTop: 1,
  },
  discount: {
    fontSize: 20,
    fontWeight: '500',
    marginRight: 10,
    color: Colors.secondary,
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors. black,
    marginTop: 10,
  },
  value: {
    color: Colors.icon,
    fontWeight: 400,
  },
  descTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
    color: Colors.black,
  },
  description: {
    fontSize: 14,
    color: Colors.icon,
    marginTop: 6,
    borderBottomWidth: 0.5,
    paddingBottom: 10,
    borderColor: '#ccc',
  },
  reviewTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.black,
  },
  reviewContainer: {
    marginTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 15,
  },
  userInfo: {
    flexDirection: 'column',
  },
  userName: {
    fontWeight: '500',
    marginBottom: 5,
    color: Colors.icon,
  },
  ratingRow: {
    flexDirection: 'row',
  },
  comment: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 4,
  },
  reviewImage: {
    width: 70,
    height: 70,
    borderRadius: 6,
    marginRight: 8,
    marginTop: 10,
  },
  noReviews: {
    marginTop: 8,
    color: Colors.secondary,
    fontStyle: 'italic',
  },
  cartButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cartButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: Colors.secondary,
  },
});

export default BuyerProductDetailsScreen;
