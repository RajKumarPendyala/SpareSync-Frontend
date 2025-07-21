import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../navigation/StackNavigator';
import styles from '../../styles/auth/TermsAndConditionsScreenStyle';

type Props = {
  navigation: StackNavigationProp<StackParamList, 'Terms'>;
};

const TermsAndConditionsScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/icons/partnest_logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Terms & Conditions</Text>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.text}>
          Welcome to SpareSync. By accessing or using our platform, you agree to the following terms:
        </Text>

        <Text style={styles.sectionTitle}>1. Account & Verification</Text>
        <Text style={styles.text}>
          All users must provide accurate personal information and complete the email verification process.
          Only one account is allowed per individual. Account misuse may lead to suspension.
        </Text>

        <Text style={styles.sectionTitle}>2. Orders & Transactions</Text>
        <Text style={styles.text}>
          SpareSync facilitates the purchase of genuine spare parts. Once an order is placed and confirmed,
          it cannot be cancelled unless explicitly permitted by the seller. Payments are processed securely
          via integrated gateways.
        </Text>

        <Text style={styles.sectionTitle}>3. Reviews & Ratings</Text>
        <Text style={styles.text}>
          Users can only review products they have purchased. Abusive, false, or spammy content may be removed.
        </Text>

        <Text style={styles.sectionTitle}>4. Intellectual Property</Text>
        <Text style={styles.text}>
          All logos, trademarks, and content are owned by SpareSync or its licensors. Unauthorized use is prohibited.
        </Text>

        <Text style={styles.sectionTitle}>5. Limitation of Liability</Text>
        <Text style={styles.text}>
          SpareSync is not responsible for delays, inaccuracies, or damages caused by suppliers or third-party services.
        </Text>

        <Text style={styles.sectionTitle}>6. Privacy & Security</Text>
        <Text style={styles.text}>
          We use advanced encryption, JWT authentication, and data validation to protect your personal data.
          Please refer to our Privacy Policy for full details.
        </Text>

        <Text style={styles.sectionTitle}>7. Updates to Terms</Text>
        <Text style={styles.text}>
          SpareSync reserves the right to update these terms at any time. Continued use of the platform implies acceptance of the changes.
        </Text>

        <Text style={styles.text}>
          By signing up, you acknowledge that you’ve read and agree to these terms.
        </Text>
      </ScrollView>

      <TouchableOpacity style={styles.acceptBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.acceptText}>Accept & Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TermsAndConditionsScreen;
