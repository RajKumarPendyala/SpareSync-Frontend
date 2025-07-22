import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../../context/colors';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        paddingTop: 60,
        backgroundColor: Colors.background,
    },
    input: {
        flex: 1,
        height: 45,
        fontSize: 16,
    },
    eyeIcon: {
        marginLeft: 'auto',
    },
    icon: {
        marginRight: 6,
    },
    inputWrapper1: {
        flexDirection: 'row',
        alignItems: 'center',
        width: width * 0.85,
        borderWidth: 1,
        borderColor: Colors.inputContainerBD,
        backgroundColor: Colors.inputContainerBG,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 30,
    },
    changeButton: {
        width: width * 0.85,
        height: 45,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.secondary,
        backgroundColor: Colors.secondaryButtonBG,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    changeText: {
        color: Colors.secondary,
        fontWeight: '600',
    },
    errorText: {
        color: Colors.secondary,
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 5,
    },
});

export default styles;
