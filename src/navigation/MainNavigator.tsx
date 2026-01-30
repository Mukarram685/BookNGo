import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import DatePicker from '../screens/main/DatePicker';
import NetworkStatus from '../component/common/NetworkStatus';
import Home from '../screens/main/Home/Home';

import SearchResults from '../screens/main/SearchResults/SearchResults';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="BottomTabs" component={BottomTabNavigator} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="SearchResults" component={SearchResults} />
            <Stack.Screen name="DatePicker" component={DatePicker} />
            <Stack.Screen name="NetworkStatus" component={NetworkStatus} />
        </Stack.Navigator>
    );
};

export default MainNavigator;
