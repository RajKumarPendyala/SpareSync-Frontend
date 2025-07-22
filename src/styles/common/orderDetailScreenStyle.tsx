import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../../context/colors';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      paddingTop: 20,
    },
    card: {
      flexDirection: 'row',
      backgroundColor: Colors.inputContainerBG,
      marginHorizontal: 20,
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
      padding: 16,
    },
    label: {
      fontSize: 15,
      color: Colors.black,
    },
    cancelButton: {
      marginTop: 10,
      backgroundColor: Colors.secondary,
      padding: 12,
      borderRadius: 10,
      alignItems: 'center',
    },
    cancelText: {
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
    quantityText: {
      fontSize: 14,
      fontWeight: '500',
      marginHorizontal: 10,
      color: Colors.icon,
    },
    orderSummaryCard: {
      backgroundColor: Colors.primaryButtonBG,
      marginHorizontal: 16,
      marginBottom: 9,
      padding: 16,
      borderRadius: 12,
      elevation: 5,
    },
    summaryHeader: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: Colors.black,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6,
    },
    value: {
      fontSize: 15,
      fontWeight: '500',
      color: Colors.icon,
    },
    address: {
      fontSize: 15,
      fontWeight: 'bold',
      color: Colors.black,
      textAlign: 'right',
      paddingRight: 65,
    },
    labelBold: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors.black,
    },
    paidText: {
      fontSize: 16,
      fontWeight: '700',
      color: Colors.primary,
    },
    discountText: {
      color: Colors.green,
    },
    divider: {
      height: 1,
      backgroundColor: '#ccc',
      marginVertical: 10,
    },
    reviewButton: {
      marginTop: 10,
      backgroundColor: Colors.primary,
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 6,
    },
    reviewText: {
      fontSize: 13,
      color: '#fff',
      fontWeight: '500',
    },
    reviewOption: {
      alignItems: 'center',
    },
    dropdown: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 10,
      marginTop: 6,
      backgroundColor: '#fff',
    },
    dropdownText: {
      fontSize: 14,
      fontWeight: '500',
      color: Colors.icon,
    },
    dropdownList: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      marginTop: 4,
      backgroundColor: '#fff',
    },
    dropdownItem: {
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    dropdownItemText: {
      fontSize: 14,
      color: Colors.black,
    },
  });

export default styles;
