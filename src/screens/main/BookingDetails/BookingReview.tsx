import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useStripe } from '@stripe/stripe-react-native';
import Toast from 'react-native-toast-message';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import Header from '../../../component/Header';
import colors, { Colors } from '../../../utils/colors';
import { BusSchedule } from '../../../interface/bus.interface';
import { PassengerDetail } from '../../../interface/booking.interface';
import { useBookSeats } from '../../../hooks/useBookSeats';
import { useCreatePaymentIntent } from '../../../hooks/useCreatePaymentIntent';
import PaymentOption from './PaymentOption';
import AppButton from '../../../component/common/AppButton';

const BookingReview = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { schedule, passengers, totalAmount }: { schedule: BusSchedule; passengers: PassengerDetail[]; totalAmount: number } = route.params;
    const { t } = useTranslation();

    const [paymentMethod, setPaymentMethod] = useState<'CreditCard'>('CreditCard');
    const { mutate: book, isPending: isBooking } = useBookSeats();
    const { mutateAsync: createPaymentIntent } = useCreatePaymentIntent();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        if (paymentMethod === 'CreditCard') {
            setLoading(true);
            try {
                const intentData: any = await createPaymentIntent({
                    scheduleId: schedule._id,
                    seatsCount: passengers.length
                });

                const clientSecret = intentData.clientSecret;
                const paymentIntentId = intentData.paymentIntentId;

                if (!clientSecret) {
                    setLoading(false);
                    Toast.show({ type: 'error', text1: 'Error', text2: 'Could not get payment secret' });
                    return;
                }

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

                const { error: presentError } = await presentPaymentSheet();

                if (presentError) {
                    setLoading(false);
                    Toast.show({ type: 'info', text1: 'Payment status', text2: 'Payment failed or cancelled' });
                } else {
                    book({
                        scheduleId: schedule._id,
                        seats: passengers,
                        paymentIntentId: paymentIntentId
                    }, {
                        onSuccess: (data) => {
                            setLoading(false);
                            navigation.navigate('BookingSuccess', { ticket: data.ticket });
                        },
                        onError: () => {
                            setLoading(false);
                        }
                    });
                }
            } catch (err: any) {
                setLoading(false);
                Toast.show({ type: 'error', text1: 'Error', text2: err.message || 'Payment initiation failed' });
            }
        }
    };

    return (
        <ScreenWrapper backgroundColor={Colors.BACKGROUND} header={<Header title={t('bookingReview_title') || 'Review Booking'} showBack={true} />} isLoading={isBooking || loading}>
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    <View style={styles.summaryCard}>
                        <AppText size={18} weight="700" color={Colors.PRIMARY} style={{ marginBottom: verticalScale(15) }}>
                            {t('bookingReview_tripSummary') || 'Trip Summary'}
                        </AppText>
                        <View style={styles.row}>
                            <AppText color={Colors.DARK_GRAY} weight="500">{t('bookingReview_route') || 'Route'}</AppText>
                            <AppText color={Colors.PRIMARY} weight="700">{schedule.fromCity} → {schedule.toCity}</AppText>
                        </View>
                        <View style={styles.row}>
                            <AppText color={Colors.DARK_GRAY} weight="500">{t('bookingReview_company') || 'Company'}</AppText>
                            <AppText color={Colors.PRIMARY} weight="700">{schedule.busName}</AppText>
                        </View>
                        <View style={styles.row}>
                            <AppText color={Colors.DARK_GRAY} weight="500">{t('bookingReview_departure') || 'Departure'}</AppText>
                            <AppText color={Colors.PRIMARY} weight="700">{schedule.departureTime}</AppText>
                        </View>

                        <View style={styles.divider} />

                        <AppText size={16} weight="700" color={Colors.PRIMARY} style={{ marginBottom: verticalScale(12) }}>
                            {t('bookingReview_passengers', { count: passengers.length }) || `Passengers (${passengers.length})`}
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
                            <AppText size={16} weight="700" color={Colors.PRIMARY}>{t('bookingReview_totalAmount') || 'Total Amount'}</AppText>
                            <AppText size={18} weight="800" color={Colors.PRIMARY}>PKR {totalAmount.toLocaleString()}</AppText>
                        </View>
                    </View>

                    <AppText size={16} weight="700" color={Colors.PRIMARY} style={styles.sectionTitle}>
                        {t('bookingReview_paymentMethod') || 'Payment Method'}
                    </AppText>

                    <PaymentOption
                        title="Stripe"
                        selected={paymentMethod === 'CreditCard'}
                        onSelect={() => setPaymentMethod('CreditCard')}
                        icon="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/512px-Stripe_Logo%2C_revised_2016.svg.png"
                    />

                </ScrollView>

                <View style={styles.footer}>
                    <AppButton
                        title={isBooking || loading ? t('bookingReview_processing') || 'Processing...' : t('bookingReview_confirmButton') || 'Confirm Booking'}
                        onPress={handlePayment}
                        loading={isBooking || loading}
                        style={styles.button}
                    />
                </View>
            </View>
        </ScreenWrapper>
    );
};

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
        backgroundColor: '#172C6B',
        paddingHorizontal: scale(8),
        paddingVertical: scale(4),
        borderRadius: scale(6),
        marginRight: scale(10),
    },
    sectionTitle: {
        marginBottom: verticalScale(15),
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
