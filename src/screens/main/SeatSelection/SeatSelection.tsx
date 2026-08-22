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
import { Seat as SeatIcon, Arrow as ArrowIcon } from '../../../assets/svg';

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
        <ScreenWrapper 
            backgroundColor="#F8FAFC" 
            header={
                <Header 
                    title={t('seatSelection_title') || 'Select Seats'} 
                    subtitle={t('choose_preferred_seats') || 'Choose your preferred seats'}
                    showBack={true} 
                />
            }
        >            
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#0052CC" />
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

                </ScrollView>

                <View style={styles.checkoutWrapper}>
                    <View style={styles.checkoutContent}>
                        <View style={styles.selectedSeatsInfo}>
                            <View style={styles.seatBadgeGreen}>
                                <SeatIcon width={scale(20)} height={scale(20)} color="#16A34A" />
                            </View>
                            <View>
                                <AppText size={13} color={selectedSeats.length > 0 ? "#16A34A" : "#64748B"} weight="800">
                                    {selectedSeats.length === 0
                                        ? "No Seat Selected"
                                        : `${selectedSeats.length} Seat${selectedSeats.length > 1 ? 's' : ''} Selected`}
                                </AppText>
                                <AppText size={12} color="#334155" weight="600" style={{ marginTop: 1 }}>
                                    {selectedSeats.length === 0
                                        ? "Tap a seat to select"
                                        : `Seat ${selectedSeats.join(', ')}`}
                                </AppText>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.payButton, selectedSeats.length === 0 && { opacity: 0.5 }]}
                            disabled={selectedSeats.length === 0}
                            activeOpacity={0.85}
                            onPress={() => navigation.navigate('PassengerDetails', { schedule, selectedSeats })}
                        >
                            <AppText size={14} weight="800" color="#FFFFFF">
                                {t('seatSelection_proceed') || "Continue"}
                            </AppText>
                            <ArrowIcon
                                width={scale(13)}
                                height={scale(13)}
                                fill="#FFFFFF"
                                style={{ transform: [{ rotate: '180deg' }], marginLeft: scale(6) }}
                            />
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
        backgroundColor: '#FFFFFF',
        borderRadius: scale(24),
        borderWidth: 1,
        borderColor: '#E2E8F0',
        paddingBottom: verticalScale(20),
        paddingTop: verticalScale(12),
        shadowColor: '#0052CC',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        marginBottom: verticalScale(15),
    },
    seatFloor: {
        paddingHorizontal: scale(10),
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(4),
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
        backgroundColor: '#FFFFFF',
        borderRadius: scale(20),
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(16),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#0052CC',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 6,
    },
    selectedSeatsInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: scale(10),
    },
    seatBadgeGreen: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(14),
        backgroundColor: '#DCFCE7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(10),
    },
    payButton: {
        backgroundColor: '#0052CC',
        paddingHorizontal: scale(20),
        paddingVertical: verticalScale(11),
        borderRadius: scale(12),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#0052CC',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
});

export default SeatSelection;
