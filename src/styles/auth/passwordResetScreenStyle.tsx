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
      height: width * 0.5,
      width: width * 0.5,
      marginBottom: 20,
    },
    icon: {
      marginRight: 6,
    },
    eyeIcon: {
      marginLeft: 'auto',
    },
    inputWrapper1: {
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
    inputWrapper: {
      width: width * 0.85,
      marginBottom: 10,
    },
    pinCodeContainer: {
      height: 45,
    },
    pinCodeText: {
      fontSize: 18,
    },
    input: {
      flex: 1,
      height: 45,
      fontSize: 16,
    },
    timer: {
      alignSelf: 'flex-end',
      marginBottom: 15,
      marginRight: 40,
      marginTop: -2,
    },
    timerText: {
      fontSize: 14,
      fontWeight: '600',
    },
    resetButton: {
      width: width * 0.85,
      height: 45,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.primary,
      backgroundColor: '#e6f0ff',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    resetText: {
      color: Colors.primary,
      fontWeight: '600',
    },
    cancelButton: {
      width: width * 0.85,
      height: 45,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.secondary,
      backgroundColor: Colors.secondaryButtonBG,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
    },
    cancelText: {
      color: Colors.secondary,
      fontWeight: '600',
    },
    errorText: {
      color: Colors.secondary,
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 5,
    },
  });

export default styles;
