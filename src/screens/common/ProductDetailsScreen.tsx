import React, {useState, useRef} from 'react';
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
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../../styles/common/productDetailsScreenStyle';
import {
  sendChatMessage,
  addProductToCart,
  deleteProduct,
} from '../../services/common/productDetailsService';


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

  const [currentIndex, setCurrentIndex] = useState(0);
  const onViewRef = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });


  const { partId, roleName } = route.params;

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
    try {
      const data = await sendChatMessage(product.addedBy);
      navigation.navigate('ChatDetail', {
        conversationId: data.conversation._id,
      });
    } catch (error: any) {
      console.log('Send message failed:', error?.response?.data || error.message);
      Alert.alert('Fail', 'Failed to enable chat option');
    }
  };

  const handleAddCart = async () => {
    try {
      const data = await addProductToCart(product._id);
      if (data.message) {
        Alert.alert('Item added to cart successfully!');
      }
    } catch (error: any) {
      console.log('Error adding to cart:', error?.response?.data || error.message);
      Alert.alert('Failed to add item to cart.');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete product?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              await deleteProduct(product._id);
              setSpareParts((prevParts: any) =>
                prevParts.filter((part: any) => part._id !== product._id)
              );
              Alert.alert('Success', 'Product deleted successfully');
              navigation.goBack();
            } catch (error: any) {
              console.log('Error deleting product:', error?.response?.data || error.message);
              Alert.alert('Failed to delete product.');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };


  return (
    <View style={styles.screen}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#f1c40f" />
            <Text style={styles.ratingText}>
              {product.averageRating || 0}/5
            </Text>
          </View>
        </View>


        <FlatList
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          data={product.images && product.images.length > 0
            ? product.images
            : [{ path: null }]}
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
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
        />

        <View style={styles.pagination}>
          {product.images.map((_: any, index: any) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: index === currentIndex ? '#4CAF50' : '#ccc' }
              ]}
            />
          ))}
        </View>


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
          <Text style={styles.label}>
            Warranty:{' '}
            <Text style={styles.value}>
              {typeof product.warrentyPeriod === 'number'
                ? product.warrentyPeriod.toFixed(0) + ' months'
                : 'N/A'}
            </Text>
          </Text>

          <Text style={styles.label}>
            Quantity Available:{' '}
            <Text style={styles.value}>
              {typeof product.quantity === 'number'
                ? product.quantity.toFixed(0)
                : 'N/A'}
            </Text>
          </Text>
          <Text style={styles.label}>Dimensions: <Text style={styles.value}>{product.dimension || 'N/A'}</Text></Text>
          <Text style={styles.descTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          <Text style={styles.reviewTitle}>Customer Reviews</Text>
          {product.reviews?.length ? (
            product.reviews.map((review: any, index: number) => (
              <View key={index} style={styles.reviewContainer}>
                <View style={styles.reviewHeader}>

                  <Image
                    source={{
                      uri: review?.userImage?.path || 'https://res.cloudinary.com/dxcbw424l/image/upload/v1749116154/rccjtgfk1lt74twuxo3b.jpg',
                    }}
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
            <TouchableOpacity style={styles.cartButton} onPress={() => handleAddCart()}>
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
          <TouchableOpacity style={styles.stockButton} onPress={() => handleDelete()}>
            <Text style={styles.cartButtonText}>Delete The Product</Text>
          </TouchableOpacity>
        )
      }
    </View>
  );
};


export default ProductDetailsScreen;
