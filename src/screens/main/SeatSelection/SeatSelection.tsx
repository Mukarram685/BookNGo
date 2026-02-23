import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();

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
        <ScreenWrapper backgroundColor={Colors.DARK_BG} header={<Header title={t('seatSelection_title')} showBack={true} />}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
            <View style={styles.content}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.headerInfo}>
                        <AppText size={14} color={Colors.TEXT_GREY}>{schedule.fromCity} → {schedule.toCity}</AppText>
                        <View style={styles.busMeta}>
                            <View style={styles.metaItem}>
                                <AppText size={10} color={Colors.TEXT_GREY}>{t('seatSelection_company')}</AppText>
                                <AppText size={14} weight="700" color={Colors.WHITE}>{schedule.busName}</AppText>
                            </View>
                            <View style={styles.metaItem}>
                                <AppText size={10} color={Colors.TEXT_GREY}>{t('seatSelection_date')}</AppText>
                                <AppText size={14} weight="700" color={Colors.WHITE}>{new Date(schedule.date).toDateString()}</AppText>
                            </View>
                        </View>
                    </View>

                    <View style={styles.legendWrapper}>
                        <LegendItem label={t('seatSelection_available')} color={Colors.INPUT_BG} dot={Colors.BRIGHT_BLUE} />
                        <LegendItem label={t('seatSelection_selected')} color={Colors.BRIGHT_BLUE} dot={Colors.WHITE} />
                        <LegendItem label={t('seatSelection_booked')} color="#2C3E50" dot={Colors.RED} />
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
                            <AppText size={12} color={Colors.TEXT_GREY}>{t('seatSelection_selectedSeats', { count: selectedSeats.length })}</AppText>
                            <AppText size={20} weight="800" color={Colors.WHITE}>
                                {'PKR ' + (selectedSeats.length * schedule.price).toLocaleString()}
                            </AppText>
                        </View>
                        <TouchableOpacity
                            style={[styles.payButton, selectedSeats.length === 0 && { opacity: 0.5 }]}
                            disabled={selectedSeats.length === 0}
                            onPress={() => navigation.navigate('PassengerDetails', { schedule, selectedSeats })}
                        >
                            <AppText size={16} weight="700" color={Colors.WHITE}>{t('seatSelection_proceed')}</AppText>
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
        backgroundColor: alpha(Colors.INPUT_BG, 0.4),
        padding: scale(15),
        borderRadius: scale(12),
        borderWidth: 1,
        borderColor: alpha(Colors.WHITE, 0.03),
    },
    busMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: verticalScale(15),
        borderTopWidth: 1,
        borderTopColor: alpha(Colors.WHITE, 0.05),
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
        marginTop: verticalScale(10),
        backgroundColor: '#0F1A2E',
        borderRadius: scale(30),
        borderWidth: 2,
        borderColor: alpha(Colors.BRIGHT_BLUE, 0.1),
        paddingBottom: verticalScale(20),
    },
    driverSection: {
        padding: scale(25),
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: alpha(Colors.WHITE, 0.05),
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
        backgroundColor: alpha('#1B2636', 0.98),
        borderRadius: scale(20),
        padding: scale(20),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: alpha(Colors.WHITE, 0.08),
        shadowColor: Colors.BLACK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
    },
    payButton: {
        backgroundColor: Colors.BRIGHT_BLUE,
        paddingHorizontal: scale(30),
        paddingVertical: verticalScale(12),
        borderRadius: scale(12),
        shadowColor: Colors.BRIGHT_BLUE,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 5,
    }
});

export default SeatSelection;
