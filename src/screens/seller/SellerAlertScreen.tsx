import { View, FlatList, Text, TouchableOpacity, Image, StyleSheet, Dimensions, Pressable } from 'react-native';
import { StackParamList } from '../../navigation/StackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSpareParts } from '../../context/SparePartsContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../context/colors';

const { width } = Dimensions.get('window');

type SellerAlertScreenNavigationProp = StackNavigationProp<StackParamList, 'AlertScreen'>;

interface Props {
  navigation: SellerAlertScreenNavigationProp;
}


const SellerAlertScreen: React.FC<Props> = ({ navigation }) => {

  const { spareParts } = useSpareParts();
  let filteredParts = spareParts.filter((part: any) => part.quantity <= 10);

  return (
    <View style={styles.container}>
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
  quantity: {
    fontSize: 18,
    color: 'red',
    marginRight: -40,
    fontWeight: 500,
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
  edit: {
    justifyContent: 'flex-end',
    marginBottom: 20,
    marginRight: 20,
  },
});


export default SellerAlertScreen;
