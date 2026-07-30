import React from 'react';
import { View, StyleSheet, StatusBar, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import Colors from '../../../utils/Colors.util';
import Header from '../../../component/Header';
import BookingCard from '../../../component/Booking/BookingCard';
import { scale, verticalScale } from 'react-native-size-matters';
import { useMyBookings } from '../../../hooks/useMyBookings';
import AppLoader from '../../../component/common/AppLoader';
import AppText from '../../../component/common/AppText';

const Bookings = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const { data, isLoading, refetch } = useMyBookings();

    const handleView = (booking: any) => {
        navigation.navigate('BookingDetails', { booking });
    };

    if (isLoading) {
        return <AppLoader />;
    }

    const mappedBookings = data?.bookings?.map((b: any) => ({
        id: b._id,
        route: `${b.schedule?.route?.fromCity} to ${b.schedule?.route?.toCity}`,
        date: new Date(b.schedule?.departureDate).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        }),
        time: b.schedule?.departureTime,
        status: b.bookingStatus || 'Confirmed',
        price: b.totalAmount.toLocaleString(),
        fullData: b
    })) || [];

    return (
        <ScreenWrapper backgroundColor={Colors.BACKGROUND} header={<Header title={t('bookings_title') || 'My Bookings'} showBack={false} />}>
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
                    <View style={styles.emptyContainer}>
                        <AppText size={16} color={Colors.TEXT_GREY} align="center">
                            No bookings found
                        </AppText>
                    </View>
                )}
            />
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        paddingTop: verticalScale(10),
        paddingBottom: scale(100),
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: scale(150),
    },
});

export default Bookings;

