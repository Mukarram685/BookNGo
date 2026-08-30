import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AppText from '../common/AppText';
import colors from '../../constants/colors';
import {
    Arrow,
    Ticket as TicketIcon,
    Clock as ClockIcon,
    CheckCircle as CheckCircleIcon,
    CrossCircle as CrossCircleIcon,
} from '../../assets/svg';

interface BookingStatsProps {
    allCount: number;
    upcomingCount: number;
    completedCount: number;
    cancelledCount: number;
}

const BookingStats: React.FC<BookingStatsProps> = ({
    allCount,
    upcomingCount,
    completedCount,
    cancelledCount,
}) => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <View style={styles.sectionHeaderRow}>
                <AppText size={16} weight="800" color={colors.SLATE_DARK}>
                    {t('my_bookings') || 'My Bookings'}
                </AppText>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('Bookings')}
                    style={styles.viewAllButton}
                >
                    <AppText size={12} weight="700" color={colors.BLUE_PRIMARY} style={{ marginRight: scale(3) }}>
                        {t('view_all') || 'View All'}
                    </AppText>
                    <Arrow
                        width={scale(12)}
                        height={scale(12)}
                        style={{ transform: [{ rotate: '180deg' }] }}
                        fill={colors.BLUE_PRIMARY}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.statsRow}>
                <TouchableOpacity
                    style={styles.statCard}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('Bookings')}
                >
                    <View style={[styles.statIconCircle, { backgroundColor: colors.GREEN_ALERT_BG }]}>
                        <TicketIcon width={scale(18)} height={scale(18)} />
                    </View>
                    <AppText size={17} weight="900" color={colors.SLATE_DARK} style={{ marginTop: verticalScale(6) }}>
                        {allCount}
                    </AppText>
                    <AppText size={11} weight="700" color={colors.SLATE_MUTED} style={{ marginTop: verticalScale(2) }}>
                        {t('stat_all_bookings') || 'All Bookings'}
                    </AppText>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.statCard}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('Bookings')}
                >
                    <View style={[styles.statIconCircle, { backgroundColor: colors.AMBER_LIGHT_BG }]}>
                        <ClockIcon width={scale(18)} height={scale(18)} />
                    </View>
                    <AppText size={17} weight="900" color={colors.SLATE_DARK} style={{ marginTop: verticalScale(6) }}>
                        {upcomingCount}
                    </AppText>
                    <AppText size={11} weight="700" color={colors.SLATE_MUTED} style={{ marginTop: verticalScale(2) }}>
                        {t('stat_upcoming') || 'Upcoming'}
                    </AppText>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.statCard}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('Bookings')}
                >
                    <View style={[styles.statIconCircle, { backgroundColor: colors.BLUE_SOFT_BG }]}>
                        <CheckCircleIcon width={scale(18)} height={scale(18)} />
                    </View>
                    <AppText size={17} weight="900" color={colors.SLATE_DARK} style={{ marginTop: verticalScale(6) }}>
                        {completedCount}
                    </AppText>
                    <AppText size={11} weight="700" color={colors.SLATE_MUTED} style={{ marginTop: verticalScale(2) }}>
                        {t('stat_completed') || 'Completed'}
                    </AppText>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.statCard}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('Bookings')}
                >
                    <View style={[styles.statIconCircle, { backgroundColor: colors.RED_LIGHT_BG }]}>
                        <CrossCircleIcon width={scale(18)} height={scale(18)} />
                    </View>
                    <AppText size={17} weight="900" color={colors.SLATE_DARK} style={{ marginTop: verticalScale(6) }}>
                        {cancelledCount}
                    </AppText>
                    <AppText size={11} weight="700" color={colors.SLATE_MUTED} style={{ marginTop: verticalScale(2) }}>
                        {t('stat_cancelled') || 'Cancelled'}
                    </AppText>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default BookingStats;

const styles = StyleSheet.create({
    container: {
        marginBottom: verticalScale(10),
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: verticalScale(12),
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        columnGap: scale(8),
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.WHITE,
        borderRadius: scale(16),
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(6),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.BORDER_GREY,
        shadowColor: colors.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 2,
    },
    statIconCircle: {
        width: scale(36),
        height: scale(36),
        borderRadius: scale(18),
        justifyContent: 'center',
        alignItems: 'center',
    },
});
