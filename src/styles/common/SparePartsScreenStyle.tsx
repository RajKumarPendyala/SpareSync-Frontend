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
    filterRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      marginBottom: 5,
    },
    modalTriggerButton: {
      backgroundColor: Colors.secondaryButtonBG,
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 12,
      marginRight: 10,
      elevation: 1,
    },
    modalTriggerText: {
      color: Colors.black,
      fontSize: 14,
      fontWeight: '600',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: Colors.background,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: 20,
      maxHeight: '50%',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 10,
      color: Colors.primary,
    },
    modalOption: {
      paddingVertical: 10,
      width: '100%',
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
      alignItems: 'center',
    },
    modalOptionText: {
      fontSize: 16,
      color: Colors.black,
    },
    dragIndicator: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: '#ccc',
      alignSelf: 'center',
      marginBottom: 10,
    },
    closeIcon: {
      position: 'absolute',
      top: 30,
      color: Colors.secondary,
      right: 30,
      zIndex: 1,
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
