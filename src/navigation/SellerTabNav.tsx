import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import StoreScreen from '../screens/common/HomeScreen';
import ProfileScreen from '../screens/common/ProfileScreen';
import ChatScreen from '../screens/common/ChatScreen';
import { RouteProp } from '@react-navigation/native';
import React from 'react';
import Colors from '../context/colors';


export type SellerTabParamList = {
  Store: undefined;
  Chat: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<SellerTabParamList>();

const getTabBarIcon =
  (route: RouteProp<SellerTabParamList, keyof SellerTabParamList>) =>
  ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
    let iconName = '';

    switch (route.name) {
      case 'Store':
        iconName = focused ? 'store' : 'store-outline';
        break;
      case 'Chat':
        iconName = focused ? 'chat' : 'chat-outline';
        break;
      case 'Profile':
        iconName = focused ? 'account' : 'account-outline';
        break;
    }

    return <Icon name={iconName} size={size} color={color} />;
  };

const SellerTabNav: React.FC = () => {
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
      initialRouteName="Store"
    >
      <Tab.Screen name="Store" component={StoreScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }}/>
    </Tab.Navigator>

  );
};

export default SellerTabNav;
