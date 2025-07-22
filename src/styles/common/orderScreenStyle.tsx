import { StyleSheet } from 'react-native';
import Colors from '../../context/colors';


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      paddingTop: 15,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      margin: 16,
      color: Colors.primary,
    },
    card: {
      backgroundColor: Colors.inputContainerBG,
      marginHorizontal: 16,
      marginVertical: 10,
      padding: 16,
      borderRadius: 12,
      elevation: 2,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    orderId: {
      fontWeight: '600',
      fontSize: 16,
      color: Colors.primary,
    },
    status: {
      fontWeight: 'bold',
      fontSize: 13,
      marginRight: 9,
      marginTop: 8,
      marginBottom: -8,
    },
    date: {
      fontSize: 13,
      color: Colors.black,
      marginVertical: 4,
    },
    address: {
      lineHeight: 17,
    },
    paymentInfo: {
      marginTop: 6,
      fontSize: 12,
      fontStyle: 'italic',
      color: '#777',
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
    tableHeader: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#ccc',
      paddingVertical: 6,
      marginTop: 10,
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#eee',
      paddingVertical: 6,
    },
    tableText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#555',
    },
    tableValue: {
      fontSize: 13,
      color: '#333',
    },
    itemCol: {
      flex: 2,
    },
    qtyCol: {
      flex: 1,
      textAlign: 'center',
    },
    priceCol: {
      flex: 1,
      textAlign: 'right',
    },
    divider: {
      height: 1,
      backgroundColor: '#ccc',
      marginVertical: 10,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 2,
    },
    label: {
      fontSize: 13,
      color: '#333',
    },
    value: {
      fontSize: 13,
      color: '#333',
    },
    discountValue: {
      fontSize: 13,
      color: 'green',
    },
    labelBold: {
      fontSize: 14,
      fontWeight: '600',
    },
    valueBold: {
      fontSize: 14,
      fontWeight: '600',
      color: '#000',
    },
    loadingIndicator: {
      flex: 1,
    },
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginHorizontal: 10,
      marginBottom: 10,
    },
    statusButton: {
      borderRadius: 20,
      borderWidth: 1,
      borderColor: Colors.primary,
      paddingVertical: 6,
      paddingHorizontal: 12,
      margin: 4,
    },
    statusButtonActive: {
      backgroundColor: Colors.primary,
    },
    statusButtonText: {
      fontSize: 12,
      color: Colors.primary,
      fontWeight: '500',
    },
    statusButtonTextActive: {
      color: 'white',
    },
  });

export default styles;
