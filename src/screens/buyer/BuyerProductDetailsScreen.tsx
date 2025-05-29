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
        <FlatList
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          data={product.images}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: `http://${IP_ADDRESS}:3000${item.path}` }} style={styles.image} />
          )}
        />

        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>₹{parseFloat(product.price.$numberDecimal).toFixed(2)}</Text>
          {parseFloat(product.discount) > 0 && (
            <Text style={styles.discount}>Discount: ₹{parseFloat(product.discount.$numberDecimal).toFixed(2)}</Text>
          )}

          <Text style={styles.label}>Brand: <Text style={styles.value}>{product.brand}</Text></Text>
          <Text style={styles.label}>Type: <Text style={styles.value}>{product.gadgetType}</Text></Text>
          <Text style={styles.label}>Color: <Text style={styles.value}>{product.color || 'N/A'}</Text></Text>
          <Text style={styles.label}>Weight: <Text style={styles.value}>{product.weight ? parseFloat(product.weight.$numberDecimal).toFixed(2) + ' kg' : 'N/A'}</Text></Text>
          <Text style={styles.label}>Warranty: <Text style={styles.value}>{product.warrentyPeriod || 0} months</Text></Text>
          <Text style={styles.label}>Quantity Available: <Text style={styles.value}>{product.quantity}</Text></Text>
          <Text style={styles.label}>Dimensions: <Text style={styles.value}>{product.dimension || 'N/A'}</Text></Text>
          <Text style={styles.label}>Average Rating: <Text style={styles.value}>{product.averageRating || 0}/5</Text></Text>

          <Text style={styles.descTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          <Text style={styles.reviewTitle}>Customer Reviews</Text>
          {product.reviews?.length ? (
            product.reviews.map((review: any, index: number) => (
              <View key={index} style={styles.reviewContainer}>
                <View style={styles.reviewHeader}>
                  <Image
                    source={{ uri: `http://${IP_ADDRESS}:3000${review.userImage?.path}` }}
                    style={styles.userImage}
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
                      source={{ uri: `http://${IP_ADDRESS}:3000${img.path}` }}
                      style={styles.reviewImage}
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
  image: {
    width,
    height: width * 0.7,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 4,
  },
  discount: {
    fontSize: 14,
    color: Colors.secondary,
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    color: Colors.primary,
    marginTop: 6,
  },
  value: {
    fontWeight: '600',
    color: Colors.secondary,
  },
  descTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 14,
    color: Colors.primary,
  },
  description: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 6,
  },
  reviewTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  reviewContainer: {
    marginTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  userImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 10,
  },
  userInfo: {
    flexDirection: 'column',
  },
  userName: {
    fontWeight: '600',
    color: Colors.primary,
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
    marginTop: 6,
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
