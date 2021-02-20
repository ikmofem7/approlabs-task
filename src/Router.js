import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen';
import ListScreen from './screens/ListScreen';
import RecordScreen from './screens/RecordScreen';
import PlayerScreen from './screens/PlayerScreen';

const Stack = createStackNavigator();

const RootStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={SplashScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen name="List" component={ListScreen} />
      <Stack.Screen
        name="Record"
        component={RecordScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Player"
        component={PlayerScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const RootNavigator = () => {
  return (
    <NavigationContainer>
      <RootStackNavigator />
    </NavigationContainer>
  );
};

export default RootNavigator;
