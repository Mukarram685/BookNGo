import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import DatePicker from '../screens/main/DatePicker';
import NetworkStatus from '../screens/main/NetworkStatus';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="BottomTabs" component={BottomTabNavigator} />
            <Stack.Screen name="DatePicker" component={DatePicker} />
            <Stack.Screen name="NetworkStatus" component={NetworkStatus} />
        </Stack.Navigator>
    );
};

export default MainNavigator;
