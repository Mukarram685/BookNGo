import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Map from '../screens/main/Map';
import Test from '../screens/main/Test';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Map" component={Map} />
            <Tab.Screen name="Test" component={Test} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
