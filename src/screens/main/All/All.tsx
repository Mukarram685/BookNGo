import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, FlatList } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import Colors from '../../../utils/Colors.util';
import BusCard from '../../../component/Bus/BusCard';
import { BusSchedule } from '../../../interface/bus.interface';
import { useSearchBuses } from '../../../hooks/useSearchBuses';
import Header from '../../../component/Header';

const All = () => {
    const { t } = useTranslation();
    const { data, isLoading, isFetching, refetch } = useSearchBuses({});
    const [busList, setBusList] = useState<BusSchedule[]>([]);

    useEffect(() => {
        const searchData = data as any;
        let rawData: any[] = [];

        if (searchData?.schedules) {
            rawData = Array.isArray(searchData.schedules) ? searchData.schedules : [];
        } else if (searchData?.data) {
            rawData = Array.isArray(searchData.data) ? searchData.data : [];
        }

        if (rawData && rawData.length > 0) {
            const mappedData: BusSchedule[] = rawData.map((item: any) => ({
                _id: item._id,
                busId: item.bus?._id || item.busId || '',
                busName: item.company?.name || item.bus?.name || 'Bus Service',
                busType: item.bus?.type || 'Standard',
                busNumber: item.bus?.busNumber || 'N/A',
                fromCity: item.route?.fromCity || item.fromCity || '',
                toCity: item.route?.toCity || item.toCity || '',
                departureTime: item.departureTime,
                arrivalTime: item.arrivalTime,
                duration: item.route?.duration || item.duration || '0h 0m',
                date: item.departureDate || item.date,
                price: item.fare || item.price || 0,
                seatsAvailable: item.availableSeats || 0,
                totalSeats: item.bus?.totalSeats || 0,
                bookedSeats: item.bookedSeats || [],
                seatLayout: item.bus?.seatLayout || '2x2',
                amenities: item.bus?.amenities || [],
                status: (item.status === 'active' ? 'AVAILABLE' : item.status) || 'AVAILABLE',
                image: item.bus?.image,
            }));
            setBusList(mappedData);
        } else {
            setBusList([]);
        }
    }, [data]);

    const handleBookPress = (item: BusSchedule) => {
        console.log('Book Pressed', item);
    };

    return (
        <ScreenWrapper backgroundColor={Colors.BACKGROUND} isLoading={isLoading && !data} header={<Header title={t('all_routes_title') || "All Routes"} showBack={false} />}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.PRIMARY} />
            <View style={styles.container}>
                <View style={styles.header}>
                    <AppText size={22} weight="800" color={Colors.PRIMARY}>
                        {t('all_available_buses') || "All Available Buses"}
                    </AppText>
                    {/* <AppText size={15} color={Colors.DARK_GRAY} weight="500">
                        {t('showing_today_onwards') || "Showing schedules from today onwards"}
                    </AppText> */}
                </View>

                <FlatList
                    data={busList}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <BusCard item={item} onBookPress={handleBookPress} />
                    )}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    onRefresh={refetch}
                    refreshing={isFetching}
                    ListEmptyComponent={
                        (!isLoading) ? (
                            <View style={styles.emptyContainer}>
                                <AppText color={Colors.DARK_GRAY} weight="500">{t('no_routes_available') || "No routes found."}</AppText>
                            </View>
                        ) : null
                    }
                />
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: verticalScale(80),
    },
    header: {
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(10),
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: verticalScale(20),
    }
});

export default All;
