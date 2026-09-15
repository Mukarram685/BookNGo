import React, { useRef, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
    PermissionsAndroid,
    BackHandler,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import Svg, { Path, Circle } from 'react-native-svg';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import Header from '../../../component/Header';
import colors, { Colors } from '../../../utils/colors';
import { TicketDetails, PassengerDetail } from '../../../interface/booking.interface';
import { formatCNIC } from '../../../helpers/auth.helper';
import {
    Bus as BusIcon,
    Clock,
    JourneyCalendar,
    BusSeatOutline,
    Download,
    Bookings as BookingsIcon,
    Home as HomeIcon,
    ShieldCheck,
    Info,
} from '../../../assets/svg';

const SuccessTickIcon = () => (
    <Svg width={scale(54)} height={scale(54)} viewBox="0 0 64 64" fill="none">
        <Circle cx="32" cy="32" r="30" fill="#2CC93C" />
        <Path
            d="M20 32L28 40L44 22"
            stroke={Colors.WHITE}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const BookingSuccess = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const ticket: TicketDetails = route.params?.ticket || {};
    const viewShotRef = useRef<any>(null);

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
            if (e.data.action.type === 'GO_BACK') {
                e.preventDefault();
                navigation.navigate('BottomTabs', { screen: 'Home' });
            }
        });

        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.navigate('BottomTabs', { screen: 'Home' });
            return true;
        });

        return () => {
            unsubscribe();
            backHandler.remove();
        };
    }, [navigation]);

    const requestPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                );
            } catch (err) {
                console.warn(err);
            }
        }
    };

    const shareTicket = async () => {
        try {
            await requestPermission();
            const uri = await viewShotRef.current.capture();

            const options = {
                title: 'BookNGo Boarding Pass',
                url: uri,
                type: 'image/png',
            };
            await Share.open(options);
        } catch (error: any) {
            if (
                error?.message &&
                !error.message.includes('dismissed') &&
                !error.message.includes('User did not share') &&
                !error.message.includes('cancel')
            ) {
                console.log('Error sharing ticket:', error);
            }
        }
    };

    // Data parsing with safe fallbacks
    const pnr = ticket?.pnr || 'BNG-784512';
    const bookingId = ticket?.bookingId || (ticket?.pnr ? `BNG-${ticket.pnr.slice(-6).toUpperCase()}` : 'BNG-784512');
    const companyName = ticket?.companyName || 'BookNGo Express';
    const busType = ticket?.busType || 'Luxury';
    const busNumber = ticket?.busNumber || 'BS-4592';
    const fromCity = ticket?.fromCity || 'Lahore';
    const toCity = ticket?.toCity || 'Karachi';
    const fromTerminal = ticket?.fromTerminal || `${fromCity} Terminal`;
    const toTerminal = ticket?.toTerminal || `${toCity} Terminal`;
    const travelDate = ticket?.travelDate || '20 May 2025';
    const departureTime = ticket?.departureTime || '08:00';
    const arrivalTime = ticket?.arrivalTime || '23:00';
    const totalAmount = typeof ticket?.totalFare === 'number' ? ticket.totalFare : 5000;

    const rawPassengers = Array.isArray(ticket?.passengers) && ticket.passengers.length > 0
        ? ticket.passengers
        : [
            {
                seatNumber: 12,
                passengerName: ticket?.bookerName || 'Passenger',
                passengerCNIC: '',
                passengerPhone: ticket?.bookerPhone || '',
                gender: 'Male' as const,
            },
        ];

    const seatNumbers = rawPassengers.map((p: any) => p.seatNumber).filter(Boolean).join(', ') || '12';
    const totalSeats = ticket?.totalSeats || rawPassengers.length || 1;

    return (
        <ScreenWrapper
            backgroundColor={Colors.BACKGROUND}
            header={
                <Header
                    title={t('payment_success_title') || 'Payment Success'}
                    showBack={false}
                    showShareButton={true}
                    onShare={shareTicket}
                />
            }
        >
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Top Success Banner */}
                    <View style={styles.successHeader}>
                        <SuccessTickIcon />
                        <AppText size={18} weight="800" color="#2CC93C" style={{ marginTop: verticalScale(10) }}>
                            {t('booking_confirmed_title') || 'Booking Confirmed & Paid!'}
                        </AppText>
                        <AppText size={28} weight="900" color={Colors.PRIMARY} style={{ marginTop: verticalScale(4) }}>
                            PKR {totalAmount.toLocaleString()}
                        </AppText>
                        <View style={styles.paymentMethodPill}>
                            <ShieldCheck width={scale(13)} height={scale(13)} color="#16A34A" />
                            <AppText size={11} color="#16A34A" weight="700" style={{ marginLeft: scale(4) }}>
                                {t('paid_to') || 'Paid via Stripe • Instant Confirmation'}
                            </AppText>
                        </View>
                    </View>

                    {/* Official E-Ticket / Receipt Card (Capturable) */}
                    <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.95 }}>
                        <View style={styles.receiptCard}>
                            {/* Card Header */}
                            <View style={styles.ticketHeader}>
                                <View>
                                    <AppText size={18} weight="900" color="#172C6B">
                                        BookNGo
                                    </AppText>
                                    <AppText size={10} weight="700" color={Colors.TEXT_GREY} style={{ letterSpacing: 0.5 }}>
                                        OFFICIAL E-TICKET / BOARDING PASS
                                    </AppText>
                                </View>
                                <View style={styles.confirmedBadge}>
                                    <AppText size={11} weight="800" color="#2CC93C">
                                        CONFIRMED
                                    </AppText>
                                </View>
                            </View>

                            {/* PNR & Booking ID Box */}
                            <View style={styles.pnrBanner}>
                                <View style={styles.pnrTopRow}>
                                    <View>
                                        <AppText size={10} color={Colors.TEXT_GREY} weight="800" style={{ letterSpacing: 0.5 }}>
                                            PNR NUMBER
                                        </AppText>
                                        <AppText size={16} weight="900" color="#172C6B" style={{ marginTop: 2 }}>
                                            {pnr}
                                        </AppText>
                                    </View>
                                    <View style={styles.verifiedTicketPill}>
                                        <AppText size={10} weight="800" color="#1D4ED8">
                                            VERIFIED
                                        </AppText>
                                    </View>
                                </View>

                                <View style={styles.pnrDivider} />

                                <View style={styles.pnrBottomRow}>
                                    <AppText size={10} color={Colors.TEXT_GREY} weight="800" style={{ letterSpacing: 0.5 }}>
                                        BOOKING ID:
                                    </AppText>
                                    <AppText size={12} weight="800" color={Colors.PRIMARY} style={{ marginLeft: scale(6), flex: 1 }} numberOfLines={1}>
                                        #{bookingId}
                                    </AppText>
                                </View>
                            </View>

                            {/* Bus & Operator Info */}
                            <View style={styles.busInfoRow}>
                                <View style={styles.busInfoLeft}>
                                    <View style={styles.busIconBox}>
                                        <BusIcon width={scale(18)} height={scale(18)} color={colors.BLUE_PRIMARY} />
                                    </View>
                                    <View style={{ marginLeft: scale(10), flex: 1 }}>
                                        <AppText size={15} weight="800" color="#1E293B" numberOfLines={1}>
                                            {companyName}
                                        </AppText>
                                        <View style={styles.busBadgeRow}>
                                            <View style={styles.busTypeBadge}>
                                                <AppText size={10} weight="700" color={colors.BLUE_PRIMARY}>
                                                    {busType}
                                                </AppText>
                                            </View>
                                            <AppText size={11} color={colors.SLATE_MUTED} weight="600" style={{ marginLeft: scale(6) }}>
                                                • {busNumber}
                                            </AppText>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Route Section */}
                            <View style={styles.routeSection}>
                                <View style={styles.cityInfo}>
                                    <AppText size={19} weight="900" color={Colors.PRIMARY}>
                                        {fromCity}
                                    </AppText>
                                    <AppText size={11} color={Colors.TEXT_GREY} weight="600" style={{ marginTop: 2 }} numberOfLines={1}>
                                        {fromTerminal}
                                    </AppText>
                                    <AppText size={12} weight="800" color="#1E40AF" style={{ marginTop: 3 }}>
                                        {departureTime}
                                    </AppText>
                                </View>

                                <View style={styles.routeGraphicContainer}>
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
                                    <AppText size={10} weight="700" color="#16A34A" style={{ marginTop: 2 }}>
                                        {t('direct_route') || 'Direct Route'}
                                    </AppText>
                                </View>

                                <View style={[styles.cityInfo, { alignItems: 'flex-end' }]}>
                                    <AppText size={19} weight="900" color={Colors.PRIMARY}>
                                        {toCity}
                                    </AppText>
                                    <AppText size={11} color={Colors.TEXT_GREY} weight="600" style={{ marginTop: 2 }} numberOfLines={1}>
                                        {toTerminal}
                                    </AppText>
                                    <AppText size={12} weight="800" color="#1E40AF" style={{ marginTop: 3 }}>
                                        {arrivalTime}
                                    </AppText>
                                </View>
                            </View>

                            {/* 3-Column Info Summary Card */}
                            <View style={styles.infoSummaryGrid}>
                                <View style={styles.summaryCol}>
                                    <View style={styles.summaryIconWrap}>
                                        <JourneyCalendar width={scale(13)} height={scale(13)} />
                                    </View>
                                    <View style={{ marginLeft: scale(6), flex: 1 }}>
                                        <AppText size={9.5} color={colors.SLATE_MUTED} weight="600">
                                            {t('date') || 'Travel Date'}
                                        </AppText>
                                        <AppText size={10.5} weight="800" color="#1E40AF" numberOfLines={1} style={{ marginTop: 1 }}>
                                            {travelDate}
                                        </AppText>
                                    </View>
                                </View>

                                <View style={styles.summaryCol}>
                                    <View style={styles.summaryIconWrap}>
                                        <Clock width={scale(13)} height={scale(13)} color={colors.BLUE_PRIMARY} />
                                    </View>
                                    <View style={{ marginLeft: scale(6), flex: 1 }}>
                                        <AppText size={9.5} color={colors.SLATE_MUTED} weight="600">
                                            {t('booking_details_time') || 'Departure'}
                                        </AppText>
                                        <AppText size={10.5} weight="800" color="#1E40AF" numberOfLines={1} style={{ marginTop: 1 }}>
                                            {departureTime}
                                        </AppText>
                                    </View>
                                </View>

                                <View style={styles.summaryCol}>
                                    <View style={styles.summaryIconWrap}>
                                        <BusSeatOutline width={scale(13)} height={scale(13)} />
                                    </View>
                                    <View style={{ marginLeft: scale(6), flex: 1 }}>
                                        <AppText size={9.5} color={colors.SLATE_MUTED} weight="600">
                                            {t('seats_label') || 'Seats'} ({totalSeats})
                                        </AppText>
                                        <AppText size={10.5} weight="800" color="#1E40AF" numberOfLines={1} style={{ marginTop: 1 }}>
                                            #{seatNumbers}
                                        </AppText>
                                    </View>
                                </View>
                            </View>

                            {/* Perforated Notch Divider */}
                            <View style={styles.notchContainer}>
                                <View style={styles.notchLeft} />
                                <View style={styles.dashedLine} />
                                <View style={styles.notchRight} />
                            </View>

                            {/* Passenger Details Section */}
                            <View style={styles.sectionInner}>
                                <AppText size={13} weight="800" color={Colors.PRIMARY} style={{ marginBottom: verticalScale(8) }}>
                                    {t('booking_details_passenger_info') || 'Passenger Information'}
                                </AppText>
                                {rawPassengers.map((seat: PassengerDetail, index: number) => (
                                    <View key={index} style={[styles.passengerSubCard, index > 0 && { marginTop: verticalScale(8) }]}>
                                        <View style={styles.detailRow}>
                                            <AppText size={12} color={Colors.DARK_GRAY} weight="600">
                                                {t('booking_details_name') || 'Name'}{' '}
                                                {seat.seatNumber ? `(Seat ${seat.seatNumber})` : `(${index + 1})`}
                                            </AppText>
                                            <AppText size={13} weight="700" color={Colors.PRIMARY}>
                                                {seat.passengerName || ticket?.bookerName || 'Passenger'}
                                            </AppText>
                                        </View>
                                        {seat.passengerCNIC ? (
                                            <View style={styles.detailRow}>
                                                <AppText size={12} color={Colors.DARK_GRAY} weight="600">
                                                    {t('label_cnic') || 'CNIC'}
                                                </AppText>
                                                <AppText size={13} weight="700" color={Colors.PRIMARY}>
                                                    {formatCNIC(seat.passengerCNIC)}
                                                </AppText>
                                            </View>
                                        ) : null}
                                        {seat.passengerPhone || ticket?.bookerPhone ? (
                                            <View style={styles.detailRow}>
                                                <AppText size={12} color={Colors.DARK_GRAY} weight="600">
                                                    {t('booking_details_phone') || 'Phone'}
                                                </AppText>
                                                <AppText size={13} weight="700" color={Colors.PRIMARY}>
                                                    {seat.passengerPhone || ticket?.bookerPhone}
                                                </AppText>
                                            </View>
                                        ) : null}
                                        <View style={styles.detailRow}>
                                            <AppText size={12} color={Colors.DARK_GRAY} weight="600">
                                                {t('booking_details_gender') || 'Gender'}
                                            </AppText>
                                            <AppText size={13} weight="700" color={Colors.PRIMARY}>
                                                {seat.gender || 'Male'}
                                            </AppText>
                                        </View>
                                    </View>
                                ))}
                            </View>

                            <View style={styles.solidDivider} />

                            {/* Payment Summary Section */}
                            <View style={styles.sectionInner}>
                                <AppText size={13} weight="800" color={Colors.PRIMARY} style={{ marginBottom: verticalScale(8) }}>
                                    {t('booking_details_payment_summary') || 'Payment Summary'}
                                </AppText>
                                <View style={styles.passengerSubCard}>
                                    <View style={styles.detailRow}>
                                        <AppText size={12} color={Colors.DARK_GRAY} weight="600">
                                            {t('booking_details_ticket_fare') || 'Ticket Fare'} ({totalSeats} {t('seats_unit') || 'Seat(s)'})
                                        </AppText>
                                        <AppText size={13} weight="700" color={Colors.PRIMARY}>
                                            Rs. {totalAmount.toLocaleString()}
                                        </AppText>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <AppText size={12} color={Colors.DARK_GRAY} weight="600">
                                            {t('booking_details_service_fee') || 'Service Fee'}
                                        </AppText>
                                        <AppText size={13} weight="700" color="#16A34A">
                                            Rs. 0 (Free)
                                        </AppText>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <AppText size={12} color={Colors.DARK_GRAY} weight="600">
                                            {t('payment_label') || 'Payment Method'}
                                        </AppText>
                                        <AppText size={13} weight="700" color="#2563EB">
                                            Stripe (Paid)
                                        </AppText>
                                    </View>
                                    <View style={styles.dividerSmall} />
                                    <View style={styles.detailRow}>
                                        <AppText size={14} weight="800" color={Colors.PRIMARY}>
                                            {t('booking_details_total') || 'Total Paid'}
                                        </AppText>
                                        <AppText size={17} weight="900" color="#172C6B">
                                            Rs. {totalAmount.toLocaleString()}
                                        </AppText>
                                    </View>
                                </View>
                            </View>

                            {/* Barcode & Verified Footer */}
                            <View style={styles.ticketFooter}>
                                <View style={styles.barcodeLines}>
                                    {[...Array(24)].map((_, i) => (
                                        <View
                                            key={i}
                                            style={{
                                                width: i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1,
                                                height: scale(24),
                                                backgroundColor: '#334155',
                                                marginHorizontal: scale(1.5),
                                            }}
                                        />
                                    ))}
                                </View>
                                <AppText size={10} color={Colors.TEXT_GREY} weight="600" style={{ marginTop: verticalScale(6) }}>
                                    ✓ Verified Digital Boarding Pass • BookNGo Bus Service
                                </AppText>
                            </View>
                        </View>
                    </ViewShot>

                    {/* Important Travel Guidelines Card */}
                    <View style={styles.guidelinesCard}>
                        <View style={styles.guidelinesHeader}>
                            <Info width={scale(16)} height={scale(16)} color="#0284C7" />
                            <AppText size={13} weight="800" color="#0369A1" style={{ marginLeft: scale(6) }}>
                                {t('guidelines_title') || 'Important Travel Guidelines'}
                            </AppText>
                        </View>
                        <View style={styles.guidelineItem}>
                            <AppText size={11.5} color="#334155" weight="700">
                                🕒 {t('guideline_reporting') || 'Reporting Time'}:
                            </AppText>
                            <AppText size={11} color="#64748B" weight="500" style={{ marginTop: 2 }}>
                                {t('guideline_reporting_desc') || 'Please arrive at the terminal at least 15-30 minutes before departure.'}
                            </AppText>
                        </View>
                        <View style={styles.guidelineItem}>
                            <AppText size={11.5} color="#334155" weight="700">
                                🪪 {t('guideline_id') || 'Identification'}:
                            </AppText>
                            <AppText size={11} color="#64748B" weight="500" style={{ marginTop: 2 }}>
                                {t('guideline_id_desc') || 'Original CNIC or Government ID is required for verification at boarding.'}
                            </AppText>
                        </View>
                        <View style={styles.guidelineItem}>
                            <AppText size={11.5} color="#334155" weight="700">
                                📱 {t('guideline_eticket') || 'Digital Pass'}:
                            </AppText>
                            <AppText size={11} color="#64748B" weight="500" style={{ marginTop: 2 }}>
                                {t('guideline_eticket_desc') || 'Present this digital boarding pass or your PNR at the counter.'}
                            </AppText>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.buttonContainer}>
                        {/* Download / Share Ticket Button */}
                        <TouchableOpacity
                            style={styles.shareBtn}
                            onPress={shareTicket}
                            activeOpacity={0.85}
                        >
                            <Download width={scale(16)} height={scale(16)} color="#FFFFFF" stroke="#FFFFFF" />
                            <AppText size={14} weight="800" color="#FFFFFF" style={{ marginLeft: scale(8) }}>
                                {t('download_ticket') || 'Share & Download Ticket'}
                            </AppText>
                        </TouchableOpacity>

                        {/* View in My Bookings */}
                        <TouchableOpacity
                            style={styles.bookingsBtn}
                            onPress={() => navigation.navigate('BottomTabs', { screen: 'Bookings' })}
                            activeOpacity={0.8}
                        >
                            <BookingsIcon width={scale(16)} height={scale(16)} color={colors.BLUE_PRIMARY} />
                            <AppText size={13.5} weight="700" color={colors.BLUE_PRIMARY} style={{ marginLeft: scale(8) }}>
                                {t('view_my_bookings') || 'View in My Bookings'}
                            </AppText>
                        </TouchableOpacity>

                        {/* Back to Home Button */}
                        <TouchableOpacity
                            style={styles.homeBtn}
                            onPress={() => navigation.navigate('BottomTabs', { screen: 'Home' })}
                            activeOpacity={0.8}
                        >
                            <HomeIcon width={scale(16)} height={scale(16)} color={colors.SLATE_DARK} />
                            <AppText size={13.5} weight="700" color={colors.SLATE_DARK} style={{ marginLeft: scale(8) }}>
                                {t('back_to_home') || 'Back to Home'}
                            </AppText>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </ScreenWrapper>
    );
};

export default BookingSuccess;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(50),
    },
    successHeader: {
        alignItems: 'center',
        paddingVertical: verticalScale(12),
        marginBottom: verticalScale(8),
    },
    paymentMethodPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FDF4',
        borderWidth: 1,
        borderColor: '#DCFCE7',
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(4),
        borderRadius: scale(12),
        marginTop: verticalScale(8),
    },
    receiptCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: scale(20),
        padding: scale(18),
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        position: 'relative',
        overflow: 'hidden',
    },
    ticketHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: verticalScale(8),
    },
    confirmedBadge: {
        backgroundColor: '#E6F7ED',
        paddingHorizontal: scale(12),
        paddingVertical: scale(5),
        borderRadius: scale(8),
    },
    pnrBanner: {
        backgroundColor: '#F8FAFC',
        borderRadius: scale(12),
        paddingHorizontal: scale(14),
        paddingVertical: verticalScale(10),
        marginVertical: verticalScale(8),
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    pnrTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    verifiedTicketPill: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: scale(8),
        paddingVertical: verticalScale(3),
        borderRadius: scale(6),
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    pnrDivider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: verticalScale(8),
    },
    pnrBottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    busInfoRow: {
        marginVertical: verticalScale(8),
    },
    busInfoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    busIconBox: {
        width: scale(38),
        height: scale(38),
        borderRadius: scale(10),
        backgroundColor: colors.BLUE_LIGHT_BG,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.BLUE_BORDER,
    },
    busBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: verticalScale(2),
    },
    busTypeBadge: {
        backgroundColor: colors.BLUE_LIGHT_BG,
        paddingHorizontal: scale(6),
        paddingVertical: verticalScale(2),
        borderRadius: scale(4),
    },
    routeSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: verticalScale(10),
    },
    cityInfo: {
        flex: 1,
    },
    routeGraphicContainer: {
        alignItems: 'center',
        paddingHorizontal: scale(6),
        flex: 0.9,
    },
    routeLineWrap: {
        position: 'relative',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    busIconBadge: {
        position: 'absolute',
        top: 2,
        alignSelf: 'center',
        backgroundColor: colors.WHITE,
        borderRadius: scale(10),
        padding: scale(3),
        elevation: 2,
        shadowColor: colors.BLUE_PRIMARY,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
    },
    infoSummaryGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#F8FAFC',
        borderRadius: scale(12),
        padding: scale(10),
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginVertical: verticalScale(8),
    },
    summaryCol: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    summaryIconWrap: {
        width: scale(26),
        height: scale(26),
        borderRadius: scale(8),
        backgroundColor: colors.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    notchContainer: {
        position: 'relative',
        height: scale(30),
        justifyContent: 'center',
        marginVertical: verticalScale(8),
    },
    dashedLine: {
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderStyle: 'dashed',
        width: '100%',
    },
    notchLeft: {
        position: 'absolute',
        left: -scale(26),
        width: scale(20),
        height: scale(20),
        borderRadius: scale(10),
        backgroundColor: Colors.BACKGROUND,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        zIndex: 10,
    },
    notchRight: {
        position: 'absolute',
        right: -scale(26),
        width: scale(20),
        height: scale(20),
        borderRadius: scale(10),
        backgroundColor: Colors.BACKGROUND,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        zIndex: 10,
    },
    sectionInner: {
        marginVertical: verticalScale(6),
    },
    passengerSubCard: {
        backgroundColor: '#F8FAFC',
        borderRadius: scale(12),
        padding: scale(12),
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: verticalScale(3),
    },
    solidDivider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: verticalScale(10),
    },
    dividerSmall: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: verticalScale(8),
    },
    ticketFooter: {
        alignItems: 'center',
        paddingTop: verticalScale(14),
        marginTop: verticalScale(8),
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    barcodeLines: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    guidelinesCard: {
        backgroundColor: '#F0F9FF',
        borderRadius: scale(16),
        padding: scale(14),
        borderWidth: 1,
        borderColor: '#BAE6FD',
        marginTop: verticalScale(16),
    },
    guidelinesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(8),
    },
    guidelineItem: {
        marginVertical: verticalScale(3),
    },
    buttonContainer: {
        marginTop: verticalScale(20),
        gap: verticalScale(10),
    },
    shareBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0D57D0',
        height: scale(48),
        borderRadius: scale(14),
        shadowColor: '#0D57D0',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    bookingsBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.WHITE,
        height: scale(48),
        borderRadius: scale(14),
        borderWidth: 1.5,
        borderColor: colors.BLUE_PRIMARY,
    },
    homeBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.WHITE,
        height: scale(48),
        borderRadius: scale(14),
        borderWidth: 1,
        borderColor: '#CBD5E1',
    },
});
