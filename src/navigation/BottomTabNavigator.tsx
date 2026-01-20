import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Test from '../screens/main/Test';
import Home from '../screens/main/Home/Home';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Test" component={Test} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
