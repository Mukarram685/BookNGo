import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import Colors from '../../../utils/Colors.util';
import { useSearchBuses } from '../../../hooks/useSearchBuses';
import HomeSearch from './HomeSearch';

const Home = () => {
    const { t } = useTranslation();
    const { mutate: search, isPending } = useSearchBuses();

    return (
        <ScreenWrapper backgroundColor={Colors.DARK_BG} isLoading={isPending}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.DARK_BG} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                <View style={styles.header}>
                    <AppText size={24} weight="700" color={Colors.WHITE}>
                        Where to next?
                    </AppText>
                    <AppText size={14} color={Colors.TEXT_GREY}>
                        Find the best bus rides for your journey.
                    </AppText>
                </View>

                <HomeSearch onSearch={search} />

            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: verticalScale(20),
    },
    header: {
        paddingHorizontal: scale(20),
        paddingTop: verticalScale(20),
        marginBottom: verticalScale(10),
    },
});

export default Home;
