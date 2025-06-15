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
import ChangePasswordScreen from '../screens/common/ChangePasswordScreen';
import ProductDetailsScreen from '../screens/common/ProductDetailsScreen';
import ChatDetailScreen from '../screens/common/ChatDetailScreen';
import BuyerOrderDetailScreen from '../screens/common/OrderDetailScreen';
import BuyerReviewScreen from '../screens/buyer/BuyerReviewScreen';
import SellerAddProductScreen from '../screens/seller/SellerAddProductScreen';
import EditProductScreen from '../screens/common/EditProductScreen';
import SellerAlertScreen from '../screens/seller/SellerAlertScreen';
import AdminUserDetailScreen from '../screens/admin/AdminUserDetailScreen';
import Colors from '../context/colors';
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
    SpareParts: {gadgetType: string, name: string, roleName: string | null};
    Wallet: undefined;
    Profile: undefined;
    ChangePassword: undefined;
    BuyerProductDetails: { partId: string, roleName: string | null };
    ChatDetail: { conversationId: string };
    OrderDetailScreen: { OrderObject: any, role: string | null};
    ReviewScreen: {sparePartId: string};
    EditProductScreen: {sparePartId: string};
    AddProductScreen: undefined;
    AlertScreen: { roleName: string | null};
    UserDetailScreen: { userObject: any };
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
            <Stack.Screen name="BuyerProductDetails" component={ProductDetailsScreen}  options={{ headerShown: false }}/>
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
            <Stack.Screen name="PasswordReset" component={PasswordResetScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="BuyerTabNav" component={BuyerTabNav} options={{ headerShown: false }}  />
            <Stack.Screen name="AdminTabNav" component={AdminTabNav} options={{ headerShown: false }}  />
            <Stack.Screen name="SellerTabNav" component={SellerTabNav} options={{ headerShown: false }} />
            <Stack.Screen name="OrderDetailScreen" component={BuyerOrderDetailScreen} options={{headerShown: false}} />
            <Stack.Screen name="ChatDetail" component={ChatDetailScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ReviewScreen" component={BuyerReviewScreen} options={{ headerShown: true, title: 'Review' }} />
            <Stack.Screen name="AddProductScreen" component={SellerAddProductScreen} options={{ headerShown: false}}/>
            <Stack.Screen name="EditProductScreen" component={EditProductScreen} options={{ headerShown: true, title: 'Edit Spare Part'}}/>
            <Stack.Screen name="AlertScreen" component={SellerAlertScreen} options={{ headerShown: true, title: 'Low Stock Products'}}/>
            <Stack.Screen name="UserDetailScreen" component={AdminUserDetailScreen} options={{ headerShown: true, title: 'User Details'}}/>
            <Stack.Screen name="SpareParts"
                component={SparePartsScreen}
                options={({ route }) => ({
                    headerShown: true,
                    title: route.params?.name ?? 'Seller Dashboard',
                })}
            />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Wallet" component={WalletScreen} />
        </Stack.Navigator>
    );
};

export default StackNavigator;
