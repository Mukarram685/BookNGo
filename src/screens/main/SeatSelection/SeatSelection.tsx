import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import Header from '../../../component/Header';
import Colors from '../../../utils/Colors.util';
import SeatItem from '../../../component/Seat/SeatItem';
import SeatLegend from '../../../component/Seat/SeatLegend';
import CabinHeader from '../../../component/Seat/CabinHeader';
import { BusSchedule } from '../../../interface/bus.interface';
import { useGetSchedule } from '../../../hooks/useGetSchedule';

const SeatSelection = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { schedule: initialSchedule }: { schedule: BusSchedule } = route.params;
    const { t } = useTranslation();

    const { data: schedule = initialSchedule, isLoading } = useGetSchedule(initialSchedule?._id);
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

    const bookedSeats = schedule?.bookedSeats || [];

    const toggleSeat = useCallback((seatNumber: number) => {
        setSelectedSeats(prev => {
            if (prev.includes(seatNumber)) {
                return prev.filter(s => s !== seatNumber);
            } else {
                if (prev.length < 10) {
                    return [...prev, seatNumber];
                }
                return prev;
            }
        });
    }, []);

    const seatsGrid = useMemo(() => {
        const totalSeats = schedule?.totalSeats;
        const layout = schedule?.seatLayout || '2x2';

        if (!totalSeats) return null;

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
                            status={bookedSeats.includes(seatNum) ? 'booked' : selectedSeats.includes(seatNum) ? 'selected' : 'available'}
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
                                status={bookedSeats.includes(seatNum) ? 'booked' : selectedSeats.includes(seatNum) ? 'selected' : 'available'}
                                onPress={toggleSeat}
                            />
                        );
                    }
                }

                if (i === Math.floor(rows / 2)) {
                    rowSeats.push(
                        <View key={`aisle-${i}`} style={styles.aisleTextWrapper}>
                            <AppText size={9} color={Colors.TEXT_GREY} weight="600" style={styles.verticalText}>
                                AISLE
                            </AppText>
                        </View>
                    );
                } else {
                    rowSeats.push(<View key={`aisle-${i}`} style={{ width: scale(25) }} />);
                }

                for (let j = 0; j < rightSide; j++) {
                    const seatNum = i * seatsPerRow + leftSide + j + 1;
                    if (seatNum <= totalSeats) {
                        rowSeats.push(
                            <SeatItem
                                key={seatNum}
                                seatNumber={seatNum}
                                status={bookedSeats.includes(seatNum) ? 'booked' : selectedSeats.includes(seatNum) ? 'selected' : 'available'}
                                onPress={toggleSeat}
                            />
                        );
                    }
                }
            }

            grid.push(
                <View key={`row-${i}`} style={styles.row}>
                    {rowSeats}
                </View>
            );
        }

        return grid;
    }, [schedule, bookedSeats, selectedSeats, toggleSeat]);

    return (
        <ScreenWrapper backgroundColor={Colors.BACKGROUND} header={<Header title={t('seatSelection_title') || 'Select Seats'} showBack={true} />}>            
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={Colors.PRIMARY} />
                </View>
            )}

            <View style={styles.content}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    
                    <SeatLegend />
                    <View style={styles.busCabin}>
                        <CabinHeader />
                        <View style={styles.seatFloor}>
                            {seatsGrid}
                        </View>
                    </View>
                    {/* <BusDetailsCard /> */}

                </ScrollView>

                <View style={styles.checkoutWrapper}>
                    <View style={styles.checkoutContent}>
                        <View>
                            <AppText size={11} color={Colors.TEXT_GREY} weight="700">
                                SELECTED SEATS ({selectedSeats.length})
                            </AppText>
                            <AppText size={18} weight="800" color={Colors.PRIMARY} style={{ marginTop: 2 }}>
                                PKR {(selectedSeats.length * schedule.price).toLocaleString()}
                            </AppText>
                        </View>
                        <TouchableOpacity
                            style={[styles.payButton, selectedSeats.length === 0 && { opacity: 0.5 }]}
                            disabled={selectedSeats.length === 0}
                            onPress={() => navigation.navigate('PassengerDetails', { schedule, selectedSeats })}
                        >
                            <AppText size={15} weight="700" color={Colors.WHITE}>
                                Proceed
                            </AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(120),
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.4)',
        zIndex: 999,
        justifyContent: 'center',
        alignItems: 'center',
    },
    busCabin: {
        backgroundColor: Colors.SURFACE,
        borderRadius: scale(32),
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        paddingBottom: verticalScale(25),
        paddingTop: verticalScale(15),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
        marginBottom: verticalScale(15),
    },
    seatFloor: {
        paddingHorizontal: scale(15),
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(6),
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
    checkoutWrapper: {
        position: 'absolute',
        bottom: verticalScale(15),
        left: 0,
        right: 0,
    },
    checkoutContent: {
        backgroundColor: Colors.SURFACE,
        borderRadius: scale(20),
        paddingVertical: verticalScale(16),
        paddingHorizontal: scale(20),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 8,
    },
    payButton: {
        backgroundColor: '#172C6B', // Matches primary brand navy
        paddingHorizontal: scale(28),
        paddingVertical: verticalScale(12),
        borderRadius: scale(10),
    },
});

export default SeatSelection;
