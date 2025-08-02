import { StyleSheet } from 'react-native';
import Colors from '../context/colors';

const styles = StyleSheet.create({
    button: {
      backgroundColor: Colors.secondaryButtonBG,
      borderWidth: 1,
      borderColor: Colors.secondary,
      paddingVertical: 10,
      paddingHorizontal: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: Colors.secondary,
      fontWeight: '600',
    },
    disabled: {
      opacity: 0.5,
    },
});

export default styles;
