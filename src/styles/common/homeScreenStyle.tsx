import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../../context/colors';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    line:{
      height:2,
      backgroundColor: Colors.primary,
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
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      paddingTop: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginBottom: 10,
    },
    logo: {
      fontSize: 20,
      fontWeight: '800',
      color: Colors.primary,
    },
    menuButton: {
      padding: 5,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.2)',
      padding: 20,
    },
    dropdown: {
      backgroundColor: Colors.primaryButtonBG,
      padding: 15,
      borderRadius: 12,
      width: 130,
    },
    dropdownItem: {
      fontSize: 16,
      marginVertical: 8,
      color: Colors.primary,
    },
    grid: {
      alignItems: 'center',
      marginTop: 5,
    },
    card: {
      backgroundColor: Colors.secondaryButtonBG,
      borderRadius: 16,
      paddingVertical: 14,
      width: width * 0.44,
      margin: 5,
      alignItems: 'center',
      elevation: 1,
    },
    cardText: {
      marginTop: 10,
      fontSize: 14,
      textAlign: 'center',
      color: Colors.black,
    },
    card2: {
      flexDirection: 'row',
      backgroundColor: Colors.inputContainerBG,
      borderRadius: 12,
      marginVertical: 6,
      marginHorizontal: 15,
      padding: 8,
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
    cart: {
      justifyContent: 'flex-end',
      marginBottom: 20,
      marginRight: 20,
    },
    floatingAddIcon: {
      position: 'absolute',
      right: 20,
      bottom: 30,
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
