import { StyleSheet } from 'react-native';
import Colors from '../../context/colors';


const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: Colors.secondaryButtonBG,
    },
    inputContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 3,
    },
    input: {
      borderWidth: 1,
      borderColor: Colors.inputContainerBD,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 16,
      height: 45,
      backgroundColor: Colors.inputContainerBG,
      color: '#000',
    },
    textArea: {
      borderWidth: 1,
      borderColor: Colors.inputContainerBD,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 15,
      fontSize: 16,
      backgroundColor:  Colors.inputContainerBG,
      color: '#000',
      height: 100,
      textAlignVertical: 'top',
    },
    imageWrapper: {
      position: 'relative',
      marginRight: 10,
      overflow: 'visible',
      marginBottom: 30,
    },
    imagePreview: {
      width: 100,
      height: 100,
      borderRadius: 8,
    },
    removeIcon: {
      position: 'absolute',
      top: 2,
      right: 2,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#ff3333',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10,
    },
    removeIconText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      lineHeight: 20,
    },
    addImageButton: {
      width: 100,
      height: 100,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ccc',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors.inputContainerBG,
      marginBottom: 30,
    },
    addImageText: {
      fontSize: 32,
      color: '#999',
    },
    dropdown: {
      borderWidth: 1,
      height: 45,
      borderColor: Colors.inputContainerBD,
      padding: 10,
      marginBottom: 15,
      borderRadius: 5,
      backgroundColor: Colors.inputContainerBG,
    },
    dropdownText: {
      fontSize: 16,
    },
    dropdownList: {
      borderWidth: 1,
      borderColor: Colors.inputContainerBD,
      borderRadius: 5,
      marginBottom: 10,
      backgroundColor: Colors.inputContainerBG,
    },
    dropdownItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderColor: Colors.inputContainerBD,
    },
    dropdownItemText: {
      fontSize: 15,
    },
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
    },
    halfInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: Colors.inputContainerBD,
      borderRadius: 8,
      width: 170,
      padding: 10,
      paddingHorizontal: 12,
      backgroundColor: Colors.inputContainerBG,
      height: 45,
    },
  });

export default styles;
