import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Signin from '../screens/auth/Signin';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Signin" component={Signin} />
        </Stack.Navigator>
    );
};

export default AuthNavigator;
