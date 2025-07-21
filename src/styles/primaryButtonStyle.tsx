import { StyleSheet } from 'react-native';
import Colors from '../context/colors';

const styles = StyleSheet.create({
    button: {
      backgroundColor: Colors.primaryButtonBG,
      borderWidth: 1,
      borderColor: Colors.primary,
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 10,
    },
    text: {
      color: Colors.primary,
      fontWeight: '600',
    },
    disabled: {
      opacity: 0.5,
    },
});

export default styles;
