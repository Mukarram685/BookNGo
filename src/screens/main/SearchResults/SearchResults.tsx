import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, FlatList } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import colors, { Colors } from '../../../utils/colors';
import BusCard from '../../../component/Bus/BusCard';
import { BusSchedule } from '../../../interface/bus.interface';
import { useSearchBuses } from '../../../hooks/useSearchBuses';
import EmptyCard from '../../../component/common/EmptyCard';
import Header from '../../../component/Header';

type RootStackParamList = {
    SearchResults: {
        fromCity: string;
        toCity: string;
        date: string;
    };
};

type SearchResultsRouteProp = RouteProp<RootStackParamList, 'SearchResults'>;

const SearchResults = () => {
    const { t } = useTranslation();
    const route = useRoute<SearchResultsRouteProp>();
    const { fromCity, toCity, date } = route.params || {};

    const { data, isLoading, isFetching, refetch } = useSearchBuses({ fromCity, toCity, date });
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
                date: item.departureDate || item.date || item.journeyDate || item.scheduleDate || item.travelDate || date,
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
        <ScreenWrapper isScrollable={false} backgroundColor={Colors.BACKGROUND} isLoading={isLoading && !data} header={<Header title={t('search_results_title') || "Search Results"} />}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.PRIMARY} />
            <View style={styles.container}>
                <View style={styles.header}>
                    <AppText size={22} weight="800" color={Colors.PRIMARY}>
                        {fromCity} {t('route_to') || "to"} {toCity}
                    </AppText>
                    <AppText size={15} color={Colors.DARK_GRAY} weight="500">
                        {t('booking_details_date') || "Date"}: {date}
                    </AppText>
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
                            <EmptyCard
                                title={t('no_buses_found') || "No Buses Available"}
                                message={t('no_buses_desc') || "No buses found for this route. Please check another date or route."}
                                containerStyle={styles.emptyContainer}
                            />
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
        flexGrow: 1,
        paddingBottom: verticalScale(20),
    },
    header: {
        paddingHorizontal: scale(20),
        paddingTop: verticalScale(20),
        marginBottom: verticalScale(10),
    },
    emptyContainer: {
        marginTop: verticalScale(20),
    }
});

export default SearchResults;
