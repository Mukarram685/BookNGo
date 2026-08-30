import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import Home from '../screens/main/Home/Home';
import SearchResults from '../screens/main/SearchResults/SearchResults';
import SeatSelection from '../screens/main/SeatSelection/SeatSelection';
import PassengerDetail from '../screens/main/PassengerDetail/PassengerDetail';
import BookingReview from '../screens/main/BookingDetails/BookingReview';
import BookingSuccess from '../screens/main/BookingDetails/BookingSuccess';
import BookingDetails from '../screens/main/BookingDetails/BookingDetails';
import UpdateProfile from '../screens/main/Profile/UpdateProfile';
import Language from '../screens/main/Profile/Language';
import PrivacyPolicy from '../screens/main/Profile/PrivacyPolicy';
import TermsConditions from '../screens/main/Profile/TermsConditions';
import GetHelp from '../screens/main/Profile/GetHelp';
import Notifications from '../screens/main/Notification/Notifications';

import Profile from '../screens/main/Profile/Profile';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="BottomTabs" component={BottomTabNavigator} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="SearchResults" component={SearchResults} />
            <Stack.Screen name="SeatSelection" component={SeatSelection} />
            <Stack.Screen name="PassengerDetails" component={PassengerDetail} />
            <Stack.Screen name="BookingReview" component={BookingReview} />
            <Stack.Screen name="BookingSuccess" component={BookingSuccess} />
            <Stack.Screen name="BookingDetails" component={BookingDetails} />
            <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
            <Stack.Screen name="Language" component={Language} />
            <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
            <Stack.Screen name="TermsConditions" component={TermsConditions} />
            <Stack.Screen name="GetHelp" component={GetHelp} />
            <Stack.Screen name="Notifications" component={Notifications} />
        </Stack.Navigator>
    );
};

export default MainNavigator;
