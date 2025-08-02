import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../../context/colors';


const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      paddingHorizontal: 20,
      paddingTop: 60,
    },
    logo: {
      height: width * 0.5,
      width: width * 0.5,
      alignSelf: 'center',
      marginBottom: 15,
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      textAlign: 'center',
      color: Colors.secondary,
      marginBottom: 10,
    },
    scroll: {
      paddingBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors.primary,
      marginTop: 15,
      marginBottom: 5,
    },
    text: {
      fontSize: 14,
      lineHeight: 20,
    },
    acceptBtn: {
      paddingVertical: 12,
      marginTop: 10,
      marginBottom: 20,
    },
    acceptText: {
      fontSize: 16,
    },
  });

export default styles;
