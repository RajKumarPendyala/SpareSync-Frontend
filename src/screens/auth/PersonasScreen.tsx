import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../navigation/StackNavigator';
import Colors from '../../context/colors';

const { width } = Dimensions.get('window');

type PersonasScreenNavigationProp = StackNavigationProp<StackParamList, 'Personas'>;

interface Props {
  navigation: PersonasScreenNavigationProp;
}

const PersonasScreen: React.FC<Props> = ({ navigation }) => {

  const partnest_logo = require('../../assets/icons/partnest_logo.png');

  return (
    <View style={styles.container}>
      <Image source={partnest_logo} style={styles.logo} resizeMode="contain" />

      <TouchableOpacity style={styles.sellerButton} onPress={ () => navigation.navigate('Register', { role1 : 'seller' })}>
        <Text style={styles.sellerText}>I am a Seller</Text>
      </TouchableOpacity>

      <Text style={styles.option}>OR</Text>

      <TouchableOpacity style={styles.buyerButton} onPress={ () => navigation.navigate('Register', { role1 : 'buyer' })}>
        <Text style={styles.buyerText}>I am a Buyer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 70,
    backgroundColor: Colors.background,
  },
    logo: {
    height: width * 0.6,
    width: width * 0.6,
    marginBottom: 80,
  },
  sellerButton: {
    width: width * 0.85,
    height: 45,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: '#e6f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  sellerText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  buyerButton: {
    width: width * 0.85,
    height: 45,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.secondary,
    backgroundColor: Colors.secondaryButtonBG,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  buyerText: {
    color: Colors.secondary,
    fontWeight: '600',
  },
  option: {
    fontWeight: '300',
  },
});

export default PersonasScreen;
