import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import PersonasScreen from '../screens/auth/PersonasScreen';
import OnBoardingScreen from '../screens/auth/OnBoardingScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import PasswordResetScreen from '../screens/auth/PasswordResetScreen';
import TermsAndConditionsScreen from '../screens/auth/TermsAndConditionsScreen';
import SparePartsScreen from '../screens/common/SparePartsScreen';
import ProfileScreen from '../screens/common/ProfileScreen';
import WalletScreen from '../screens/common/WalletScreen';
import Colors from '../contexts/colors';
import BuyerTabNav from './BuyerTabNav';
import SellerTabNav from './SellerTabNav';
import AdminTabNav from './AdminTabNav';

export type StackParamList = {
    OnBoarding: undefined;
    Login: undefined;
    Register: { role1: string};
    Personas: undefined;
    ForgotPassword: undefined;
    BuyerTabNav: undefined;
    SellerTabNav: undefined;
    AdminTabNav: undefined;
    Terms: undefined;
    PasswordReset: { email: string};
    SpareParts: {gadgetType: string};
    Wallet: undefined;
    Profile: undefined;
};

const Stack = createStackNavigator<StackParamList>();


const StackNavigator: React.FC = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: Colors.primary },
                headerTintColor: Colors.background,
                headerTitleStyle: {
                    fontWeight: '400',
                },
            }}
            initialRouteName={
                'OnBoarding'
            }
        >
            <Stack.Screen name="OnBoarding" component={OnBoardingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Personas" component={PersonasScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Terms" component={TermsAndConditionsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="PasswordReset" component={PasswordResetScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="BuyerTabNav" component={BuyerTabNav} options={{ headerShown: false }}  />
            <Stack.Screen name="AdminTabNav" component={AdminTabNav} options={{ headerShown: false }}  />
            <Stack.Screen name="SellerTabNav" component={SellerTabNav} options={{ headerShown: false }} />
            <Stack.Screen name="SpareParts" component={SparePartsScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Wallet" component={WalletScreen} />
        </Stack.Navigator>
    );
};

export default StackNavigator;
