import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import Colors from '../../../utils/Colors.util';
import Header from '../../../component/Header';

const Bookings = () => {
    return (
        <ScreenWrapper backgroundColor={Colors.BACKGROUND} header={<Header title="My Bookings" showBack={false} />}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.DARK_BG} />
            <View style={styles.container}>
                <AppText size={16} color={Colors.WHITE} align="center">
                    No bookings found.
                </AppText>
            </View>
        </ScreenWrapper>
    );
};

export default Bookings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
