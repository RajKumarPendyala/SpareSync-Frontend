import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../../context/colors';

const { width } = Dimensions.get('window');

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

export default styles;
