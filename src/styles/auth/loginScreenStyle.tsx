import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../../context/colors';


const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      alignItems: 'center',
      paddingTop: 60,
      backgroundColor: Colors.background,
    },
    logo: {
      height: width * 0.6,
      width: width * 0.6,
      marginBottom: 20,
    },
    title: {
      fontWeight: '700',
      fontSize: 18,
      marginBottom: 25,
    },
    inputContainer: {
      flexDirection: 'row',
      width: width * 0.85,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: Colors.inputContainerBD,
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 15,
      backgroundColor: Colors.inputContainerBG,
    },
    icon: {
      marginRight: 6,
    },
    eyeIcon: {
      marginLeft: 'auto',
    },
    input: {
      flex: 1,
      height: 45,
      fontSize: 16,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginRight: 40,
      marginBottom: 15,
    },
    forgotText: {
      fontSize: 14,
      color: Colors.primary,
    },
    loginButton: {
      width: width * 0.85,
      height: 45,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.primary,
      backgroundColor: Colors.primaryButtonBG,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 15,
    },
    loginText: {
      color: Colors.primary,
      fontWeight: '600',
    },
    registerText: {
      color: Colors.secondary,
    },
    errorText: {
      color: Colors.secondary,
      fontSize: 14,
      marginBottom: 15,
      textAlign: 'center',
    },
  });

export default styles;
