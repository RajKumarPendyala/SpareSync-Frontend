import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../../context/colors';


const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      paddingTop: 30,
      paddingBottom: 136,
    },
    card: {
      flexDirection: 'row',
      backgroundColor: Colors.inputContainerBG,
      marginHorizontal: 16,
      marginVertical: 5,
      padding: 12,
      borderRadius: 12,
      elevation: 1,
      alignItems: 'center',
    },
    image: {
      width: width * 0.2,
      height: width * 0.2,
      borderRadius: 10,
    },
    details: {
      flex: 1,
      marginLeft: 12,
      gap: 8,
    },
    name: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors.green,
    },
    quantity: {
      fontSize: 14,
      marginVertical: 4,
      color: Colors.black,
    },
    priceDiscount: {
      flex: 1,
      flexDirection: 'row',
    },
    price: {
      fontSize: 13,
      fontWeight: '400',
      color: Colors.icon,
      marginRight: 10,
      textDecorationLine: 'line-through',
    },
    totalText2: {
      fontSize: 17,
      fontWeight: '400',
      color: Colors.icon,
      marginRight: 10,
      marginLeft: 10,
      textDecorationLine: 'line-through',
    },
    discountPrice: {
      fontSize: 14,
      fontWeight: '600',
      color: Colors.primary,
    },
    discount: {
      fontSize: 12,
      color: Colors.secondary,
    },
    summary: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      backgroundColor: Colors.primaryButtonBG,
      padding: 16,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      elevation: 10,
    },
    totalText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.primary,
    },
    discountText: {
      fontSize: 14,
      color: Colors.secondary,
      marginTop: 4,
    },
    checkoutButton: {
      marginTop: 10,
      backgroundColor: Colors.green,
      padding: 12,
      borderRadius: 10,
      alignItems: 'center',
    },
    checkoutText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#fff',
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
    quantityControl: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 4,
    },
    quantityButton: {
      backgroundColor: Colors.inputContainerBD,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 4,
    },
    disabledButton: {
      backgroundColor: Colors.primaryButtonBG,
    },
    buttonText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
    },
    quantityText: {
      fontSize: 14,
      fontWeight: '500',
      marginHorizontal: 10,
    },
    manipulateContainer: {
      flexDirection: 'column',
      gap: 15,
      alignItems: 'center',
    },
    outOfStock: {
      color: 'red',
      fontWeight: '600',
      marginTop: 4,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.4)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: '85%',
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 20,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
      color: Colors.primary,
    },
    paymentOption: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: Colors.inputContainerBD,
      borderRadius: 8,
      width: '100%',
      alignItems: 'center',
    },
    selectedOption: {
      borderColor: Colors.green,
      backgroundColor: Colors.inputContainerBG,
    },
    optionText: {
      fontSize: 16,
      color: Colors.black,
    },
    confirmButton: {
      backgroundColor: Colors.green,
      padding: 10,
      borderRadius: 8,
      marginTop: 20,
      width: '100%',
      alignItems: 'center',
    },
    confirmText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 16,
    },
    cancelText: {
      color: Colors.secondary,
      marginTop: 15,
      fontSize: 16,
    },
  });

export default styles;
