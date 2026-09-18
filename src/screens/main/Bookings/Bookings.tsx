import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Platform,
    PermissionsAndroid,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import Toast from 'react-native-toast-message';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import Header from '../../../component/Header';
import AppText from '../../../component/common/AppText';
import BookingCard, { BookingCardItem } from '../../../component/Booking/BookingCard';
import TicketCard from '../../../component/Booking/TicketCard';
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
    { id: 'upcoming', titleKey: 'stat_upcoming', fallbackTitle: 'Upcoming', IconComponent: CalendarStat },
    { id: 'completed', titleKey: 'stat_completed', fallbackTitle: 'Completed', IconComponent: CheckStat },
    { id: 'cancelled', titleKey: 'stat_cancelled', fallbackTitle: 'Cancelled', IconComponent: CrossStat },
];

interface BookingsProps {
    route?: {
        params?: {
            initialTab?: TabType;
            tab?: TabType;
        };
    };
}

const Bookings: React.FC<BookingsProps> = ({ route }) => {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const { data, isLoading, isFetching, refetch } = useMyBookings();
    
    const targetInitialTab = route?.params?.initialTab || route?.params?.tab || 'upcoming';
    const [activeTab, setActiveTab] = useState<TabType>(
        targetInitialTab === 'completed' || targetInitialTab === 'cancelled' || targetInitialTab === 'upcoming'
            ? targetInitialTab
            : 'upcoming'
    );

    const [downloadingBooking, setDownloadingBooking] = useState<BookingCardItem | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const viewShotRef = useRef<any>(null);

    React.useEffect(() => {
        const paramTab = route?.params?.initialTab || route?.params?.tab;
        if (paramTab && (paramTab === 'completed' || paramTab === 'cancelled' || paramTab === 'upcoming')) {
            setActiveTab(paramTab);
        }
    }, [route?.params?.initialTab, route?.params?.tab]);

    const handleView = (booking: any) => {
        navigation.navigate('BookingDetails', { booking });
    };

    const handleDownloadTicket = (booking: BookingCardItem) => {
        if (isCapturing) return;
        setIsCapturing(true);
        setDownloadingBooking(booking);
    };

    useEffect(() => {
        if (downloadingBooking && isCapturing) {
            const timer = setTimeout(async () => {
                try {
                    if (Platform.OS === 'android') {
                        try {
                            await PermissionsAndroid.request(
                                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                            );
                        } catch (err) {
                            console.warn(err);
                        }
                    }

                    if (viewShotRef.current && viewShotRef.current.capture) {
                        const uri = await viewShotRef.current.capture();
                        await Share.open({
                            title: 'BookNGo Ticket Details',
                            url: uri,
                            type: 'image/png',
                        });
                    }
                } catch (error: any) {
                    if (
                        error?.message &&
                        !error.message.includes('dismissed') &&
                        !error.message.includes('User did not share') &&
                        !error.message.includes('cancel')
                    ) {
                        console.log('Error sharing/downloading ticket:', error);
                        Toast.show({
                            type: 'error',
                            text1: 'Download Failed',
                            text2: 'Could not generate ticket image. Please try again.',
                        });
                    }
                } finally {
                    setIsCapturing(false);
                    setDownloadingBooking(null);
                }
            }, 350);

            return () => clearTimeout(timer);
        }
    }, [downloadingBooking, isCapturing]);

    const rawBookings = ((data as any)?.bookings as any[]) || (Array.isArray(data) ? data : []);

    if (isLoading && !data && rawBookings.length === 0) {
        return <AppLoader />;
    }

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
                    const isLast = index === TABS.length - 1;

                    return (
                        <View key={item.id} style={styles.tabItemWrapper}>
                            <TouchableOpacity
                                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                                onPress={() => setActiveTab(item.id)}
                                activeOpacity={0.8}
                            >
                                <AppText
                                    size={11}
                                    weight={isActive ? '700' : '600'}
                                    color={isActive ? colors.WHITE : '#475569'}
                                    numberOfLines={1}
                                    style={{ marginLeft: scale(3), includeFontPadding: false }}
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
                        onDownload={() => handleDownloadTicket(item)}
                    />
                )}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                onRefresh={refetch}
                refreshing={isFetching && Boolean(data)}
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

            {/* Offscreen hidden ViewShot for capturing the ticket */}
            {downloadingBooking && (
                <View style={styles.offscreenContainer} pointerEvents="none">
                    <ViewShot
                        ref={viewShotRef}
                        options={{ format: 'png', quality: 0.95 }}
                        style={styles.viewShotCard}
                    >
                        <TicketCard booking={downloadingBooking} />
                    </ViewShot>
                </View>
            )}

            {/* Capturing loading overlay */}
            {isCapturing && (
                <View style={styles.capturingOverlay}>
                    <View style={styles.capturingDialog}>
                        <ActivityIndicator size="large" color="#0D57D0" />
                        <AppText size={13} weight="700" color={colors.SLATE_DARK} style={{ marginTop: verticalScale(10) }}>
                            {t('generating_ticket') || 'Generating Ticket...'}
                        </AppText>
                    </View>
                </View>
            )}
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
        minHeight: scale(34),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: verticalScale(7),
        paddingHorizontal: scale(3),
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
    offscreenContainer: {
        position: 'absolute',
        left: -9999,
        top: 0,
        width: scale(340),
        opacity: 1,
        zIndex: -9999,
    },
    viewShotCard: {
        backgroundColor: colors.WHITE,
        width: '100%',
    },
    capturingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.35)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    capturingDialog: {
        backgroundColor: colors.WHITE,
        borderRadius: scale(16),
        paddingHorizontal: scale(24),
        paddingVertical: verticalScale(18),
        alignItems: 'center',
        shadowColor: colors.BLACK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
    },
});
