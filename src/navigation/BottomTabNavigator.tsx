import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Platform } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import Home from '../screens/main/Home/Home';
import Bookings from '../screens/main/Bookings/Bookings';
import Profile from '../screens/main/Profile/Profile';
import { Home as HomeIcon, Bookings as BookingsIcon, Profile as ProfileIcon } from '../assets/svg';
import Colors from '../utils/Colors.util';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,

                tabBarStyle: {
                    backgroundColor: Colors.INPUT_BG,
                    borderTopWidth: 0,
                    height: Platform.OS === 'ios' ? verticalScale(80) : verticalScale(65),
                    paddingTop: verticalScale(10),
                },
                tabBarActiveTintColor: Colors.PRIMARY,
                tabBarInactiveTintColor: Colors.TEXT_GREY,
                tabBarIcon: ({ focused, color }) => {
                    let Icon;
                    if (route.name === 'Home') {
                        Icon = HomeIcon;
                    } else if (route.name === 'Bookings') {
                        Icon = BookingsIcon;
                    } else if (route.name === 'Profile') {
                        Icon = ProfileIcon;
                    }

                    return (
                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>

                            <View
                                style={{
                                    height: 6,
                                    width: 6,
                                    borderRadius: 3,
                                    backgroundColor: focused
                                        ? Colors.PRIMARY
                                        : 'transparent',
                                    marginBottom: verticalScale(4),
                                }}
                            />

                            {Icon && (
                                <Icon
                                    width={scale(24)}
                                    height={scale(24)}
                                    color={color}
                                />
                            )}

                        </View>
                    );
                },
            })}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Bookings" component={Bookings} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;