import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import Header from '../../../component/Header';
import AppText from '../../../component/common/AppText';
import BookingCard, { BookingCardItem } from '../../../component/Booking/BookingCard';
import EmptyCard from '../../../component/common/EmptyCard';
import { scale, verticalScale } from 'react-native-size-matters';
import { useMyBookings } from '../../../hooks/useMyBookings';
import AppLoader from '../../../component/common/AppLoader';
import colors from '../../../utils/colors';
import {
    CalendarStat,
    CheckStat,
    CrossStat,
} from '../../../assets/svg';

type TabType = 'upcoming' | 'completed' | 'cancelled';

interface TabItem {
    id: TabType;
    titleKey: string;
    fallbackTitle: string;
    IconComponent: React.FC<any>;
}

const TABS: TabItem[] = [
    // { id: 'all', titleKey: 'filter_all', fallbackTitle: 'All', IconComponent: TicketStat },
    { id: 'upcoming', titleKey: 'stat_upcoming', fallbackTitle: 'Upcoming', IconComponent: CalendarStat },
    { id: 'completed', titleKey: 'stat_completed', fallbackTitle: 'Completed', IconComponent: CheckStat },
    { id: 'cancelled', titleKey: 'stat_cancelled', fallbackTitle: 'Cancelled', IconComponent: CrossStat },
];

const Bookings = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const { data, isLoading, refetch } = useMyBookings();
    const [activeTab, setActiveTab] = useState<TabType>('upcoming');

    const handleView = (booking: any) => {
        navigation.navigate('BookingDetails', { booking });
    };

    if (isLoading && !data) {
        return <AppLoader />;
    }

    const rawBookings = ((data as any)?.bookings as any[]) || [];

    const mappedBookings: BookingCardItem[] = rawBookings.map((b: any) => {
        const pnr = b.pnrNumber || (b._id ? `BNG-${b._id.slice(-6).toUpperCase()}` : 'BNG-784512');
        const seatsArr = (b.seats || []).map((s: any) => (typeof s === 'object' ? s.seatNumber : s));
        const departureDateObj = b.schedule?.departureDate ? new Date(b.schedule.departureDate) : new Date();
        const dateFormatted = departureDateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const dayOfWeekFormatted = departureDateObj.toLocaleDateString('en-US', { weekday: 'long' });

        return {
            id: b._id,
            bookingId: pnr,
            busName: b.schedule?.company?.name || b.schedule?.bus?.name || 'Test Express 314',
            busType: b.schedule?.bus?.type || 'Luxury',
            busImage: b.schedule?.bus?.image,
            status: b.bookingStatus || 'Upcoming',
            fromCity: b.schedule?.route?.fromCity || b.fromCity || 'Lahore',
            toCity: b.schedule?.route?.toCity || b.toCity || 'Karachi',
            fromTerminal: `${b.schedule?.route?.fromCity || b.fromCity || 'Lahore'} Terminal`,
            toTerminal: `${b.schedule?.route?.toCity || b.toCity || 'Karachi'} Terminal`,
            departureTime: b.schedule?.departureTime || '08:00',
            arrivalTime: b.schedule?.arrivalTime || '23:00',
            duration: b.schedule?.route?.duration || '4h',
            date: dateFormatted,
            dayOfWeek: dayOfWeekFormatted,
            seats: seatsArr.length > 0 ? seatsArr : ['12', '13'],
            seatsCount: seatsArr.length || 2,
            price: b.totalAmount || b.fare || 5000,
            paymentStatus: b.paymentStatus || 'Paid',
            route: `${b.schedule?.route?.fromCity || 'Lahore'} to ${b.schedule?.route?.toCity || 'Karachi'}`,
            time: b.schedule?.departureTime || '08:00',
            fullData: b,
        };
    }) || [];

    const filteredBookings = mappedBookings.filter((b) => {
        const statusLower = (b.status || '').toLowerCase();
        if (activeTab === 'upcoming') {
            return statusLower.includes('upcoming') || statusLower.includes('confirm') || statusLower.includes('active');
        }
        if (activeTab === 'completed') {
            return statusLower.includes('completed') || statusLower.includes('finish');
        }
        if (activeTab === 'cancelled') {
            return statusLower.includes('cancel');
        }
        return true;
    });

    const renderTabHeader = () => (
        <View style={styles.tabCardContainer}>
            <View style={styles.tabsRow}>
                {TABS.map((item, index) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.IconComponent;
                    const isLast = index === TABS.length - 1;

                    return (
                        <View key={item.id} style={styles.tabItemWrapper}>
                            <TouchableOpacity
                                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                                onPress={() => setActiveTab(item.id)}
                                activeOpacity={0.8}
                            >

                                <AppText
                                    size={10.5}
                                    weight={isActive ? '700' : '600'}
                                    color={isActive ? colors.WHITE : '#475569'}
                                    numberOfLines={1}
                                    style={{ marginLeft: scale(3) }}
                                >
                                    {t(item.titleKey) || item.fallbackTitle}
                                </AppText>
                            </TouchableOpacity>
                            {!isLast && !isActive && activeTab !== TABS[index + 1]?.id && (
                                <View style={styles.verticalDivider} />
                            )}
                        </View>
                    );
                })}
            </View>
        </View>
    );

    return (
        <ScreenWrapper isScrollable={false} gradient="upper" header={<Header title={t('bookings_title') || 'My Bookings'} showBack={false} />}>
            <FlatList
                data={filteredBookings}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderTabHeader}
                renderItem={({ item }) => (
                    <BookingCard
                        booking={item}
                        onView={() => handleView(item)}
                        onDownload={() => handleView(item)}
                    />
                )}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                onRefresh={refetch}
                refreshing={isLoading}
                ListEmptyComponent={() => (
                    <EmptyCard
                        title={t('no_bookings_title') || 'No Bookings Yet'}
                        message={t('no_bookings_desc') || "You haven't booked any bus trips yet. Book your first trip to get started!"}
                        actionButtonTitle={t('explore_buses') || 'Explore Buses'}
                        onActionPress={() => navigation.navigate('Home')}
                        containerStyle={styles.emptyContainer}
                    />
                )}
            />
        </ScreenWrapper>
    );
};

export default Bookings;

const styles = StyleSheet.create({
    emptyContainer: {
        marginTop: verticalScale(30),
    },
    listContainer: {
        flexGrow: 1,
        paddingBottom: scale(100),
        paddingTop: verticalScale(10),
    },
    tabCardContainer: {
        backgroundColor: colors.WHITE,
        borderRadius: scale(20),
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: scale(4),
        marginBottom: verticalScale(12),
        width: '100%',
        shadowColor: colors.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    tabsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexGrow: 1,
        width: '100%',
    },
    tabItemWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(7),
        paddingHorizontal: scale(2),
        borderRadius: scale(14),
    },
    tabButtonActive: {
        backgroundColor: '#0D57D0',
    },
    verticalDivider: {
        width: 1,
        height: verticalScale(14),
        backgroundColor: '#E2E8F0',
        alignSelf: 'center',
    },
});
