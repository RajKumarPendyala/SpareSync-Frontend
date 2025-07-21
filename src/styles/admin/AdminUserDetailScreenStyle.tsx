import { StyleSheet } from 'react-native';
import Colors from '../../context/colors';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 30,
      backgroundColor: Colors.inputContainerBG,
    },
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      backgroundColor: Colors.secondaryButtonBG,
      padding: 30,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 1, height: 2 },
      shadowRadius: 4,
      elevation: 3,
    },
    avatar: {
      width: 140,
      height: 140,
      borderRadius: 60,
      alignSelf: 'center',
      borderWidth: 2,
      borderColor: Colors.inputContainerBD,
      marginBottom: 30,
    },
    infoSection: {
      marginBottom: 15,
    },
    label: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#555',
      marginBottom: 4,
    },
    value: {
      fontSize: 16,
      color: Colors.icon,
      marginBottom: 14,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: Colors.primary,
      marginBottom: 10,
    },
    addressSection: {
      marginTop: 5,
    },
    deleteBtn: {
      marginTop: 30,
      borderRadius: 10,
      overflow: 'hidden',
    },
  });

export default styles;
