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
      marginVertical: 20,
    },
    buyerButton: {
      marginVertical: 20,
    },
    option: {
      fontWeight: '300',
    },
  });

export default styles;
