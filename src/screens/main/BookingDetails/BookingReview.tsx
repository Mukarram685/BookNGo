import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, StatusBar } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import Header from '../../../component/Header';
import Colors from '../../../utils/Colors.util';
import { BusSchedule } from '../../../interface/bus.interface';
import { PassengerDetail } from '../../../interface/booking.interface';
import { useBookSeats } from '../../../hooks/useBookSeats';
import PaymentOption from './PaymentOption';

const BookingReview = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { schedule, passengers, totalAmount }: { schedule: BusSchedule; passengers: PassengerDetail[]; totalAmount: number } = route.params;

    const [paymentMethod, setPaymentMethod] = useState<'JazzCash' | 'EasyPaisa' | 'CreditCard'>('JazzCash');
    const { mutate: book, isPending } = useBookSeats();

    const handlePayment = () => {
        book({
            scheduleId: schedule._id,
            seats: passengers
        }, {
            onSuccess: (data) => {
                navigation.navigate('BookingSuccess', { ticket: data.ticket });
            }
        });
    };

    return (
        <ScreenWrapper backgroundColor={Colors.BACKGROUND} header={<Header title="Review Booking" showBack={true} />} isLoading={isPending}>
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* Summary Card */}
                    <View style={styles.summaryCard}>
                        <AppText size={18} weight="700" color={Colors.PRIMARY} style={{ marginBottom: verticalScale(15) }}>
                            Trip Summary
                        </AppText>
                        <View style={styles.row}>
                            <AppText color={Colors.DARK_GRAY} weight="500">Route</AppText>
                            <AppText color={Colors.PRIMARY} weight="700">{schedule.fromCity} → {schedule.toCity}</AppText>
                        </View>
                        <View style={styles.row}>
                            <AppText color={Colors.DARK_GRAY} weight="500">Company</AppText>
                            <AppText color={Colors.PRIMARY} weight="700">{schedule.busName}</AppText>
                        </View>
                        <View style={styles.row}>
                            <AppText color={Colors.DARK_GRAY} weight="500">Departure</AppText>
                            <AppText color={Colors.PRIMARY} weight="700">{schedule.departureTime}</AppText>
                        </View>

                        <View style={styles.divider} />

                        <AppText size={16} weight="700" color={Colors.PRIMARY} style={{ marginBottom: verticalScale(12) }}>
                            Passengers ({passengers.length})
                        </AppText>
                        {passengers.map((p, index) => (
                            <View key={index} style={styles.passengerItem}>
                                <View style={styles.passengerInfo}>
                                    <View style={styles.seatBadgeSmall}>
                                        <AppText size={10} weight="800" color={Colors.WHITE}>Seat {p.seatNumber}</AppText>
                                    </View>
                                    <View>
                                        <AppText size={14} weight="700" color={Colors.PRIMARY}>{p.passengerName}</AppText>
                                        <AppText size={12} color={Colors.TEXT_GREY}>{p.passengerCNIC}</AppText>
                                    </View>
                                </View>
                                <AppText size={13} color={Colors.DARK_GRAY} weight="600">{p.gender}</AppText>
                            </View>
                        ))}

                        <View style={styles.divider} />

                        <View style={[styles.row, { marginBottom: 0 }]}>
                            <AppText size={16} weight="700" color={Colors.PRIMARY}>Total Amount</AppText>
                            <AppText size={18} weight="800" color={Colors.PRIMARY}>PKR {totalAmount.toLocaleString()}</AppText>
                        </View>
                    </View>

                    {/* Payment Methods */}
                    <AppText size={16} weight="700" color={Colors.PRIMARY} style={styles.sectionTitle}>
                        Payment Method
                    </AppText>

                     <PaymentOption
                        title="Stripe"
                        selected={paymentMethod === 'CreditCard'}
                        onSelect={() => setPaymentMethod('CreditCard')}
                        icon="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/512px-Stripe_Logo%2C_revised_2016.svg.png"
                    />
                    {/* <PaymentOption
                        title="EasyPaisa"
                        selected={paymentMethod === 'EasyPaisa'}
                        onSelect={() => setPaymentMethod('EasyPaisa')}
                        icon="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6A6sYx0z9r9y7wGf9uHn8N-zVfG9_oWfXfg&s"
                    />
                    <PaymentOption
                        title="Credit / Debit Card"
                        selected={paymentMethod === 'CreditCard'}
                        onSelect={() => setPaymentMethod('CreditCard')}
                    /> */}

                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.button} onPress={handlePayment}>
                        <AppText size={16} weight="700" color={Colors.WHITE}>Confirm Booking</AppText>
                    </TouchableOpacity>
                </View>
            </View>
        </ScreenWrapper>
    );
};

// const PaymentOption = ({ title, selected, onSelect, icon }: any) => (
//     <TouchableOpacity
//         style={[styles.paymentCard, selected && styles.paymentCardSelected]}
//         onPress={onSelect}
//         activeOpacity={0.7}
//     >
//         <View style={styles.paymentInfo}>
//             {icon && <Image source={{ uri: icon }} style={styles.paymentIcon} />}
//             <AppText color={selected ? Colors.PRIMARY : Colors.DARK_GRAY} weight={selected ? "700" : "500"}>
//                 {title}
//             </AppText>
//         </View>
//         <View style={[styles.radio, selected && styles.radioSelected]}>
//             {selected && <View style={styles.radioInner} />}
//         </View>
//     </TouchableOpacity>
// );

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: verticalScale(15),
        paddingBottom: verticalScale(100),
    },
    summaryCard: {
        backgroundColor: Colors.SURFACE,
        borderRadius: scale(16),
        padding: scale(20),
        marginBottom: verticalScale(25),
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(10),
    },
    divider: {
        height: 1,
        backgroundColor: Colors.BORDER_GREY,
        marginVertical: verticalScale(15),
    },
    passengerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(12),
        backgroundColor: '#F8FAFF',
        padding: scale(10),
        borderRadius: scale(10),
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
    },
    passengerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    seatBadgeSmall: {
        backgroundColor: '#172C6B', // Navy accent
        paddingHorizontal: scale(8),
        paddingVertical: scale(4),
        borderRadius: scale(6),
        marginRight: scale(10),
    },
    sectionTitle: {
        marginBottom: verticalScale(15),
    },
    paymentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.SURFACE,
        padding: scale(15),
        borderRadius: scale(12),
        marginBottom: verticalScale(12),
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 4,
        elevation: 1,
    },
    paymentCardSelected: {
        borderColor: '#172C6B',
        backgroundColor: 'rgba(23, 44, 107, 0.05)',
    },
    paymentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paymentIcon: {
        width: scale(30),
        height: scale(20),
        resizeMode: 'contain',
        marginRight: scale(12),
    },
    radio: {
        width: scale(20),
        height: scale(20),
        borderRadius: scale(10),
        borderWidth: 2,
        borderColor: Colors.TEXT_GREY,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioSelected: {
        borderColor: '#172C6B',
    },
    radioInner: {
        width: scale(10),
        height: scale(10),
        borderRadius: scale(5),
        backgroundColor: '#172C6B',
    },
    footer: {
        position: 'absolute',
        bottom: verticalScale(20),
        left: scale(20),
        right: scale(20),
    },
    button: {
        backgroundColor: '#172C6B',
        paddingVertical: verticalScale(14),
        borderRadius: scale(12),
        alignItems: 'center',
        shadowColor: Colors.PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
});

export default BookingReview;


export default BookingReview;
