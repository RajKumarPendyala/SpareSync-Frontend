import {
  View,
  Text,
  Image,
  Dimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../navigation/StackNavigator';
import styles from '../../styles/auth/personasScreenStyle';
import PrimaryButton from '../../components/primaryButton';
import SecondaryButton from '../../components/secondaryButton';

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

      <PrimaryButton
        title="I am a Seller"
        width={width * 0.85}
        height={45}
        borderRadius={8}
        onPress={() => navigation.navigate('Register', { role1 : 'seller' })}
        viewStyle={styles.sellerButton}
      />

      <Text style={styles.option}>OR</Text>

      <SecondaryButton
        title="I am a Buyer"
        width={width * 0.85}
        height={45}
        borderRadius={8}
        onPress={() => navigation.navigate('Register', { role1 : 'buyer' })}
        viewStyle={styles.buyerButton}
      />
    </View>
  );
};

export default PersonasScreen;
