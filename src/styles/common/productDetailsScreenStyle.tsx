import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../../context/colors';

const { width } = Dimensions.get('window');

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
    stockButton: {
      backgroundColor: Colors.secondary,
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
    floatingChatIcon: {
      position: 'absolute',
      right: 20,
      bottom: 80,
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

export default styles;
