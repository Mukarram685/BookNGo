import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import Home from '../screens/main/Home/Home';
import SearchResults from '../screens/main/SearchResults/SearchResults';
import SeatSelection from '../screens/main/SeatSelection/SeatSelection';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="BottomTabs" component={BottomTabNavigator} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="SearchResults" component={SearchResults} />
            <Stack.Screen name="SeatSelection" component={SeatSelection} />
        </Stack.Navigator>
    );
};

export default MainNavigator;
