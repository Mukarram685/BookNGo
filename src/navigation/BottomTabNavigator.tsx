import React from 'react';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, Platform, StyleSheet, LayoutAnimation, UIManager, Animated } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import AppText from '../component/common/AppText';
import Home from '../screens/main/Home/Home';
import Bookings from '../screens/main/Bookings/Bookings';
import Profile from '../screens/main/Profile/Profile';
import { Home as HomeIcon, Bookings as BookingsIcon, All as AllIcon, Profile as ProfileIcon } from '../assets/svg';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Tab = createBottomTabNavigator();

const ACTIVE_BG_COLOR = '#FFFFFF';
const DARK_NAV_BG = '#161622';
const INACTIVE_ICON_COLOR = 'rgba(255, 255, 255, 0.55)';
const SHADOW_COLOR = '#000000';
const COLOR_TRANSPARENT = 'transparent';

const getTabIcon = (routeName: string) => {
    switch (routeName) {
        case 'Home':
            return HomeIcon;
        case 'Bookings':
        case 'Booking':
            return BookingsIcon;
        case 'All':
            return AllIcon;
        case 'Profile':
            return ProfileIcon;
        default:
            return AllIcon;
    }
};

interface TabButtonProps {
    isFocused: boolean;
    label: string;
    IconComponent: React.ComponentType<{ width: number; height: number; color: string }> | null;
    onPress: () => void;
    onLongPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({
    isFocused,
    label,
    IconComponent,
    onPress,
    onLongPress,
}) => {
    const scaleValue = React.useRef(new Animated.Value(isFocused ? 1.08 : 1)).current;

    React.useEffect(() => {
        Animated.spring(scaleValue, {
            toValue: isFocused ? 1.08 : 1,
            useNativeDriver: true,
            friction: 9, // Higher friction slows down spring bounce
            tension: 25, // Lower tension slows down initial scale-up speed
        }).start();
    }, [isFocused, scaleValue]);

    return (
        <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={0.8}
            style={[
                styles.tabItem,
                isFocused ? styles.activeTabItem : styles.inactiveTabItem,
            ]}
        >
            <Animated.View style={[styles.tabContent, { transform: [{ scale: scaleValue }] }]}>
                {IconComponent && (
                    <IconComponent
                        width={scale(isFocused ? 18 : 20)}
                        height={scale(isFocused ? 18 : 20)}
                        color={isFocused ? DARK_NAV_BG : INACTIVE_ICON_COLOR}
                    />
                )}
                {isFocused && (
                    <AppText
                        size={13}
                        weight="700"
                        color={DARK_NAV_BG}
                        style={styles.tabLabel}
                    >
                        {label}
                    </AppText>
                )}
            </Animated.View>
        </TouchableOpacity>
    );
};

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    return (
        <View style={styles.tabBarContainer}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;

                const label = options.tabBarLabel !== undefined
                    ? (options.tabBarLabel as string)
                    : options.title !== undefined
                    ? options.title
                    : route.name;

                const IconComponent = getTabIcon(route.name);

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        LayoutAnimation.configureNext({
                            duration: 500, // Custom duration (500ms) to slow down Layout transition
                            create: {
                                type: LayoutAnimation.Types.easeInEaseOut,
                                property: LayoutAnimation.Properties.opacity,
                            },
                            update: {
                                type: LayoutAnimation.Types.easeInEaseOut,
                            },
                        });
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TabButton
                        key={route.key}
                        isFocused={isFocused}
                        label={label}
                        IconComponent={IconComponent}
                        onPress={onPress}
                        onLongPress={onLongPress}
                    />
                );
            })}
        </View>
    );
};

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                animation: 'fade',
                headerShown: false,
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{ tabBarLabel: 'Home' }}
            />
            <Tab.Screen
                name="Bookings"
                component={Bookings}
                options={{ tabBarLabel: 'Booking' }}
            />
            <Tab.Screen
                name="All"
                component={Profile}
                options={{ tabBarLabel: 'All' }}
            />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    activeTabItem: {
        backgroundColor: ACTIVE_BG_COLOR,
        elevation: 3,
        paddingHorizontal: scale(18),
        shadowColor: SHADOW_COLOR,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    inactiveTabItem: {
        backgroundColor: COLOR_TRANSPARENT,
        paddingHorizontal: 0,
        width: scale(44),
    },
    tabBarContainer: {
        alignItems: 'center',
        backgroundColor: DARK_NAV_BG,
        borderRadius: scale(36),
        bottom: Platform.OS === 'ios' ? verticalScale(24) : verticalScale(16),
        elevation: 10,
        flexDirection: 'row',
        height: scale(62),
        justifyContent: 'space-around',
        left: scale(20),
        paddingHorizontal: scale(10),
        position: 'absolute',
        right: scale(20),
        shadowColor: SHADOW_COLOR,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
    },
    tabContent: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    tabItem: {
        alignItems: 'center',
        borderRadius: scale(24),
        flexDirection: 'row',
        height: scale(44),
        justifyContent: 'center',
    },
    tabLabel: {
        marginLeft: scale(8),
    },
});

export default BottomTabNavigator;