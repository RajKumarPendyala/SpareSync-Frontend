import { StyleSheet } from 'react-native';
import Colors from '../../context/colors';


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    header: {
      fontSize: 24,
      fontWeight: 'bold',
      color: Colors.green,
      marginBottom: 12,
    },
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 12,
    },
    filterButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 20,
      backgroundColor: Colors.inputContainerBG,
      borderWidth: 1,
      borderColor: Colors.green,
    },
    filterButtonActive: {
      backgroundColor: Colors.green,
    },
    filterText: {
      color: Colors.green,
      fontWeight: '600',
    },
    filterTextActive: {
      color: 'white',
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      marginVertical: 6,
      backgroundColor: Colors.inputContainerBG,
      borderRadius: 10,
      elevation: 2,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 16,
      backgroundColor: '#eee',
    },
    infoContainer: {
      flex: 1,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.green,
    },
    info: {
      fontSize: 14,
      color: Colors.black,
      marginTop: 4,
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
      padding: 13,
      borderRadius: 12,
      width: 120,
    },
    dropdownItem: {
      fontSize: 16,
      marginVertical: 5,
      color: Colors.green,
    },
  });

export default styles;
