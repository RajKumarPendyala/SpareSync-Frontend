import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../../context/colors';


const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flexGrow : 1,
      alignItems: 'center',
      paddingTop: 55,
      backgroundColor: Colors.background,
    },
    logo: {
      height: width * 0.6,
      marginBottom: 4,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      marginBottom: 23,
    },
    inputWrapper: {
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
    inputWrapper1: {
      marginBottom: 15,
    },
    pinCodeContainer: {
      height: 45,
    },
    pinCodeText: {
      fontSize: 18,
    },
    timer: {
      alignSelf: 'flex-end',
      marginBottom: 15,
      marginRight: 10,
      marginTop: -10,
    },
    timerText: {
      fontSize: 14,
      fontWeight: '600',
    },
    input: {
      flex: 1,
      height: 45,
      fontSize: 16,
    },
    verifyButton: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      backgroundColor: Colors.primaryButtonBG,
      borderRadius: 6,
      marginLeft: 8,
    },
    verifyText: {
      color: Colors.primary,
      fontWeight: '600',
      fontSize: 12,
    },
    icon: {
      marginRight: 6,
    },
    eyeIcon: {
      marginLeft: 'auto',
    },
    signupButton: {
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
    signupText: {
      color: Colors.primary,
      fontWeight: '600',
    },
    loginLink: {
      color: Colors.secondary,
    },
    termsText: {
      marginTop: 20,
      color: Colors.black,
    },
    link: {
      color: Colors.primary,
    },
    errorText: {
      color: Colors.secondary,
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 15,
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.3)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: width * 0.85,
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
      elevation: 5,
    },
    modalText: {
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
    },
    closeButton: {
      backgroundColor: '#ffebe6',
      padding: 10,
      borderRadius: 6,
      alignItems: 'center',
    },
    closeText: {
      color: '#d9534f',
      fontWeight: '600',
    },
  });

export default styles;
