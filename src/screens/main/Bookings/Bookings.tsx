import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import Colors from '../../../utils/Colors.util';
import Header from '../../../component/Header';

const Bookings = () => {
    const { t } = useTranslation();
    return (
        <ScreenWrapper backgroundColor={Colors.DARK_BG} header={<Header title={t('bookings_title')} showBack={false} />}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.DARK_BG} />
            <View style={styles.container}>
                <AppText size={16} color={Colors.WHITE} align="center">
                    {t('bookings_empty')}
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
