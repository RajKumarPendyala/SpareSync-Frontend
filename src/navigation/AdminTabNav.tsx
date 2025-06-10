import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import StoreScreen from '../screens/common/HomeScreen';
import AdminFinancialScreen from '../screens/admin/AdminFinancialScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import OrderScreen from '../screens/common/OrderScreen';
import { RouteProp } from '@react-navigation/native';
import React from 'react';
import Colors from '../context/colors';


export type AdminTabParamList = {
  Store: undefined;
  Users: undefined;
  Financial: undefined;
  Orders: undefined;
};

const Tab = createBottomTabNavigator<AdminTabParamList>();

const getTabBarIcon =
  (route: RouteProp<AdminTabParamList, keyof AdminTabParamList>) =>
  ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
    let iconName = '';

    switch (route.name) {
      case 'Financial':
        iconName = focused ? 'finance' : 'finance';
        break;
      case 'Store':
        iconName = focused ? 'store' : 'store-outline';
        break;
      case 'Orders':
        iconName = focused ? 'clipboard-text' : 'clipboard-text-outline';
        break;
      case 'Users':
        iconName = focused ? 'account-multiple' : 'account-multiple-outline';
        break;
    }

    return <Icon name={iconName} size={size} color={color} />;
  };

const AdminTabNav: React.FC = () => {
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
      initialRouteName="Financial"
    >
      <Tab.Screen name="Financial" component={AdminFinancialScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Store" component={StoreScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Orders" component={OrderScreen} options={{ headerShown: false }}/>
      <Tab.Screen name="Users" component={AdminUsersScreen} options={{ headerShown: false }}/>
    </Tab.Navigator>

  );
};

export default AdminTabNav;
