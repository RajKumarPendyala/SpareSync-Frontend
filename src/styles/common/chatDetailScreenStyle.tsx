import { StyleSheet } from 'react-native';
import Colors from '../../context/colors';


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f7faff',
    },
    chatContainer: {
      padding: 10,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      paddingHorizontal: 15,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: Colors.inputContainerBD,
      gap: 14,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 18,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 24,
    },
    userName: {
      fontSize: 20,
      fontWeight: 500,
      color: Colors.black,
    },
    dots: {
      flex: 1,
      alignItems: 'flex-end',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.2)',
      padding: 20,
    },
    dropdown: {
      backgroundColor: Colors.secondaryButtonBG,
      padding: 10,
      borderRadius: 12,
      width: 125,
    },
    dropdownItem: {
      fontSize: 16,
      marginVertical: 7,
      color: Colors.secondary,
    },
    messageContainer: {
      maxWidth: '70%',
      padding: 10,
      borderRadius: 12,
      marginVertical: 4,
    },
    sent: {
      alignSelf: 'flex-end',
      backgroundColor: Colors.primaryButtonBG,
    },
    received: {
      alignSelf: 'flex-start',
      backgroundColor: Colors.secondaryButtonBG,
    },
    messageText: {
      fontSize: 15,
      color: Colors.black,
    },
    timestamp: {
      fontSize: 10,
      color: Colors.icon,
      marginTop: 4,
      textAlign: 'right',
    },
    inputRow: {
      flexDirection: 'row',
      padding: 10,
      borderTopWidth: 1,
      borderTopColor: Colors.inputContainerBD,
      backgroundColor: '#fff',
    },
    input: {
      flex: 1,
      padding: 10,
      borderWidth: 1,
      borderColor: Colors.inputContainerBD,
      borderRadius: 25,
      marginRight: 10,
      backgroundColor: Colors.inputContainerBG,
    },
    send: {
      justifyContent: 'center',
    },
  });

export default styles;
