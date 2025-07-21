import { StyleSheet } from 'react-native';
import Colors from '../../context/colors';


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      paddingTop: 30,
      paddingHorizontal: 16,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    chatItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.inputContainerBG,
      padding: 14,
      borderRadius: 12,
      marginBottom: 8,
      elevation: 1,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 24,
      marginRight: 15,
    },
    chatInfo: {
      flex: 1,
    },
    name: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 4,
    },
    message: {
      fontSize: 14,
      color: Colors.icon,
    },
    date: {
      color: Colors.icon,
      alignSelf: 'flex-start',
      textAlignVertical: 'top',
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 16,
      color: Colors.black,
    },
  });

export default styles;
