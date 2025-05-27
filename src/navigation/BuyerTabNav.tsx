import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/buyer/BuyerHomeScreen';
import CartScreen from '../screens/buyer/CartScreen';
import ChatScreen from '../screens/buyer/ChatScreen';
import OrderScreen from '../screens/buyer/OrderScreen';
import Colors from '../contexts/colors';


export type BuyerTabParamList = {
  Home: undefined;
  Chat: undefined;
  Cart: undefined;
  Order: undefined;
};

const Tab = createBottomTabNavigator<BuyerTabParamList>();

const BuyerTabNav: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.background,
        headerTitleStyle: {
            fontWeight: '400',
        },
      }}
      initialRouteName={
        'Home'
      }
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Order" component={OrderScreen} />
    </Tab.Navigator>

  );

};

export default BuyerTabNav;
