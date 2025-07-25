import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/common/HomeScreen';
import CartScreen from '../screens/buyer/BuyerCartScreen';
import ChatScreen from '../screens/common/ChatScreen';
import OrderScreen from '../screens/common/OrderScreen';
import { RouteProp } from '@react-navigation/native';
import React from 'react';
import Colors from '../context/colors';


export type BuyerTabParamList = {
  Home: undefined;
  Chat: undefined;
  Cart: undefined;
  Order: undefined;
};

const Tab = createBottomTabNavigator<BuyerTabParamList>();

const getTabBarIcon =
  (route: RouteProp<BuyerTabParamList, keyof BuyerTabParamList>) =>
  ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
    let iconName = '';

    switch (route.name) {
      case 'Home':
        iconName = focused ? 'home' : 'home-outline';
        break;
      case 'Cart':
        iconName = focused ? 'cart' : 'cart-outline';
        break;
      case 'Chat':
        iconName = focused ? 'chat' : 'chat-outline';
        break;
      case 'Order':
        iconName = focused ? 'clipboard-text' : 'clipboard-text-outline';
        break;
    }

    return <Icon name={iconName} size={size} color={color} />;
  };

const BuyerTabNav: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: Colors.background,
        headerTitleStyle: {
            fontWeight: '400',
        },
        tabBarIcon: getTabBarIcon(route),
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.icon,
      })}
      initialRouteName="Home"
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Cart" component={CartScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Order" component={OrderScreen} options={{ headerShown: false }}/>
    </Tab.Navigator>

  );
};

export default BuyerTabNav;
