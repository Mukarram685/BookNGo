import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import Header from '../../../component/Header';
import Colors, { alpha } from '../../../utils/Colors.util';
import { BusSchedule } from '../../../interface/bus.interface';
import { PassengerDetail } from '../../../interface/booking.interface';
import { useBookSeats } from '../../../hooks/useBookSeats';
import { useCreatePaymentIntent } from '../../../hooks/useCreatePaymentIntent';
import { useCancelBooking } from '../../../hooks/useCancelBooking';
import { useStripe } from '@stripe/stripe-react-native';
import Toast from 'react-native-toast-message';

const BookingReview = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { schedule, passengers, totalAmount }: { schedule: BusSchedule; passengers: PassengerDetail[]; totalAmount: number } = route.params;
    const { t } = useTranslation();

    const [paymentMethod, setPaymentMethod] = useState<'JazzCash' | 'EasyPaisa' | 'CreditCard'>('JazzCash');
    const { mutate: book, isPending: isBooking } = useBookSeats();
    const { mutateAsync: createPaymentIntent } = useCreatePaymentIntent();
    const { mutate: cancelBooking } = useCancelBooking();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        if (paymentMethod === 'CreditCard') {
            setLoading(true);
            try {
                book({
                    scheduleId: schedule._id,
                    seats: passengers
                }, {
                    onSuccess: async (data) => {
                        try {
                            // 2. Create Payment Intent
                            const intentData: any = await createPaymentIntent(data.ticket.bookingId);
                            // intentData is already response.data because of axiosInstance interceptor
                            const clientSecret = intentData.clientSecret;

                            if (!clientSecret) {
                                setLoading(false);
                                Toast.show({ type: 'error', text1: 'Error', text2: 'Could not get payment secret' });
                                return;
                            }

                            // 3. Initialize Payment Sheet
                            const { error: initError } = await initPaymentSheet({
                                paymentIntentClientSecret: clientSecret,
                                merchantDisplayName: 'BookNGo',
                                returnURL: 'bookngo://stripe-redirect',
                                defaultBillingDetails: {
                                    name: passengers[0].passengerName,
                                },
                            });

                            if (initError) {
                                setLoading(false);
                                Toast.show({ type: 'error', text1: 'Payment status', text2: initError.message });
                                return;
                            }

                            // 4. Present Payment Sheet
                            const { error: presentError } = await presentPaymentSheet();

                            if (presentError) {
                                setLoading(false);
                                // If user cancels or payment fails, we cancel the booking to free seats
                                cancelBooking({
                                    bookingId: data.ticket.bookingId,
                                    reason: 'Payment failed or cancelled by user'
                                });
                                Toast.show({ type: 'info', text1: 'Payment status', text2: 'Booking cancelled due to payment failure/dismissal' });
                            } else {
                                setLoading(false);
                                navigation.navigate('BookingSuccess', { ticket: data.ticket });
                            }
                        } catch (err: any) {
                            setLoading(false);
                            Toast.show({ type: 'error', text1: 'Error', text2: err.message || 'Payment initiation failed' });
                        }
                    },
                    onError: () => setLoading(false)
                });
            } catch (error) {
                setLoading(false);
            }
        } else {
            // Simulated JazzCash / EasyPaisa flow
            book({
                scheduleId: schedule._id,
                seats: passengers
            }, {
                onSuccess: (data) => {
                    navigation.navigate('BookingSuccess', { ticket: data.ticket });
                }
            });
        }
    };

    return (
        <ScreenWrapper backgroundColor={Colors.DARK_BG} header={<Header title={t('bookingReview_title')} />} isLoading={isBooking || loading}>
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    <View style={styles.summaryCard}>
                        <AppText size={18} weight="700" color={Colors.WHITE} style={{ marginBottom: verticalScale(15) }}>
                            {t('bookingReview_tripSummary')}
                        </AppText>
                        <View style={styles.row}>
                            <AppText color={Colors.TEXT_GREY}>{t('bookingReview_route')}</AppText>
                            <AppText color={Colors.WHITE} weight="600">{schedule.fromCity} → {schedule.toCity}</AppText>
                        </View>
                        <View style={styles.row}>
                            <AppText color={Colors.TEXT_GREY}>{t('bookingReview_company')}</AppText>
                            <AppText color={Colors.WHITE} weight="600">{schedule.busName}</AppText>
                        </View>
                        <View style={styles.row}>
                            <AppText color={Colors.TEXT_GREY}>{t('bookingReview_departure')}</AppText>
                            <AppText color={Colors.WHITE} weight="600">{schedule.departureTime}</AppText>
                        </View>

                        <View style={styles.divider} />

                        <AppText size={16} weight="700" color={Colors.WHITE} style={{ marginBottom: verticalScale(10) }}>
                            {t('bookingReview_passengers', { count: passengers.length })}
                        </AppText>
                        {passengers.map((p, index) => (
                            <View key={index} style={styles.passengerItem}>
                                <View style={styles.passengerInfo}>
                                    <View style={styles.seatBadgeSmall}>
                                        <AppText size={10} weight="800" color={Colors.WHITE}>S-{p.seatNumber}</AppText>
                                    </View>
                                    <View>
                                        <AppText size={14} weight="600" color={Colors.WHITE}>{p.passengerName}</AppText>
                                        <AppText size={12} color={Colors.TEXT_GREY}>{p.passengerCNIC}</AppText>
                                    </View>
                                </View>
                                <AppText size={14} color={Colors.TEXT_GREY}>{p.gender}</AppText>
                            </View>
                        ))}

                        <View style={styles.divider} />

                        <View style={[styles.row, { marginBottom: 0 }]}>
                            <AppText size={16} weight="700" color={Colors.WHITE}>{t('bookingReview_totalAmount')}</AppText>
                            <AppText size={20} weight="800" color={Colors.BRIGHT_BLUE}>{'PKR ' + totalAmount.toLocaleString()}</AppText>
                        </View>
                    </View>

                    <AppText size={16} weight="700" color={Colors.WHITE} style={styles.sectionTitle}>
                        {t('bookingReview_paymentMethod')}
                    </AppText>

                    <PaymentOption
                        title={t('bookingReview_jazzCash')}
                        selected={paymentMethod === 'JazzCash'}
                        onSelect={() => setPaymentMethod('JazzCash')}
                        icon="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6-mX_cE8yX1yGzkV9pL0W0-m0Y0P9Uqf-0A&s"
                    />
                    <PaymentOption
                        title={t('bookingReview_easyPaisa')}
                        selected={paymentMethod === 'EasyPaisa'}
                        onSelect={() => setPaymentMethod('EasyPaisa')}
                        icon="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6A6sYx0z9r9y7wGf9uHn8N-zVfG9_oWfXfg&s"
                    />
                    <PaymentOption
                        title="Stripe"
                        selected={paymentMethod === 'CreditCard'}
                        onSelect={() => setPaymentMethod('CreditCard')}
                        icon="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/512px-Stripe_Logo%2C_revised_2016.svg.png"
                    />

                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.button} onPress={handlePayment} disabled={isBooking || loading}>
                        <AppText size={16} weight="700" color={Colors.WHITE}>
                            {isBooking || loading ? t('bookingReview_processing') : t('bookingReview_confirmButton')}
                        </AppText>
                    </TouchableOpacity>
                </View>
            </View>
        </ScreenWrapper>
    );
};

const PaymentOption = ({ title, selected, onSelect, icon }: any) => (
    <TouchableOpacity
        style={[styles.paymentCard, selected && styles.paymentCardSelected]}
        onPress={onSelect}
        activeOpacity={0.7}
    >
        <View style={styles.paymentInfo}>
            {icon && <Image source={{ uri: icon }} style={styles.paymentIcon} />}
            <AppText color={selected ? Colors.WHITE : Colors.TEXT_GREY} weight={selected ? "700" : "500"}>
                {title}
            </AppText>
        </View>
        <View style={[styles.radio, selected && styles.radioSelected]}>
            {selected && <View style={styles.radioInner} />}
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: scale(20),
    },
    scrollContent: {
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(100),
    },
    summaryCard: {
        backgroundColor: alpha(Colors.WHITE, 0.05),
        borderRadius: scale(15),
        padding: scale(20),
        marginBottom: verticalScale(30),
        borderWidth: 1,
        borderColor: alpha(Colors.WHITE, 0.05),
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: verticalScale(10),
    },
    divider: {
        height: 1,
        backgroundColor: alpha(Colors.WHITE, 0.1),
        marginVertical: verticalScale(15),
    },
    passengerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(12),
        backgroundColor: alpha(Colors.WHITE, 0.02),
        padding: scale(8),
        borderRadius: scale(8),
    },
    passengerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    seatBadgeSmall: {
        backgroundColor: Colors.BRIGHT_BLUE,
        paddingHorizontal: scale(6),
        paddingVertical: scale(2),
        borderRadius: scale(4),
        marginRight: scale(10),
    },
    sectionTitle: {
        marginBottom: verticalScale(15),
    },
    paymentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: alpha(Colors.WHITE, 0.03),
        padding: scale(15),
        borderRadius: scale(12),
        marginBottom: verticalScale(12),
        borderWidth: 1,
        borderColor: alpha(Colors.WHITE, 0.03),
    },
    paymentCardSelected: {
        borderColor: alpha(Colors.BRIGHT_BLUE, 0.5),
        backgroundColor: alpha(Colors.BRIGHT_BLUE, 0.05),
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
        borderColor: Colors.BRIGHT_BLUE,
    },
    radioInner: {
        width: scale(10),
        height: scale(10),
        borderRadius: scale(5),
        backgroundColor: Colors.BRIGHT_BLUE,
    },
    footer: {
        position: 'absolute',
        bottom: verticalScale(20),
        left: scale(20),
        right: scale(20),
    },
    button: {
        backgroundColor: Colors.BRIGHT_BLUE,
        paddingVertical: verticalScale(14),
        borderRadius: scale(12),
        alignItems: 'center',
    },
});

export default BookingReview;
