import React, { useEffect, useState, useMemo } from 'react';
import { View, StyleSheet, StatusBar, FlatList, TouchableOpacity } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import colors, { Colors } from '../../../utils/colors';
import BusCard from '../../../component/Bus/BusCard';
import CitySelector from '../../../component/Bus/CitySelector';
import { From, To } from '../../../assets/svg';
import { BusSchedule } from '../../../interface/bus.interface';
import { useSearchBuses } from '../../../hooks/useSearchBuses';
import EmptyCard from '../../../component/common/EmptyCard';
import Header from '../../../component/Header';

const All = () => {
    const { t } = useTranslation();
    const [fromCity, setFromCity] = useState<string>('');
    const [toCity, setToCity] = useState<string>('');

    const trimmedFrom = fromCity.trim();
    const trimmedTo = toCity.trim();
    const isBothSelected = Boolean(trimmedFrom && trimmedTo);
    const isNeitherSelected = Boolean(!trimmedFrom && !trimmedTo);
    const isFilterActive = Boolean(trimmedFrom || trimmedTo);

    // API is hit ONLY when:
    // 1. Initial / default state (neither city selected -> loads all routes)
    // 2. Both fromCity AND toCity are selected by the user
    const shouldFetch = isBothSelected || isNeitherSelected;

    const queryParams = useMemo(() => {
        if (isBothSelected) {
            return {
                fromCity: trimmedFrom,
                toCity: trimmedTo,
            };
        }
        return {};
    }, [trimmedFrom, trimmedTo, isBothSelected]);

    const { data, isLoading, isFetching, refetch } = useSearchBuses(
        shouldFetch ? queryParams : undefined,
        { enabled: shouldFetch }
    );
    const [busList, setBusList] = useState<BusSchedule[]>([]);

    useEffect(() => {
        if (!shouldFetch) {
            setBusList([]);
            return;
        }

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
                date: item.departureDate || item.date || item.journeyDate || item.scheduleDate || item.travelDate,
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
    }, [data, shouldFetch]);

    const handleSwapCities = () => {
        const temp = fromCity;
        setFromCity(toCity);
        setToCity(temp);
    };

    const handleClearFilter = () => {
        setFromCity('');
        setToCity('');
    };

    const handleBookPress = (item: BusSchedule) => {
        console.log('Book Pressed', item);
    };

    return (
        <ScreenWrapper
            isScrollable={false}
            backgroundColor={Colors.BACKGROUND}
            isLoading={isLoading && !data}
            header={<Header title={t('explore_routes_title') || t('all_routes_title') || "Explore Routes"} showBack={false} />}
        >
            <StatusBar barStyle="light-content" backgroundColor={Colors.PRIMARY} />
            <View style={styles.container}>

                <View style={styles.filterCard}>
                    {isFilterActive ? (
                        <View style={styles.filterHeader}>
                            <TouchableOpacity
                                onPress={handleClearFilter}
                                activeOpacity={0.7}
                                style={styles.clearBtn}
                            >
                                <AppText size={13} weight="800" color={colors.RED}>
                                    {t('clear_filters') || "Clear Filters"}
                                </AppText>
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    <View style={styles.inputsRow}>
                        <View style={styles.selectorsColumn}>

                            <CitySelector
                                placeholder={t('home_from_city') || "From City"}
                                value={fromCity}
                                onSelect={(city) => setFromCity(city)}
                                onClear={() => setFromCity('')}
                                LeftIcon={From}
                                iconColor={colors.BLUE_PRIMARY}
                                containerStyle={styles.citySelectorContainer}
                                selectorStyle={styles.citySelectorInput}
                                modalTitle={t('select_departure_city') || "Select Departure City"}
                            />

                            <View style={styles.inputDivider} />

                            <CitySelector
                                placeholder={t('home_to_city') || "To City"}
                                value={toCity}
                                onSelect={(city) => setToCity(city)}
                                onClear={() => setToCity('')}
                                LeftIcon={To}
                                iconColor={colors.BLUE_PRIMARY}
                                containerStyle={styles.citySelectorContainer}
                                selectorStyle={styles.citySelectorInput}
                                modalTitle={t('select_arrival_city') || "Select Arrival City"}
                            />
                        </View>

                    </View>

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
                            <View style={styles.emptyWrap}>
                                <EmptyCard
                                    title={
                                        (!isBothSelected && isFilterActive)
                                            ? (!trimmedTo ? (t('select_arrival_city') || "Select Arrival City") : (t('select_departure_city') || "Select Departure City"))
                                            : (t('no_routes_found') || "No Routes Available")
                                    }
                                    message={
                                        (!isBothSelected && isFilterActive)
                                            ? (!trimmedTo
                                                ? `Please select your destination / arrival city to view available bus routes from ${trimmedFrom}.`
                                                : `Please select your departure city to view available bus routes to ${trimmedTo}.`)
                                            : isBothSelected
                                                ? `No active bus routes found for ${trimmedFrom} to ${trimmedTo}. Try searching different cities or clear your filter.`
                                                : (t('no_routes_desc') || "There are no active bus routes available right now.")
                                    }
                                    containerStyle={styles.emptyContainer}
                                />
                                {isFilterActive && (
                                    <TouchableOpacity
                                        style={styles.resetFilterBtn}
                                        onPress={handleClearFilter}
                                        activeOpacity={0.8}
                                    >
                                        <AppText size={13} weight="800" color={colors.RED}>
                                            {t('clear_filters') || "Clear Filters"}
                                        </AppText>
                                    </TouchableOpacity>
                                )}
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
    filterCard: {
        borderRadius: scale(18),
        marginBottom: verticalScale(8),
    },
    filterHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: verticalScale(6),
        paddingHorizontal: scale(2),
    },
    clearBtn: {
        paddingVertical: verticalScale(2),
        paddingHorizontal: scale(4),
    },
    inputsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    selectorsColumn: {
        flex: 1,
    },
    citySelectorContainer: {
        marginBottom: 0,
    },
    citySelectorInput: {
        height: verticalScale(42),
        backgroundColor: '#F8FAFC',
        borderRadius: scale(10),
        paddingHorizontal: scale(10),
    },
    inputDivider: {
        height: verticalScale(8),
    },
    swapButton: {
        width: scale(36),
        height: scale(36),
        borderRadius: scale(18),
        backgroundColor: colors.BLUE_LIGHT_BG,
        borderWidth: 1,
        borderColor: colors.BLUE_BORDER,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: scale(10),
        shadowColor: colors.BLUE_PRIMARY,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 2,
    },
    summaryBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: verticalScale(10),
        paddingTop: verticalScale(8),
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    summaryText: {
        flex: 1,
        marginRight: scale(8),
    },
    badgePill: {
        backgroundColor: colors.BLUE_LIGHT_BG,
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(3),
        borderRadius: scale(12),
        borderWidth: 1,
        borderColor: colors.BLUE_BORDER,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: verticalScale(80),
    },
    emptyWrap: {
        alignItems: 'center',
    },
    emptyContainer: {
        marginTop: verticalScale(20),
    },
    resetFilterBtn: {
        marginTop: verticalScale(12),
        paddingVertical: verticalScale(8),
        paddingHorizontal: scale(18),
        backgroundColor: colors.BLUE_LIGHT_BG,
        borderRadius: scale(10),
        borderWidth: 1,
        borderColor: colors.BLUE_BORDER,
    },
});

export default All;
