import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../navigation/StackNavigator';
import styles from '../../styles/auth/PersonasScreenStyle';


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

export default PersonasScreen;
