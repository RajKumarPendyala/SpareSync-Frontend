import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: '#ffffff',
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#2B7A78',
      marginBottom: 20,
      textAlign: 'center',
    },
    sectionSpacing: {
      marginTop: 30,
    },
    dropdownWrapper: {
      marginBottom: 12,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 4,
      color: '#333',
    },
    dropdown: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      justifyContent: 'center',
    },
    dropdownText: {
      fontSize: 16,
      color: '#333',
    },
    dropdownList: {
      maxHeight: 150,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      marginTop: 4,
      backgroundColor: '#f9f9f9',
    },
    dropdownItem: {
      paddingVertical: 10,
      paddingHorizontal: 12,
    },
    dropdownItemText: {
      fontSize: 16,
      color: '#444',
    },
    buttonGroup: {
      marginVertical: 10,
    },
    button: {
      backgroundColor: '#2B7A78',
      paddingVertical: 12,
      borderRadius: 10,
      marginVertical: 5,
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 16,
      textAlign: 'center',
      fontWeight: '600',
    },
    secondaryBtn: {
      backgroundColor: '#3AAFA9',
      paddingVertical: 12,
      borderRadius: 10,
      marginTop: 5,
    },
    secondaryBtnText: {
      color: '#ffffff',
      fontSize: 16,
      textAlign: 'center',
      fontWeight: '600',
    },
    cardsContainer: {
      marginTop: 25,
      gap: 20,
    },
    card: {
      backgroundColor: '#F1F1F1',
      padding: 18,
      borderRadius: 12,
      elevation: 3,
      shadowColor: '#222222',
      shadowOpacity: 0.1,
      shadowOffset: { width: 1, height: 2 },
    },
    cardLabel: {
      fontSize: 14,
      color: '#555',
      marginBottom: 6,
    },
    cardValue: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#2B7A78',
    },
    noDataText: {
      textAlign: 'center',
      marginTop: 30,
      fontSize: 16,
      color: '#555',
    },
  });

export default styles;
