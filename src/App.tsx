import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, ViewStyle } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import StackNavigator from './navigation/StackNavigator';
import { SparePartsProvider } from './context/SparePartsContext';
import { ProfileProvider } from './context/ProfileContext';



const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <SparePartsProvider>
        <ProfileProvider>
          <NavigationContainer>
            <StackNavigator/>
          </NavigationContainer>
        </ProfileProvider>
      </SparePartsProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,
});

export default App;
