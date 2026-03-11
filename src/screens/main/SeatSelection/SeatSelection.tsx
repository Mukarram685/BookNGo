import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import Header from '../../../component/Header';
import Colors, { alpha } from '../../../utils/Colors.util';
import SeatItem from '../../../component/Seat/SeatItem';
import { BusSchedule } from '../../../interface/bus.interface';


const SeatSelection = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { schedule }: { schedule: BusSchedule } = route.params;

    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

    const bookedSeats = schedule?.bookedSeats || [];
    console.log('--- Seat Selection Debug ---');
    console.log('Schedule ID:', schedule?._id);
    console.log('Booked Seats received:', bookedSeats);

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

            // Left Side
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

            // Aisle
            rowSeats.push(<View key={`aisle-${i}`} style={{ width: scale(35) }} />);

            // Right Side
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

            grid.push(
                <View key={`row-${i}`} style={styles.row}>
                    {rowSeats}
                </View>
            );
        }

        return grid;
    }, [schedule, bookedSeats, selectedSeats, toggleSeat]);

    return (
        <ScreenWrapper backgroundColor={Colors.BACKGROUND} header={<Header title="Choose Seat" showBack={true} />}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.PRIMARY} />
            <View style={styles.content}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.headerInfo}>
                        <AppText size={14} color={Colors.DARK_GRAY} weight="600">{schedule.fromCity} → {schedule.toCity}</AppText>
                        <View style={styles.busMeta}>
                            <View style={styles.metaItem}>
                                <AppText size={10} color={Colors.TEXT_GREY} weight="700">COMPANY</AppText>
                                <AppText size={14} weight="800" color={Colors.PRIMARY}>{schedule.busName}</AppText>
                            </View>
                            <View style={styles.metaItem}>
                                <AppText size={10} color={Colors.TEXT_GREY} weight="700">DATE</AppText>
                                <AppText size={14} weight="800" color={Colors.PRIMARY}>{new Date(schedule.date).toDateString()}</AppText>
                            </View>
                        </View>
                    </View>

                    <View style={styles.legendWrapper}>
                        <LegendItem label="Available" color={Colors.SURFACE} dot={Colors.SECONDARY} />
                        <LegendItem label="Selected" color={Colors.SECONDARY} dot={Colors.WHITE} />
                        <LegendItem label="Booked" color={Colors.BORDER_GREY} dot={Colors.RED} />
                    </View>

                    <View style={styles.busCabin}>
                        <View style={styles.driverSection}>
                            <View style={styles.dashboard}>
                                <View style={styles.steeringWheel} />
                                <View style={styles.speedometer} />
                            </View>
                            <View style={styles.entrance} />
                        </View>

                        <View style={styles.seatFloor}>
                            {seatsGrid}
                        </View>
                    </View>
                </ScrollView>

                <View style={styles.checkoutWrapper}>
                    <View style={styles.checkoutContent}>
                        <View>
                            <AppText size={12} color={Colors.TEXT_GREY} weight="700">SELECTED SEATS ({selectedSeats.length})</AppText>
                            <AppText size={20} weight="800" color={Colors.PRIMARY}>
                                PKR {(selectedSeats.length * schedule.price).toLocaleString()}
                            </AppText>
                        </View>
                        <TouchableOpacity
                            style={[styles.payButton, selectedSeats.length === 0 && { opacity: 0.5 }]}
                            disabled={selectedSeats.length === 0}
                            onPress={() => navigation.navigate('PassengerDetails', { schedule, selectedSeats })}
                        >
                            <AppText size={16} weight="700" color={Colors.WHITE}>Proceed</AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScreenWrapper>
    );
};

const LegendItem = ({ label, color, dot }: any) => (
    <View style={styles.legendItem}>
        <View style={[styles.legendIndicator, { backgroundColor: color, borderColor: alpha(dot, 0.4) }]}>
            <View style={[styles.legendDot, { backgroundColor: dot }]} />
        </View>
        <AppText size={11} color={Colors.TEXT_GREY} weight="500">{label}</AppText>
    </View>
);

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    headerWrapper: {
        paddingTop: verticalScale(10),
    },
    headerInfo: {
        alignItems: 'center',
        marginTop: verticalScale(10),
        backgroundColor: Colors.SURFACE,
        padding: scale(18),
        borderRadius: scale(16),
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
    },
    busMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: verticalScale(15),
        borderTopWidth: 1,
        borderTopColor: Colors.BORDER_GREY,
        paddingTop: verticalScale(10),
    },
    metaItem: {
        alignItems: 'center',
    },
    legendWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: verticalScale(20),
        marginBottom: verticalScale(10),
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: scale(12),
    },
    legendIndicator: {
        width: scale(14),
        height: scale(14),
        borderRadius: 4,
        borderWidth: 1,
        marginRight: scale(6),
        justifyContent: 'center',
        alignItems: 'center',
    },
    legendDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
    },
    scrollContent: {
        paddingBottom: verticalScale(120),
    },
    busCabin: {
        marginTop: verticalScale(15),
        backgroundColor: Colors.SURFACE,
        borderRadius: scale(35),
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        paddingBottom: verticalScale(20),
        shadowColor: Colors.PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    driverSection: {
        padding: scale(25),
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: Colors.BORDER_GREY,
    },
    dashboard: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    steeringWheel: {
        width: scale(30),
        height: scale(30),
        borderRadius: scale(15),
        borderWidth: 4,
        borderColor: '#34495E',
        marginRight: scale(10),
    },
    speedometer: {
        width: scale(20),
        height: scale(8),
        backgroundColor: '#34495E',
        borderRadius: 4,
    },
    entrance: {
        width: scale(40),
        height: 4,
        backgroundColor: alpha(Colors.BRIGHT_BLUE, 0.3),
        borderRadius: 2,
    },
    seatFloor: {
        paddingTop: verticalScale(20),
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(8),
    },
    checkoutWrapper: {
        position: 'absolute',
        bottom: verticalScale(20),
        width: '100%',
    },
    checkoutContent: {
        backgroundColor: Colors.SURFACE,
        borderRadius: scale(24),
        padding: scale(22),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        shadowColor: Colors.PRIMARY,
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 10,
    },
    payButton: {
        backgroundColor: Colors.SECONDARY,
        paddingHorizontal: scale(32),
        paddingVertical: verticalScale(14),
        borderRadius: scale(14),
        shadowColor: Colors.SECONDARY,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    }
});

export default SeatSelection;
