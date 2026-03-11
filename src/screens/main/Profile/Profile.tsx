import React from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import Colors from '../../../utils/Colors.util';
import Header from '../../../component/Header';
import { logout } from '../../../store/slice/auth.slice';

const Profile = () => {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <ScreenWrapper backgroundColor={Colors.BACKGROUND} header={<Header title="Profile" showBack={false} />}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.DARK_BG} />
            <View style={styles.container}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
                    <AppText size={16} weight="700" color={Colors.WHITE}>
                        Logout
                    </AppText>
                </TouchableOpacity>
            </View>
        </ScreenWrapper>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    logoutButton: {
        backgroundColor: Colors.RED,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
});
