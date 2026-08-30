import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import Colors from '../../../utils/Colors.util';
import Header from '../../../component/Header';
import BookingCard from '../../../component/Booking/BookingCard';
import EmptyCard from '../../../component/common/EmptyCard';
import { scale, verticalScale } from 'react-native-size-matters';
import { useMyBookings } from '../../../hooks/useMyBookings';
import AppLoader from '../../../component/common/AppLoader';

interface BookingData {
    _id: string;
    bookingStatus?: string;
    totalAmount: number;
    schedule?: {
        departureDate: string;
        departureTime: string;
        route?: {
            fromCity: string;
            toCity: string;
        };
    };
}

const Bookings = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const { data, isLoading, refetch } = useMyBookings();

    const handleView = (booking: Record<string, unknown>) => {
        navigation.navigate('BookingDetails' as never, { booking } as never);
    };

    if (isLoading && !data) {
        return <AppLoader />;
    }

    const rawBookings = ((data as any)?.bookings as BookingData[]) || [];

    const mappedBookings = rawBookings.map((b) => ({
        id: b._id,
        route: `${b.schedule?.route?.fromCity} to ${b.schedule?.route?.toCity}`,
        date: new Date(b.schedule?.departureDate || '').toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }),
        time: b.schedule?.departureTime || 'N/A',
        status: b.bookingStatus || 'Confirmed',
        price: b.totalAmount ? b.totalAmount.toLocaleString() : '0',
        fullData: b
    })) || [];

    return (
        <ScreenWrapper gradient="upper" header={<Header title={t('bookings_title') || 'My Bookings'} showBack={false} />}>
            <FlatList
                data={mappedBookings}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <BookingCard 
                        booking={item} 
                        onView={() => handleView(item)} 
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

const styles = StyleSheet.create({
    emptyContainer: {
        marginTop: verticalScale(40),
    },
    listContainer: {
        flexGrow: 1,
        paddingBottom: scale(100),
        paddingTop: verticalScale(10),
    },
});

export default Bookings;
