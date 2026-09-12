import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Platform } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
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
import { formatCNIC } from '../../../helpers/auth.helper';
import { useBookSeats } from '../../../hooks/useBookSeats';
import { useCreatePaymentIntent } from '../../../hooks/useCreatePaymentIntent';
import {
    Bus as BusIcon,
    LocationB,
    User,
    TotalFareTag,
    PaymentCard,
    JourneyCalendar,
    Clock,
    BusSeatOutline,
    Wallet,
    ShieldCheck,
} from '../../../assets/svg';

const BookingReview = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const {
        schedule,
        passengers = [],
        isGroupBooking,
        totalAmount: passedTotalAmount,
    }: {
        schedule: any;
        passengers: PassengerDetail[];
        isGroupBooking?: boolean;
        totalAmount: number;
    } = route?.params || {};

    const { t } = useTranslation();

    const [paymentMethod, setPaymentMethod] = useState<'CreditCard' | 'Wallet'>('CreditCard');
    const { mutate: book, isPending: isBooking } = useBookSeats();
    const { mutateAsync: createPaymentIntent } = useCreatePaymentIntent();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);

    // Schedule & Route calculation
    const departureDateObj = schedule?.departureDate ? new Date(schedule.departureDate) : new Date();
    const displayDate = departureDateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const displayDayOfWeek = departureDateObj.toLocaleDateString('en-US', { weekday: 'long' });

    const displayDepartureTime = schedule?.departureTime || '08:00';
    const displayDepartureTimeAMPM = displayDepartureTime.includes('AM') || displayDepartureTime.includes('PM')
        ? displayDepartureTime
        : `${displayDepartureTime} AM`;
    const displayArrivalTime = schedule?.arrivalTime || '23:00';
    const displayDuration = schedule?.route?.duration || '4h';

    const displayFromCity = schedule?.fromCity || schedule?.route?.fromCity || 'Lahore';
    const displayToCity = schedule?.toCity || schedule?.route?.toCity || 'Karachi';
    const displayFromTerminal = `${displayFromCity} Terminal`;
    const displayToTerminal = `${displayToCity} Terminal`;

    const seatsList = (passengers || []).map((p) => p.seatNumber);
    const formattedSeatsList = seatsList.length > 0 ? seatsList.join(', ') : '12, 13';

    const isGroup =
        isGroupBooking !== undefined
            ? isGroupBooking
            : passengers.length > 1 &&
              passengers.every(
                  (p) =>
                      (p.passengerName || '') === (passengers[0]?.passengerName || '') &&
                      (p.passengerCNIC || '') === (passengers[0]?.passengerCNIC || '')
              );

    // Pricing calculation
    const perSeatPrice = schedule?.fare || schedule?.price || 2500;
    const ticketPriceTotal = perSeatPrice * (passengers.length || 2);
    const serviceFee = 0;
    const discount = 200;
    const finalTotalAmount = passedTotalAmount || (ticketPriceTotal + serviceFee - discount);

    const handlePayment = async () => {
        if (paymentMethod === 'CreditCard') {
            setLoading(true);
            try {
                const intentData: any = await createPaymentIntent({
                    scheduleId: schedule._id,
                    seatsCount: passengers.length,
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
                        name: passengers[0]?.passengerName || 'Passenger',
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
                    book(
                        {
                            scheduleId: schedule._id,
                            seats: passengers,
                            paymentIntentId: paymentIntentId,
                        },
                        {
                            onSuccess: (data) => {
                                setLoading(false);
                                navigation.navigate('BookingSuccess', { ticket: data.ticket });
                            },
                            onError: () => {
                                setLoading(false);
                            },
                        },
                    );
                }
            } catch (err: any) {
                setLoading(false);
                Toast.show({ type: 'error', text1: 'Error', text2: err.message || 'Payment initiation failed' });
            }
        }
    };

    return (
        <ScreenWrapper
            isScrollable={false}
            backgroundColor={Colors.BACKGROUND}
            header={<Header title={t('bookingReview_title') || 'Review Booking'} showBack={true} />}
            isLoading={isBooking || loading}
        >
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Top Info Alert Banner */}
                    <View style={styles.alertBanner}>
                        <View style={styles.alertIconCircle}>
                            <AppText size={11} weight="900" color="#2563EB">
                                i
                            </AppText>
                        </View>
                        <AppText size={12} color="#1E40AF" weight="600" style={{ flex: 1, marginLeft: scale(8) }}>
                            {t('review_alert_msg') || 'Please review your booking details before confirming.'}
                        </AppText>
                    </View>

                    {/* Card 1: ROUTE & JOURNEY DETAILS */}
                    <View style={styles.card}>
                        <View style={styles.sectionHeaderRow}>
                            <LocationB width={scale(15)} height={scale(15)} color={colors.BLUE_PRIMARY} />
                            <AppText size={12} weight="800" color="#1E293B" style={{ marginLeft: scale(6), letterSpacing: 0.5 }}>
                                {t('route_journey_details') || 'ROUTE & JOURNEY DETAILS'}
                            </AppText>
                        </View>

                        {/* Bus Info & Price */}
                        <View style={styles.busPriceRow}>
                            <View style={styles.companyInfoContainer}>
                                <View style={styles.logoBox}>
                                    <Image
                                        source={
                                            schedule?.busImage || schedule?.bus?.image
                                                ? { uri: schedule.busImage || schedule.bus?.image }
                                                : require('../../../assets/png/buslogo-removebg-preview.png')
                                        }
                                        style={styles.logo}
                                        resizeMode="contain"
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <AppText size={15} weight="800" color={colors.SLATE_DARK} numberOfLines={1}>
                                        {schedule?.busName || schedule?.bus?.name || 'Test Express 314'}
                                    </AppText>
                                    <View style={styles.luxuryBadge}>
                                        <AppText size={10} weight="700" color={colors.BLUE_PRIMARY}>
                                            {schedule?.busType || schedule?.bus?.type || 'Luxury'}
                                        </AppText>
                                    </View>
                                </View>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <AppText size={17} weight="900" color="#1E40AF">
                                    Rs. {perSeatPrice.toLocaleString()}
                                </AppText>
                                <AppText size={10} weight="500" color={colors.SLATE_MUTED}>
                                    {t('per_seat') || 'Per seat'}
                                </AppText>
                            </View>
                        </View>

                        {/* Departure -> Arrival Route Graphic */}
                        <View style={styles.routeRow}>
                            {/* Departure */}
                            <View style={styles.timeLocContainer}>
                                <AppText size={18} weight="900" color={colors.SLATE_DARK}>
                                    {displayDepartureTime}
                                </AppText>
                                <AppText size={13} color={colors.SLATE_MEDIUM} weight="700" numberOfLines={1} style={{ marginTop: 2 }}>
                                    {displayFromCity}
                                </AppText>
                                <View style={styles.terminalRow}>
                                    <LocationB width={scale(10)} height={scale(10)} color={colors.BLUE_PRIMARY} />
                                    <AppText size={10.5} color={colors.SLATE_MEDIUM} weight="500" numberOfLines={1} style={{ marginLeft: 3 }}>
                                        {displayFromTerminal}
                                    </AppText>
                                </View>
                            </View>

                            {/* Duration & Route Graphic */}
                            <View style={styles.durationContainer}>
                                <View style={styles.durationPill}>
                                    <AppText size={9.5} weight="700" color={colors.SLATE_MEDIUM}>
                                        {displayDuration}
                                    </AppText>
                                </View>

                                <View style={styles.routeLineWrap}>
                                    <Svg width="100%" height={24} viewBox="0 0 100 24">
                                        <Circle cx="4" cy="12" r="3" fill={colors.WHITE} stroke={colors.BLUE_PRIMARY} strokeWidth={2} />
                                        <Path d="M10 12 H42" stroke={colors.BLUE_BORDER} strokeWidth={1.5} strokeDasharray="3,3" />
                                        <Circle cx="50" cy="12" r="10" fill={colors.BLUE_LIGHT_BG} />
                                        <Path d="M58 12 H90" stroke={colors.BLUE_BORDER} strokeWidth={1.5} strokeDasharray="3,3" />
                                        <Circle cx="96" cy="12" r="3" fill={colors.WHITE} stroke={colors.BLUE_PRIMARY} strokeWidth={2} />
                                    </Svg>
                                    <View style={styles.busIconBadge}>
                                        <BusIcon width={scale(10)} height={scale(10)} color={colors.BLUE_PRIMARY} />
                                    </View>
                                </View>

                                <AppText size={10.5} weight="700" color="#16A34A" style={{ marginTop: 2 }}>
                                    {t('direct_route') || 'Direct'}
                                </AppText>
                            </View>

                            {/* Arrival */}
                            <View style={[styles.timeLocContainer, { alignItems: 'flex-end' }]}>
                                <AppText size={18} weight="900" color={colors.SLATE_DARK}>
                                    {displayArrivalTime}
                                </AppText>
                                <AppText size={13} color={colors.SLATE_MEDIUM} weight="700" numberOfLines={1} style={{ marginTop: 2 }}>
                                    {displayToCity}
                                </AppText>
                                <View style={styles.terminalRow}>
                                    <LocationB width={scale(10)} height={scale(10)} color={colors.BLUE_PRIMARY} />
                                    <AppText size={10.5} color={colors.SLATE_MEDIUM} weight="500" numberOfLines={1} style={{ marginLeft: 3 }}>
                                        {displayToTerminal}
                                    </AppText>
                                </View>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        {/* Sub-info Row (3 Columns) */}
                        <View style={styles.infoSubCard}>
                            {/* Date */}
                            <View style={styles.subCardColumn}>
                                <View style={styles.subIconWrap}>
                                    <JourneyCalendar width={scale(14)} height={scale(14)} />
                                </View>
                                <View style={styles.subTextWrap}>
                                    <AppText size={9.5} color={colors.SLATE_MUTED} weight="600" numberOfLines={1}>
                                        {t('date') || 'Date'}
                                    </AppText>
                                    <AppText size={10.5} weight="800" color="#1E40AF" numberOfLines={1} style={{ marginTop: 1 }}>
                                        {displayDate}
                                    </AppText>
                                    <AppText size={9.5} weight="600" color="#2563EB" numberOfLines={1}>
                                        {displayDayOfWeek}
                                    </AppText>
                                </View>
                            </View>

                            {/* Departure */}
                            <View style={styles.subCardColumn}>
                                <View style={styles.subIconWrap}>
                                    <Clock width={scale(14)} height={scale(14)} color={colors.BLUE_PRIMARY} />
                                </View>
                                <View style={styles.subTextWrap}>
                                    <AppText size={9.5} color={colors.SLATE_MUTED} weight="600" numberOfLines={1}>
                                        {t('booking_details_departure') || 'Departure'}
                                    </AppText>
                                    <AppText size={10.5} weight="800" color="#1E40AF" numberOfLines={1} style={{ marginTop: 1 }}>
                                        {displayDepartureTimeAMPM}
                                    </AppText>
                                </View>
                            </View>

                            <View style={styles.subCardColumn}>
                                <View style={styles.subIconWrap}>
                                    <BusSeatOutline width={scale(14)} height={scale(14)} />
                                </View>
                                <View style={styles.subTextWrap}>
                                    <AppText size={9.5} color={colors.SLATE_MUTED} weight="600" numberOfLines={1}>
                                        {t('seats_label') || 'Seats'}
                                    </AppText>
                                    <AppText size={10.5} weight="800" color="#1E40AF" numberOfLines={1} style={{ marginTop: 1 }}>
                                        {passengers.length || 2} {t('seats_unit') || 'Seats'}
                                    </AppText>
                                    <AppText size={9.5} weight="600" color="#2563EB" numberOfLines={1}>
                                        {formattedSeatsList}
                                    </AppText>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.card}>
                        <View style={styles.sectionHeaderRow}>
                            <User width={scale(15)} height={scale(15)} color={colors.BLUE_PRIMARY} fill={colors.BLUE_PRIMARY} />
                            <AppText size={12} weight="800" color="#1E293B" style={{ marginLeft: scale(6), letterSpacing: 0.5 }}>
                                {t('passenger_details_title') || 'PASSENGER DETAILS'}
                            </AppText>
                            {isGroup && (
                                <View style={styles.groupHeaderBadge}>
                                    <AppText size={10} weight="700" color="#2563EB">
                                        {t('group_booking') || 'Group'} ({passengers.length} {t('seats_unit') || 'Seats'})
                                    </AppText>
                                </View>
                            )}
                        </View>

                        <View style={{ marginTop: verticalScale(10) }}>
                            {isGroup ? (
                                <View style={styles.groupPassengerContainer}>
                                    <View style={styles.passengerRow}>
                                        <View style={styles.passengerLeft}>
                                            <View style={styles.numBadge}>
                                                <AppText size={12} weight="800" color="#1D4ED8">
                                                    ★
                                                </AppText>
                                            </View>
                                            <View style={{ marginLeft: scale(12) }}>
                                                <AppText size={14} weight="700" color="#1E293B">
                                                    {passengers[0]?.passengerName || 'Primary Passenger'}
                                                </AppText>
                                                <AppText size={11} color="#64748B" weight="500" style={{ marginTop: 2 }}>
                                                    CNIC: {formatCNIC(passengers[0]?.passengerCNIC || '')}
                                                </AppText>
                                                {passengers[0]?.passengerPhone ? (
                                                    <AppText size={11} color="#64748B" weight="500" style={{ marginTop: 2 }}>
                                                        {t('booking_details_phone') || 'Phone'}: {passengers[0]?.passengerPhone}
                                                    </AppText>
                                                ) : null}
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.groupSeatsRow}>
                                        <AppText size={11} color="#64748B" weight="600" style={{ marginRight: scale(4) }}>
                                            {t('seats_label') || 'Seats'}:
                                        </AppText>
                                        <View style={styles.groupSeatsPills}>
                                            {passengers.map((p: any, idx: number) => (
                                                <View key={idx} style={styles.seatPill}>
                                                    <AppText size={11} weight="800" color="#1D4ED8">
                                                        {t('booking_details_seat')} {p.seatNumber}
                                                    </AppText>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                </View>
                            ) : (
                                (passengers.length > 0
                                    ? passengers
                                    : [
                                          { passengerName: 'Muhammad Ali', passengerCNIC: '35202-1234567-1', seatNumber: '12' },
                                          { passengerName: 'Ahmad Raza', passengerCNIC: '35202-7654321-9', seatNumber: '13' },
                                      ]
                                ).map((p: any, idx: number) => (
                                    <React.Fragment key={idx}>
                                        {idx > 0 && <View style={styles.divider} />}
                                        <View style={styles.passengerRow}>
                                            <View style={styles.passengerLeft}>
                                                <View style={styles.numBadge}>
                                                    <AppText size={12} weight="800" color="#1D4ED8">
                                                        {idx + 1}
                                                    </AppText>
                                                </View>
                                                <View style={{ marginLeft: scale(12) }}>
                                                    <AppText size={14} weight="700" color="#1E293B">
                                                        {p.passengerName || p.name || `${t('passenger_label')} ${idx + 1}`}
                                                    </AppText>
                                                    <AppText size={11} color="#64748B" weight="500" style={{ marginTop: 2 }}>
                                                        CNIC: {formatCNIC(p.passengerCNIC || p.cnic || '35202-1234567-1')}
                                                    </AppText>
                                                </View>
                                            </View>
                                            <AppText size={13} weight="800" color="#1D4ED8">
                                                {t('booking_details_seat')} {p.seatNumber}
                                            </AppText>
                                        </View>
                                    </React.Fragment>
                                ))
                            )}
                        </View>
                    </View>

                    {/* Card 3: FARE SUMMARY */}
                    <View style={styles.card}>
                        <View style={styles.sectionHeaderRow}>
                            <TotalFareTag width={scale(15)} height={scale(15)} />
                            <AppText size={12} weight="800" color="#1E293B" style={{ marginLeft: scale(6), letterSpacing: 0.5 }}>
                                {t('fare_summary_title') || 'FARE SUMMARY'}
                            </AppText>
                        </View>

                        <View style={{ marginTop: verticalScale(12) }}>
                            <View style={styles.summaryRow}>
                                <AppText size={13} color="#475569" weight="600">
                                    {t('ticket_price')} ({passengers.length || 2} x Rs. {perSeatPrice.toLocaleString()})
                                </AppText>
                                <AppText size={13} weight="700" color="#1E293B">
                                    Rs. {ticketPriceTotal.toLocaleString()}
                                </AppText>
                            </View>

                            <View style={styles.summaryRow}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <AppText size={13} color="#475569" weight="600">
                                        {t('service_fee') || 'Service Fee'}
                                    </AppText>
                                    <AppText size={11} color="#94A3B8" style={{ marginLeft: 4 }}>
                                        ⓘ
                                    </AppText>
                                </View>
                                <AppText size={13} weight="700" color="#1E293B">
                                    Rs. {serviceFee}
                                </AppText>
                            </View>

                            {/* <View style={styles.summaryRow}>
                                <AppText size={13} color="#16A34A" weight="600">
                                    {t('discount') || 'Discount'}
                                </AppText>
                                <AppText size={13} weight="700" color="#16A34A">
                                    - Rs. {discount}
                                </AppText>
                            </View> */}

                            <View style={styles.dashedDivider} />

                            <View style={styles.totalBox}>
                                <AppText size={14} weight="800" color="#15803D">
                                    {t('total_amount') || 'Total Amount'}
                                </AppText>
                                <AppText size={18} weight="900" color="#15803D">
                                    Rs. {finalTotalAmount.toLocaleString()}
                                </AppText>
                            </View>
                        </View>
                    </View>

                    {/* Card 4: PAYMENT METHOD */}
                    <View style={styles.card}>
                        <View style={styles.sectionHeaderRow}>
                            <PaymentCard width={scale(15)} height={scale(15)} />
                            <AppText size={12} weight="800" color="#1E293B" style={{ marginLeft: scale(6), letterSpacing: 0.5 }}>
                                {t('payment_method_title') || 'PAYMENT METHOD'}
                            </AppText>
                        </View>

                        <View style={{ marginTop: verticalScale(12) }}>
                            {/* Option: Stripe */}
                            <TouchableOpacity
                                style={[styles.paymentMethodItem, styles.paymentMethodItemActive]}
                                onPress={() => setPaymentMethod('CreditCard')}
                                activeOpacity={0.9}
                            >
                                <View style={styles.paymentRadioCol}>
                                    <View style={[styles.radioCircle, styles.radioCircleActive]}>
                                        <View style={styles.radioDot} />
                                    </View>
                                </View>

                                <View style={styles.stripeBadge}>
                                    <AppText size={12} weight="900" color="#FFF" style={{ fontStyle: 'italic', letterSpacing: 0.5 }}>
                                        stripe
                                    </AppText>
                                </View>

                                <View style={{ flex: 1, marginLeft: scale(10) }}>
                                    <AppText size={13.5} weight="800" color="#1E293B">
                                        Stripe
                                    </AppText>
                                    <AppText size={11} color="#64748B" weight="500" style={{ marginTop: 1 }}>
                                        {t('stripe_desc') || 'Pay securely with Credit / Debit Card'}
                                    </AppText>
                                </View>

                                <View style={styles.activeCheckBadge}>
                                    <AppText size={10} weight="800" color="#2563EB">
                                        {t('selected_badge') || '✓ Selected'}
                                    </AppText>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>

                {/* Footer Confirm Bar */}
                <View style={styles.footerContainer}>
                    <TouchableOpacity
                        style={styles.confirmBtn}
                        onPress={handlePayment}
                        activeOpacity={0.85}
                        disabled={isBooking || loading}
                    >
                        <View style={styles.confirmBtnLeft}>
                            <ShieldCheck width={scale(18)} height={scale(18)} color="#FFF" />
                            <AppText size={15} weight="800" color="#FFF" style={{ marginLeft: scale(8) }}>
                                {isBooking || loading
                                    ? t('bookingReview_processing') || 'Processing...'
                                    : t('bookingReview_confirmButton') || 'Confirm Booking'}
                            </AppText>
                        </View>

                        <View style={styles.confirmBtnRight}>
                            <AppText size={16} weight="900" color="#FFF" style={{ marginRight: scale(6) }}>
                                Rs. {finalTotalAmount.toLocaleString()}
                            </AppText>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </ScreenWrapper>
    );
};

export default BookingReview;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: verticalScale(12),
        paddingBottom: verticalScale(100),
    },
    alertBanner: {
        backgroundColor: '#EFF6FF',
        borderColor: '#DBEAFE',
        borderWidth: 1,
        borderRadius: scale(14),
        paddingHorizontal: scale(14),
        paddingVertical: verticalScale(10),
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(14),
    },
    alertIconCircle: {
        width: scale(18),
        height: scale(18),
        borderRadius: scale(9),
        borderWidth: 1.5,
        borderColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: colors.WHITE,
        borderRadius: scale(18),
        padding: scale(16),
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: verticalScale(14),
        shadowColor: '#1E293B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(10),
    },
    busPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(14),
    },
    companyInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: scale(8),
    },
    logoBox: {
        width: scale(48),
        height: scale(48),
        borderRadius: scale(14),
        borderWidth: 1,
        borderColor: colors.BORDER_GREY,
        padding: scale(3),
        backgroundColor: colors.WHITE,
        marginRight: scale(10),
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    luxuryBadge: {
        backgroundColor: colors.BLUE_LIGHT_BG,
        paddingHorizontal: scale(8),
        paddingVertical: verticalScale(3),
        borderRadius: scale(8),
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginTop: verticalScale(4),
    },
    routeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginVertical: verticalScale(10),
    },
    timeLocContainer: {
        flex: 1.2,
    },
    terminalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: verticalScale(4),
    },
    durationContainer: {
        flex: 1.6,
        alignItems: 'center',
        paddingHorizontal: scale(2),
    },
    durationPill: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: scale(8),
        paddingVertical: verticalScale(2),
        borderRadius: scale(8),
        marginBottom: verticalScale(2),
    },
    routeLineWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        position: 'relative',
        justifyContent: 'center',
    },
    busIconBadge: {
        position: 'absolute',
        left: '50%',
        marginLeft: -scale(6),
        top: 6,
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: verticalScale(12),
    },
    dashedDivider: {
        height: 1,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
        marginVertical: verticalScale(12),
    },
    infoSubCard: {
        backgroundColor: '#F8FAFC',
        borderRadius: scale(14),
        paddingHorizontal: scale(5),
        paddingVertical: verticalScale(10),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    subCardColumn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: scale(2),
    },
    subIconWrap: {
        marginTop: verticalScale(2),
        marginRight: scale(4),
    },
    subTextWrap: {
        flex: 1,
    },
    passengerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: verticalScale(6),
    },
    passengerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    numBadge: {
        width: scale(30),
        height: scale(30),
        borderRadius: scale(15),
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    groupHeaderBadge: {
        marginLeft: 'auto',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: scale(8),
        paddingVertical: verticalScale(2),
        borderRadius: scale(6),
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    groupPassengerContainer: {
        backgroundColor: '#F8FAFC',
        borderRadius: scale(12),
        padding: scale(10),
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    groupSeatsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: verticalScale(8),
        paddingTop: verticalScale(8),
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    groupSeatsPills: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: scale(6),
        flex: 1,
    },
    seatPill: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: scale(8),
        paddingVertical: verticalScale(3),
        borderRadius: scale(6),
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: verticalScale(10),
    },
    totalBox: {
        backgroundColor: '#F0FDF4',
        borderRadius: scale(12),
        paddingHorizontal: scale(14),
        paddingVertical: verticalScale(10),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    paymentMethodItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: scale(12),
        borderRadius: scale(14),
        borderWidth: 1,
        borderColor: '#F1F5F9',
        backgroundColor: colors.WHITE,
        marginBottom: verticalScale(10),
    },
    paymentMethodItemActive: {
        backgroundColor: '#F8FAFC',
        borderColor: '#CBD5E1',
    },
    paymentRadioCol: {
        marginRight: scale(8),
    },
    radioCircle: {
        width: scale(18),
        height: scale(18),
        borderRadius: scale(9),
        borderWidth: 2,
        borderColor: '#CBD5E1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioCircleActive: {
        borderColor: '#2563EB',
    },
    radioDot: {
        width: scale(10),
        height: scale(10),
        borderRadius: scale(5),
        backgroundColor: '#2563EB',
    },
    stripeBadge: {
        backgroundColor: '#635BFF',
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(4),
        borderRadius: scale(8),
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeCheckBadge: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: scale(8),
        paddingVertical: verticalScale(4),
        borderRadius: scale(6),
    },
    addPlusCircle: {
        width: scale(32),
        height: scale(32),
        borderRadius: scale(16),
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.WHITE,
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(12),
        paddingBottom: Platform.OS === 'ios' ? verticalScale(24) : verticalScale(16),
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
    },
    confirmBtn: {
        backgroundColor: '#1D4ED8',
        height: verticalScale(48),
        borderRadius: scale(14),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: scale(16),
        shadowColor: '#1D4ED8',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    confirmBtnLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    confirmBtnRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
