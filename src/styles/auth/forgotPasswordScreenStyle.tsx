import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../../context/colors';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: Colors.background,
      alignItems: 'center',
      paddingTop: 60,
      paddingHorizontal: 25,
    },
    logo: {
      height: width * 0.5,
      width: width * 0.5,
      marginBottom: 30,
    },
    infoText: {
      textAlign: 'center',
      fontSize: 14,
      marginBottom: 20,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: width * 0.85,
      borderWidth: 1,
      borderColor: Colors.inputContainerBD,
      backgroundColor: Colors.inputContainerBG,
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 10,
    },
    icon: {
      marginRight: 6,
    },
    input: {
      flex: 1,
      height: 45,
      fontSize: 16,
    },
    sendButton: {
      marginTop: 10,
    },
    errorText: {
      color: Colors.secondary,
      fontSize: 14,
      marginBottom: 5,
      textAlign: 'center',
    },
    successText: {
      color: 'green',
      fontSize: 14,
      marginBottom: 5,
      textAlign: 'center',
    },
  });

export default styles;
