import React, { useEffect, useState } from 'react';
import { View, StyleSheet, StatusBar, FlatList } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useRoute, RouteProp } from '@react-navigation/native';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import Colors from '../../../utils/Colors.util';
import BusCard from '../../../component/Bus/BusCard';
import { BusSchedule } from '../../../interface/bus.interface';
import { useSearchBuses } from '../../../hooks/useSearchBuses';

type RootStackParamList = {
    SearchResults: {
        fromCity: string;
        toCity: string;
        date: string;
    };
};

type SearchResultsRouteProp = RouteProp<RootStackParamList, 'SearchResults'>;

const SearchResults = () => {
    const route = useRoute<SearchResultsRouteProp>();
    const { fromCity, toCity, date } = route.params;

    const { mutate: search, isPending, data } = useSearchBuses();
    const [busList, setBusList] = useState<BusSchedule[]>([]);

    useEffect(() => {
        // Trigger search on mount
        search({ fromCity, toCity, date });
    }, [fromCity, toCity, date]);

    useEffect(() => {
        let rawData: any[] = [];

        if (data?.schedules) {
            rawData = Array.isArray(data.schedules) ? data.schedules : [];
        } else if (data?.data) {
            rawData = Array.isArray(data.data) ? data.data : [];
        }

        if (rawData && rawData.length > 0) {
            const mappedData: BusSchedule[] = rawData.map((item: any) => ({
                _id: item._id,
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
        // Navigate into booking details?
    };

    return (
        <ScreenWrapper backgroundColor={Colors.DARK_BG} isLoading={isPending}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.DARK_BG} />
            <View style={styles.container}>
                <View style={styles.header}>
                    <AppText size={20} weight="700" color={Colors.WHITE}>
                        {fromCity} to {toCity}
                    </AppText>
                    <AppText size={14} color={Colors.TEXT_GREY}>
                        Date: {date}
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
                    ListEmptyComponent={
                        (!isPending) ? (
                            <View style={styles.emptyContainer}>
                                <AppText color={Colors.TEXT_GREY}>No buses found.</AppText>
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
        paddingBottom: verticalScale(20),
    },
    header: {
        paddingHorizontal: scale(20),
        paddingTop: verticalScale(20),
        marginBottom: verticalScale(10),
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: verticalScale(20),
    }
});

export default SearchResults;
