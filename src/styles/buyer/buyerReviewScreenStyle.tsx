import { StyleSheet } from 'react-native';
import Colors from '../../context/colors';


const styles = StyleSheet.create({
    container: {
      margin: 20,
      marginTop: 45,
      borderColor: Colors.inputContainerBD,
      padding: 16,
      borderWidth: 2,
      borderRadius: 8,
  },
    label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
    ratingContainer: { flexDirection: 'row', marginBottom: 15 },
    textInput: {
      borderWidth: 1,
      borderColor: Colors.inputContainerBD,
      borderRadius: 6,
      padding: 10,
      marginBottom: 20,
      textAlignVertical: 'top',
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 8,
      marginRight: 10,
    },
    uploadButton: {
      width: 80,
      height: 80,
      borderRadius: 8,
      borderWidth: 1,
      marginBottom: 30,
      borderColor: Colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default styles;
