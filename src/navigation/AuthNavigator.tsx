import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Signup from '../screens/auth/Signup';
import Signin from '../screens/auth/Signin';
import ForgotPassword from '../screens/auth/ForgotPassword';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Signin" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Signin" component={Signin} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </Stack.Navigator>
    );
};

export default AuthNavigator;
