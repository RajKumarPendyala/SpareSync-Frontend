import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../../context/colors';


const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      paddingTop: 70,
      backgroundColor: Colors.background,
    },
      logo: {
      height: width * 0.6,
      width: width * 0.6,
      marginBottom: 80,
    },
    sellerButton: {
      width: width * 0.85,
      height: 45,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.primary,
      backgroundColor: '#e6f0ff',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 20,
    },
    sellerText: {
      color: Colors.primary,
      fontWeight: '600',
    },
    buyerButton: {
      width: width * 0.85,
      height: 45,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: Colors.secondary,
      backgroundColor: Colors.secondaryButtonBG,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 20,
    },
    buyerText: {
      color: Colors.secondary,
      fontWeight: '600',
    },
    option: {
      fontWeight: '300',
    },
  });

export default styles;
