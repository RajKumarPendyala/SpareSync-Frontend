import { StyleSheet } from 'react-native';
import Colors from '../../context/colors';


const styles = StyleSheet.create({
    container: { padding: 20 },
    avatar: { width: 110, height: 110, borderRadius: 55, alignSelf: 'center', marginBottom: 10, borderWidth: 2, borderColor: Colors.inputContainerBD },
    uploadText: { textAlign: 'center', color: Colors.primary, marginBottom: 20 },
    input: {
      borderBottomWidth: 1,
      borderColor: Colors.inputContainerBD,
      marginBottom: 15,
      paddingVertical: 8,
      paddingHorizontal: 10,
    },
    email: {
      borderBottomWidth: 1,
      borderColor: '#D1D5DB',
      marginBottom: 15,
      paddingVertical: 8,
      paddingHorizontal: 10,
      color:'rgba(0,0,0,0.38)',
      backgroundColor: '#E5E7EB',
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
    },
    changePassword: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 25,
      justifyContent: 'center',
    },
    changePasswordText: {
      marginLeft: 8,
      color: '#000',
      fontSize: 16,
    },
    header: {
      alignItems: 'flex-end',
      paddingHorizontal: 10,
      paddingTop: 15,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.2)',
      padding: 20,
    },
    dropdown: {
      backgroundColor: Colors.primaryButtonBG,
      padding: 13,
      borderRadius: 12,
      width: 120,
    },
    dropdownItem: {
      fontSize: 16,
      marginVertical: 5,
      color: Colors.primary,
    },
  });

export default styles;
