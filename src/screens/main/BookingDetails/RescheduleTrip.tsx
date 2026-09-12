import React, { useState, useMemo, useCallback } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Platform,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import DateTimePicker from '@react-native-community/datetimepicker';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import AppButton from '../../../component/common/AppButton';
import Header from '../../../component/Header';
import colors, { Colors } from '../../../utils/colors';
import { Info, ShieldCheck } from '../../../assets/svg';
import SeatItem from '../../../component/Seat/SeatItem';
import SeatLegend from '../../../component/Seat/SeatLegend';
import CabinHeader from '../../../component/Seat/CabinHeader';
import { useSearchBuses } from '../../../hooks/useSearchBuses';
import { useRescheduleBooking } from '../../../hooks/useRescheduleBooking';

const RescheduleTrip = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { booking } = route.params || {};
    const rawBooking = booking?.fullData || booking;

    const bookingId = rawBooking?._id || booking?.id;
    const fromCity =
        rawBooking?.schedule?.route?.fromCity ||
        rawBooking?.fromCity ||
        booking?.fromCity ||
        '';
    const toCity =
        rawBooking?.schedule?.route?.toCity ||
        rawBooking?.toCity ||
        booking?.toCity ||
        '';
    const originalDate =
        rawBooking?.schedule?.departureDate ||
        booking?.date ||
        '';
    const originalTime =
        rawBooking?.schedule?.departureTime ||
        booking?.time ||
        '';
    const originalBus =
        rawBooking?.schedule?.bus?.busNumber ||
        booking?.busName ||
        '';
    const originalSeats = rawBooking?.seats || booking?.seats || [];
    const originalSeatNumbers = Array.isArray(originalSeats)
        ? originalSeats.map((s: any) => typeof s === 'object' ? s.seatNumber : s)
        : [];
    const requiredSeatCount = Math.max(1, originalSeatNumbers.length);
    const originalTotalAmount =
        typeof rawBooking?.totalAmount === 'number'
            ? rawBooking.totalAmount
            : typeof booking?.price === 'number'
            ? booking.price
            : 0;

    // Date Picker state
    const getInitialDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
    };
    const [selectedDate, setSelectedDate] = useState<Date>(getInitialDate());
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

    const formattedSearchDate = selectedDate.toISOString().split('T')[0];

    // Selected schedule & seats
    const [selectedSchedule, setSelectedSchedule] = useState<any | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

    const rescheduleMutation = useRescheduleBooking();

    // Query schedules for selected date
    const { data: searchResults, isLoading: searchingSchedules } = useSearchBuses({
        fromCity,
        toCity,
        date: formattedSearchDate,
    });

    const schedulesList: any[] = useMemo(() => {
        const res = searchResults as any;
        const list = res?.schedules || res?.data || [];
        // Exclude current schedule if same date
        return list.filter((s: any) => String(s._id) !== String(rawBooking?.schedule?._id));
    }, [searchResults, rawBooking]);

    const handleDateChange = (event: any, date?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (date) {
            setSelectedDate(date);
            setSelectedSchedule(null);
            setSelectedSeats([]);
        }
    };

    const handleSelectSchedule = (schedule: any) => {
        setSelectedSchedule(schedule);
        setSelectedSeats([]);
    };

    const toggleSeat = useCallback((seatNumber: number) => {
        setSelectedSeats(prev => {
            if (prev.includes(seatNumber)) {
                return prev.filter(s => s !== seatNumber);
            } else {
                if (prev.length < requiredSeatCount) {
                    return [...prev, seatNumber];
                } else if (requiredSeatCount === 1) {
                    return [seatNumber]; // Replace single seat
                } else {
                    Alert.alert(
                        'Maximum Seats Reached',
                        `Your original booking has ${requiredSeatCount} seats. Please deselect a seat before choosing another.`
                    );
                    return prev;
                }
            }
        });
    }, [requiredSeatCount]);

    // Build seat grid for selected schedule
    const bookedSeatsOnNewBus = selectedSchedule?.bookedSeats || [];
    const seatsGrid = useMemo(() => {
        if (!selectedSchedule) return null;
        const totalSeats = selectedSchedule.bus?.totalSeats || selectedSchedule.totalSeats || 40;
        const layout = selectedSchedule.bus?.seatLayout || '2x2';

        let seatsPerRow = 4;
        let leftSide = 2;
        let rightSide = 2;

        if (layout === '2x1') {
            seatsPerRow = 3;
            leftSide = 2;
            rightSide = 1;
        } else if (layout === '3x2') {
            seatsPerRow = 5;
            leftSide = 3;
            rightSide = 2;
        }

        const rows = Math.ceil(totalSeats / seatsPerRow);
        const grid = [];

        for (let i = 0; i < rows; i++) {
            const rowSeats = [];
            const isLastRow = i === rows - 1;

            if (isLastRow && totalSeats % seatsPerRow !== 0) {
                const remaining = totalSeats - (i * seatsPerRow);
                for (let j = 0; j < remaining; j++) {
                    const seatNum = i * seatsPerRow + j + 1;
                    rowSeats.push(
                        <SeatItem
                            key={seatNum}
                            seatNumber={seatNum}
                            status={bookedSeatsOnNewBus.includes(seatNum) ? 'booked' : selectedSeats.includes(seatNum) ? 'selected' : 'available'}
                            onPress={toggleSeat}
                        />
                    );
                }
            } else {
                for (let j = 0; j < leftSide; j++) {
                    const seatNum = i * seatsPerRow + j + 1;
                    if (seatNum <= totalSeats) {
                        rowSeats.push(
                            <SeatItem
                                key={seatNum}
                                seatNumber={seatNum}
                                status={bookedSeatsOnNewBus.includes(seatNum) ? 'booked' : selectedSeats.includes(seatNum) ? 'selected' : 'available'}
                                onPress={toggleSeat}
                            />
                        );
                    }
                }

                if (i === Math.floor(rows / 2)) {
                    rowSeats.push(
                        <View key={`aisle-${i}`} style={styles.aisleTextWrapper}>
                            <AppText size={10} color={colors.SLATE_MUTED} weight="700" style={styles.verticalText}>
                                AISLE
                            </AppText>
                        </View>
                    );
                } else {
                    rowSeats.push(<View key={`aisle-spacer-${i}`} style={{ width: scale(25) }} />);
                }

                for (let j = 0; j < rightSide; j++) {
                    const seatNum = i * seatsPerRow + leftSide + j + 1;
                    if (seatNum <= totalSeats) {
                        rowSeats.push(
                            <SeatItem
                                key={seatNum}
                                seatNumber={seatNum}
                                status={bookedSeatsOnNewBus.includes(seatNum) ? 'booked' : selectedSeats.includes(seatNum) ? 'selected' : 'available'}
                                onPress={toggleSeat}
                            />
                        );
                    }
                }
            }

            grid.push(
                <View key={`row-${i}`} style={styles.seatRow}>
                    {rowSeats}
                </View>
            );
        }

        return grid;
    }, [selectedSchedule, bookedSeatsOnNewBus, selectedSeats, toggleSeat]);

    // Fare calculations
    const newTotalAmount = selectedSchedule ? (selectedSchedule.fare || 0) * requiredSeatCount : 0;
    const fareDiff = selectedSchedule ? newTotalAmount - originalTotalAmount : 0;

    const handleConfirmReschedule = () => {
        if (!selectedSchedule) {
            Alert.alert('Selection Required', 'Please select a departure schedule.');
            return;
        }
        if (selectedSeats.length !== requiredSeatCount) {
            Alert.alert('Seats Required', `Please select exactly ${requiredSeatCount} seats.`);
            return;
        }

        Alert.alert(
            'Confirm Trip Reschedule 🔄',
            `Are you sure you want to reschedule your trip to:\n\n📅 Date: ${formattedSearchDate}\n🕒 Time: ${selectedSchedule.departureTime}\n💺 New Seats: ${selectedSeats.join(', ')}\n\n${fareDiff > 0 ? `Additional Fare: Rs. ${fareDiff.toLocaleString()}` : fareDiff < 0 ? `Fare Credit: Rs. ${Math.abs(fareDiff).toLocaleString()}` : 'Fare Difference: Rs. 0 (Fully Covered)'}`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm & Reschedule',
                    style: 'default',
                    onPress: () => {
                        rescheduleMutation.mutate(
                            {
                                bookingId,
                                newScheduleId: selectedSchedule._id,
                                newSeats: selectedSeats,
                            },
                            {
                                onSuccess: () => {
                                    navigation.navigate('BottomTabs', { screen: 'Bookings' });
                                },
                            }
                        );
                    },
                },
            ]
        );
    };

    return (
        <ScreenWrapper
            backgroundColor={Colors.BACKGROUND}
            header={<Header title="Reschedule Trip" showBack={true} />}
        >
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                {/* Single Consolidated Card Container */}
                <View style={styles.unifiedCard}>
                    
                    {/* Header: Current Trip Info */}
                    <View style={styles.currentTripHeader}>
                        <View style={styles.headerTopRow}>
                            <AppText size={11} weight="800" color={Colors.TEXT_GREY}>
                                CURRENT BOOKING DETAILS
                            </AppText>
                            <View style={styles.badgeWarning}>
                                <AppText size={11} weight="800" color="#D97706">
                                    {requiredSeatCount} {requiredSeatCount === 1 ? 'SEAT' : 'SEATS'}
                                </AppText>
                            </View>
                        </View>

                        <AppText size={18} weight="800" color={Colors.PRIMARY} style={{ marginVertical: verticalScale(4) }}>
                            {fromCity} ➔ {toCity}
                        </AppText>

                        <View style={styles.infoGrid}>
                            <View style={styles.infoCol}>
                                <AppText size={11} color={Colors.TEXT_GREY} weight="600">DEPARTURE</AppText>
                                <AppText size={13} weight="700" color={Colors.PRIMARY} style={{ marginTop: 2 }}>
                                    {originalDate ? new Date(originalDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'} • {originalTime}
                                </AppText>
                            </View>
                            <View style={styles.infoCol}>
                                <AppText size={11} color={Colors.TEXT_GREY} weight="600">ORIGINAL SEATS</AppText>
                                <AppText size={13} weight="700" color={Colors.PRIMARY} style={{ marginTop: 2 }}>
                                    #{originalSeatNumbers.join(', ') || 'N/A'}
                                </AppText>
                            </View>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Step 1: Select New Date */}
                    <View style={styles.sectionBlock}>
                        <AppText size={14} weight="800" color={Colors.PRIMARY} style={styles.sectionHeader}>
                            1. Select New Travel Date
                        </AppText>

                        <TouchableOpacity style={styles.dateSelectorBtn} onPress={() => setShowDatePicker(true)}>
                            <View>
                                <AppText size={11} color={Colors.TEXT_GREY} weight="600">NEW TRAVEL DATE</AppText>
                                <AppText size={15} weight="800" color={Colors.PRIMARY} style={{ marginTop: 2 }}>
                                    📅 {selectedDate.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                                </AppText>
                            </View>
                            <View style={styles.changeBtn}>
                                <AppText size={12} weight="700" color={Colors.WHITE}>Change</AppText>
                            </View>
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={selectedDate}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                minimumDate={new Date()}
                                onChange={handleDateChange}
                            />
                        )}
                    </View>

                    <View style={styles.divider} />

                    {/* Step 2: Choose Departure Schedule */}
                    <View style={styles.sectionBlock}>
                        <AppText size={14} weight="800" color={Colors.PRIMARY} style={styles.sectionHeader}>
                            2. Choose Departure Schedule
                        </AppText>

                        {searchingSchedules ? (
                            <View style={styles.loadingBox}>
                                <ActivityIndicator size="small" color={Colors.PRIMARY} />
                                <AppText size={12} color={Colors.TEXT_GREY} style={{ marginTop: 6 }}>
                                    Searching available departures...
                                </AppText>
                            </View>
                        ) : schedulesList.length === 0 ? (
                            <View style={styles.emptyBox}>
                                <AppText size={13} weight="700" color={Colors.PRIMARY}>
                                    No alternative departures found
                                </AppText>
                                <AppText size={11} color={Colors.TEXT_GREY} style={{ marginTop: 2, textAlign: 'center' }}>
                                    Please select a different date for {fromCity} to {toCity}.
                                </AppText>
                            </View>
                        ) : (
                            schedulesList.map((item) => {
                                const isSelected = selectedSchedule?._id === item._id;
                                const busName = item.company?.name || item.bus?.name || 'Express Bus';
                                const busType = item.bus?.type || 'Standard';
                                const fare = item.fare || 0;
                                const availableSeats = item.availableSeats || 0;

                                return (
                                    <TouchableOpacity
                                        key={item._id}
                                        style={[styles.scheduleCard, isSelected && styles.scheduleCardSelected]}
                                        onPress={() => handleSelectSchedule(item)}
                                    >
                                        <View style={styles.scheduleHeader}>
                                            <View style={{ flex: 1 }}>
                                                <AppText size={14} weight="800" color={isSelected ? Colors.PRIMARY : '#1E293B'}>
                                                    🕒 {item.departureTime} - {item.arrivalTime || 'TBD'}
                                                </AppText>
                                                <AppText size={11} color={Colors.TEXT_GREY} weight="600" style={{ marginTop: 2 }}>
                                                    {busName} • {busType}
                                                </AppText>
                                            </View>
                                            <View style={{ alignItems: 'flex-end' }}>
                                                <AppText size={15} weight="900" color={Colors.PRIMARY}>
                                                    Rs. {fare.toLocaleString()}
                                                </AppText>
                                                <AppText size={11} color={availableSeats > 5 ? '#16A34A' : '#DC2626'} weight="700">
                                                    {availableSeats} seats left
                                                </AppText>
                                            </View>
                                        </View>
                                        {isSelected && (
                                            <View style={styles.selectedPill}>
                                                <AppText size={10} weight="800" color={Colors.WHITE}>
                                                    ✓ Selected Departure
                                                </AppText>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                );
                            })
                        )}
                    </View>

                    {/* Step 3: Interactive Seat Selection */}
                    {selectedSchedule && (
                        <>
                            <View style={styles.divider} />
                            <View style={styles.sectionBlock}>
                                <View style={styles.seatHeaderRow}>
                                    <AppText size={14} weight="800" color={Colors.PRIMARY}>
                                        3. Pick {requiredSeatCount} Replacement {requiredSeatCount === 1 ? 'Seat' : 'Seats'}
                                    </AppText>
                                    <View style={styles.seatCountBadge}>
                                        <AppText size={11} weight="800" color={selectedSeats.length === requiredSeatCount ? '#16A34A' : '#D97706'}>
                                            {selectedSeats.length} / {requiredSeatCount} Selected
                                        </AppText>
                                    </View>
                                </View>

                                <SeatLegend />

                                <View style={styles.busCabin}>
                                    <CabinHeader />
                                    <View style={styles.seatFloor}>
                                        {seatsGrid}
                                    </View>
                                </View>
                            </View>
                        </>
                    )}

                    {/* Step 4: Fare Review & Summary */}
                    {selectedSchedule && (
                        <>
                            <View style={styles.divider} />
                            <View style={styles.sectionBlock}>
                                <AppText size={14} weight="800" color={Colors.PRIMARY} style={styles.sectionHeader}>
                                    4. Reschedule Fare Summary
                                </AppText>

                                <View style={styles.summaryRow}>
                                    <AppText size={12} color={Colors.TEXT_GREY}>Original Booking Amount</AppText>
                                    <AppText size={13} weight="700" color={Colors.PRIMARY}>Rs. {originalTotalAmount.toLocaleString()}</AppText>
                                </View>

                                <View style={styles.summaryRow}>
                                    <AppText size={12} color={Colors.TEXT_GREY}>New Departure Amount</AppText>
                                    <AppText size={13} weight="700" color={Colors.PRIMARY}>Rs. {newTotalAmount.toLocaleString()}</AppText>
                                </View>

                                <View style={styles.subDivider} />

                                <View style={styles.summaryRow}>
                                    <AppText size={13} weight="800" color={Colors.PRIMARY}>Fare Adjustment</AppText>
                                    <AppText size={14} weight="900" color={fareDiff > 0 ? '#DC2626' : fareDiff < 0 ? '#16A34A' : Colors.PRIMARY}>
                                        {fareDiff > 0 ? `+ Rs. ${fareDiff.toLocaleString()}` : fareDiff < 0 ? `- Rs. ${Math.abs(fareDiff).toLocaleString()}` : 'Rs. 0 (Covered)'}
                                    </AppText>
                                </View>
                            </View>
                        </>
                    )}

                    <View style={styles.divider} />

                    {/* Reschedule Terms & Policies */}
                    <View style={styles.termsBox}>
                        <View style={styles.termsHeaderRow}>
                            <ShieldCheck width={scale(16)} height={scale(16)} color="#1E40AF" />
                            <AppText size={12} weight="800" color="#1E40AF" style={{ marginLeft: scale(6) }}>
                                Reschedule Policy & Terms
                            </AppText>
                        </View>
                        
                        <View style={styles.termsList}>
                            <View style={styles.termItem}>
                                <AppText size={11} color="#3B82F6" weight="800">• </AppText>
                                <AppText size={11} color="#334155" style={styles.termText}>
                                    Rescheduling is permitted up to <AppText size={11} weight="700" color="#1E293B">1 hour before departure</AppText>.
                                </AppText>
                            </View>

                            <View style={styles.termItem}>
                                <AppText size={11} color="#3B82F6" weight="800">• </AppText>
                                <AppText size={11} color="#334155" style={styles.termText}>
                                    You must select exactly <AppText size={11} weight="700" color="#1E293B">{requiredSeatCount} seat(s)</AppText> matching your original reservation.
                                </AppText>
                            </View>

                            <View style={styles.termItem}>
                                <AppText size={11} color="#3B82F6" weight="800">• </AppText>
                                <AppText size={11} color="#334155" style={styles.termText}>
                                    If the new fare is higher, the fare difference applies. Lower fare adjustments follow operator policy.
                                </AppText>
                            </View>

                            <View style={styles.termItem}>
                                <AppText size={11} color="#3B82F6" weight="800">• </AppText>
                                <AppText size={11} color="#334155" style={styles.termText}>
                                    Existing passenger details (CNIC, name, contact) will transfer automatically to your new seats.
                                </AppText>
                            </View>
                        </View>
                    </View>

                    {/* Confirm Button inside the card */}
                    <AppButton
                        title={rescheduleMutation.isPending ? 'Rescheduling...' : 'Confirm & Reschedule Trip'}
                        onPress={handleConfirmReschedule}
                        disabled={!selectedSchedule || selectedSeats.length !== requiredSeatCount || rescheduleMutation.isPending}
                        style={styles.confirmBtn}
                    />

                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: scale(14),
        paddingBottom: verticalScale(35),
    },
    unifiedCard: {
        backgroundColor: Colors.SURFACE,
        borderRadius: scale(18),
        padding: scale(16),
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
    },
    currentTripHeader: {
        paddingBottom: verticalScale(4),
    },
    headerTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(4),
    },
    badgeWarning: {
        backgroundColor: '#FEF3C7',
        paddingHorizontal: scale(8),
        paddingVertical: verticalScale(3),
        borderRadius: scale(6),
    },
    infoGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: verticalScale(4),
    },
    infoCol: {
        flex: 1,
    },
    divider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: verticalScale(14),
    },
    subDivider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: verticalScale(8),
    },
    sectionBlock: {
        marginVertical: verticalScale(2),
    },
    sectionHeader: {
        marginBottom: verticalScale(10),
    },
    dateSelectorBtn: {
        backgroundColor: '#F8FAFC',
        borderRadius: scale(12),
        padding: scale(12),
        borderWidth: 1,
        borderColor: '#E2E8F0',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    changeBtn: {
        backgroundColor: Colors.PRIMARY,
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(6),
        borderRadius: scale(8),
    },
    loadingBox: {
        backgroundColor: '#F8FAFC',
        borderRadius: scale(12),
        padding: scale(16),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    emptyBox: {
        backgroundColor: '#F8FAFC',
        borderRadius: scale(12),
        padding: scale(16),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    scheduleCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: scale(12),
        padding: scale(12),
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        marginBottom: verticalScale(8),
    },
    scheduleCardSelected: {
        borderColor: Colors.PRIMARY,
        backgroundColor: '#EFF6FF',
    },
    scheduleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedPill: {
        marginTop: verticalScale(6),
        backgroundColor: Colors.PRIMARY,
        paddingVertical: verticalScale(2),
        paddingHorizontal: scale(8),
        borderRadius: scale(5),
        alignSelf: 'flex-start',
    },
    seatHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(10),
    },
    seatCountBadge: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(4),
        borderRadius: scale(6),
    },
    busCabin: {
        backgroundColor: '#F8FAFC',
        borderRadius: scale(16),
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: scale(12),
        marginVertical: verticalScale(8),
    },
    seatFloor: {
        alignItems: 'center',
        paddingTop: verticalScale(8),
    },
    seatRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(8),
    },
    aisleTextWrapper: {
        width: scale(25),
        alignItems: 'center',
        justifyContent: 'center',
    },
    verticalText: {
        transform: [{ rotate: '-90deg' }],
        letterSpacing: 2,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: verticalScale(3),
    },
    termsBox: {
        backgroundColor: '#F0F7FF',
        borderRadius: scale(12),
        padding: scale(12),
        borderWidth: 1,
        borderColor: '#BFDBFE',
        marginVertical: verticalScale(4),
    },
    termsHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(8),
    },
    termsList: {
        gap: verticalScale(6),
    },
    termItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    termText: {
        flex: 1,
        lineHeight: scale(15),
    },
    confirmBtn: {
        marginTop: verticalScale(16),
    },
});

export default RescheduleTrip;
