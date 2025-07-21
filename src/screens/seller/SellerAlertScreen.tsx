import { View, FlatList, Text, TouchableOpacity, Image, Pressable } from 'react-native';
import { StackParamList } from '../../navigation/StackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useSpareParts } from '../../context/SparePartsContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../context/colors';
import styles from '../../styles/seller/SellerAlertScreenStyle';


type SellerAlertScreenNavigationProp = StackNavigationProp<StackParamList, 'AlertScreen'>;

interface Props {
  navigation: SellerAlertScreenNavigationProp;
}


const SellerAlertScreen: React.FC<Props> = ({ navigation }) => {

  const { spareParts } = useSpareParts();
  let filteredParts = spareParts.filter((part: any) => part.quantity <= 10);
    const route = useRoute<RouteProp<StackParamList, 'AlertScreen'>>();
    const { roleName } = route.params;

  return (
    <View style={styles.container}>
      {
        filteredParts && filteredParts.length > 0 ? (
          <FlatList
            data={filteredParts}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <Pressable onPress={() => navigation.navigate('BuyerProductDetails', { partId: item._id, roleName: roleName })} style={({ pressed }) => [ pressed && { opacity: 0.9 } ]}>
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
                  <Text style={styles.quantity}>{item.quantity}x</Text>
                  <TouchableOpacity style={styles.edit}
                  onPress={() => navigation.navigate('EditProductScreen', { sparePartId: item._id })}
                  >
                    <Icon name="pencil" size={30} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              </Pressable>
            )}
          />
        ) : (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No product is in low stock.</Text>
          </View>
        )
      }
    </View>
  );
};


export default SellerAlertScreen;
