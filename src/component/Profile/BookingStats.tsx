import React from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AppText from '../common/AppText';
import colors from '../../utils/colors';
import { Arrow } from '../../assets/svg';
import BookingStatCard, { BookingStatData } from './BookingStatCard';
import { BOOKING_STATS_DATA } from '../../data/bookingStats.data';

interface BookingStatsProps {
    allCount: number;
    upcomingCount: number;
    completedCount: number;
    cancelledCount: number;
}

const BookingStats: React.FC<BookingStatsProps> = (counts) => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();

    const statsList: BookingStatData[] = BOOKING_STATS_DATA.map((item) => {
        const Icon = item.IconComponent;
        return {
            id: item.id,
            title: t(item.titleKey) || item.fallbackTitle,
            count: counts[item.countKey] || 0,
            bgColor: item.bgColor,
            icon: <Icon width={scale(24)} height={scale(24)} />,
            onPress: () => navigation.navigate('Bookings'),
        };
    });

    return (
        <View style={styles.cardContainer}>
            {/* Card Header Row */}
            <View style={styles.headerRow}>
                <AppText size={17} weight="800" color={colors.SLATE_DARK}>
                    {t('booking_stats') || 'Booking Stats'}
                </AppText>

                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('Bookings')}
                    style={styles.viewAllButton}
                >
                    <AppText size={13} weight="600" color="#1D4ED8" style={{ marginRight: scale(4) }}>
                        {t('view_all_bookings') || 'View All Bookings'}
                    </AppText>
                    <Arrow
                        width={scale(13)}
                        height={scale(13)}
                        style={{ transform: [{ rotate: '180deg' }] }}
                        fill="#1D4ED8"
                    />
                </TouchableOpacity>
            </View>

            {/* Dynamic FlatList Component */}
            <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
                data={statsList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <BookingStatCard data={item} />}
            />
        </View>
    );
};

export default BookingStats;

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: colors.WHITE,
        borderRadius: scale(24),
        paddingHorizontal: scale(18),
        paddingTop: verticalScale(18),
        paddingBottom: verticalScale(20),
        borderWidth: 1,
        borderColor: colors.BORDER_GREY,
        marginBottom: verticalScale(18),
        shadowColor: colors.BLACK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 3,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: verticalScale(16),
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scrollContainer: {
        flexDirection: 'row',
        columnGap: scale(10),
        paddingRight: scale(4),
    },
});
