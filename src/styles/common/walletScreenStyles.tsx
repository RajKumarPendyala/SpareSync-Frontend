import { StyleSheet } from 'react-native';
import Colors from '../../context/colors';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      padding: 20,
    },
    headerText: {
      fontSize: 30,
      fontWeight: 800,
      marginTop: 50,
      alignSelf: 'center',
      color: 'gray',
    },
    image: {
      width: 150,
      height: 150,
      alignSelf: 'center',
      marginBottom: 20,
      marginTop: 20,
    },
    balanceCard: {
      backgroundColor: Colors.primaryButtonBG,
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
      marginBottom: 30,
      elevation: 3,
    },
    balanceLabel: {
      fontSize: 16,
      fontWeight: 500,
      color: Colors.black,
      marginBottom: 6,
    },
    balanceValue: {
      fontSize: 30,
      fontWeight: 'bold',
      color: Colors.green,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 30,
    },
    input: {
      flex: 1,
      backgroundColor: Colors.inputContainerBG,
      borderWidth: 1,
      borderColor: Colors.inputContainerBD,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 10,
      fontSize: 16,
    },
    quickLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: Colors.black,
      marginBottom: 25,
      marginLeft: 20,
    },
    quickGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      justifyContent: 'center',
    },
    quickButtonStyle: {
        marginRight: 10,
        marginBottom: 10,
    },
    addButtonStyle: {
        marginLeft: 10,
    },
});

export default styles;
