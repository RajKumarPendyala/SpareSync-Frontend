import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../../context/colors';


const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.background,
    },
    logo: {
      height: width * 0.8,
      marginBottom: 80,
    },
    });

export default styles;
