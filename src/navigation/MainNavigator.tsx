import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import Home from '../screens/main/Home/Home';
import SearchResults from '../screens/main/SearchResults/SearchResults';
import SeatSelection from '../screens/main/SeatSelection/SeatSelection';
import PassengerDetail from '../screens/main/PassengerDetail/PassengerDetail';
import BookingReview from '../screens/main/BookingDetails/BookingReview';
import BookingSuccess from '../screens/main/BookingDetails/BookingSuccess';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="BottomTabs" component={BottomTabNavigator} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="SearchResults" component={SearchResults} />
            <Stack.Screen name="SeatSelection" component={SeatSelection} />
            <Stack.Screen name="PassengerDetails" component={PassengerDetail} />
            <Stack.Screen name="BookingReview" component={BookingReview} />
            <Stack.Screen name="BookingSuccess" component={BookingSuccess} />
        </Stack.Navigator>
    );
};

export default MainNavigator;
