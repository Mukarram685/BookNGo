import React, { useRef, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
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
import AppButton from '../../../component/common/AppButton';
import Header from '../../../component/Header';
import { Colors } from '../../../utils/colors';
import { TicketDetails } from '../../../interface/booking.interface';
import { Info } from '../../../assets/svg';

const SuccessTickIcon = () => (
    <Svg width={scale(56)} height={scale(56)} viewBox="0 0 64 64" fill="none">
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
                title: 'BookNGo Ticket',
                url: uri,
                type: 'image/png',
            };
            await Share.open(options);
        } catch (error) {
            console.log('Error sharing ticket:', error);
        }
    };

    const totalAmount = ticket?.totalFare || 0;
    const companyName = ticket?.companyName || 'BookNGo Express';
    const busType = ticket?.busType || 'Luxury';
    const busNumber = ticket?.busNumber || 'BS-4592';
    const pnr = ticket?.pnr || 'BNG-784512';
    const fromCity = ticket?.fromCity || 'Lahore';
    const toCity = ticket?.toCity || 'Karachi';
    const travelDate = ticket?.travelDate || '20 May 2025';
    const departureTime = ticket?.departureTime || '08:00';

    const bookedSeats = Array.isArray(ticket?.passengers) && ticket.passengers.length > 0
        ? ticket.passengers.map(p => p.seatNumber).filter(Boolean).join(', ')
        : '12';

    const now = new Date();
    const formattedTimestamp = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }) + ', ' + now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

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
                    {/* Capturable Receipt Card */}
                    <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }}>
                        <View style={styles.receiptCard}>
                            <View style={styles.successHeader}>
                                <SuccessTickIcon />
                                <AppText size={18} weight="800" color="#2CC93C" style={{ marginTop: verticalScale(12) }}>
                                    {t('transaction_successful') || 'Transaction Successful'}
                                </AppText>
                                <AppText size={28} weight="900" color={Colors.PRIMARY} style={{ marginTop: verticalScale(8) }}>
                                    PKR {totalAmount.toLocaleString()}
                                </AppText>
                                <AppText size={12} color={Colors.TEXT_GREY} weight="600" style={{ marginTop: 2 }}>
                                    {t('paid_to') || 'Paid to BookNGo Bus Service'}
                                </AppText>
                            </View>

                            <View style={styles.dashedLine} />

                            {/* PNR, Company & Journey details */}
                            <View style={styles.detailsList}>
                                <DetailRow label={t('pnr_ticket_no') || 'PNR / Ticket No'} value={pnr} valueColor="#172C6B" valueWeight="800" />
                                <DetailRow label={t('operator_label') || 'Bus Company'} value={companyName} valueColor="#172C6B" valueWeight="700" />
                                <DetailRow label={t('bus_route') || 'Bus Route'} value={`${fromCity} → ${toCity}`} />
                                <DetailRow label={t('bus_number') || 'Bus Number'} value={`${busNumber} (${busType})`} />
                                <DetailRow label={t('travel_date') || 'Travel Date'} value={travelDate} />
                                <DetailRow label={t('departure_time') || 'Departure Time'} value={departureTime} />
                                <DetailRow label={t('booked_seats') || 'Booked Seats'} value={bookedSeats} />
                                <DetailRow label={t('booking_time') || 'Booking Time'} value={formattedTimestamp} />

                                <View style={styles.innerDivider} />

                                {/* Payment Summary */}
                                <DetailRow label={t('booking_details_ticket_fare') || 'Ticket Fare'} value={`PKR ${totalAmount.toLocaleString()}`} />
                                <DetailRow label={t('booking_details_service_fee') || 'Service Fee'} value="PKR 0 (Free)" valueColor="#16A34A" />
                                <DetailRow label={t('payment_label') || 'Payment Method'} value="Stripe (Card)" />
                                <DetailRow label={t('payment_status') || 'Payment Status'} value={t('completed_status') || 'COMPLETED'} valueColor="#2CC93C" valueWeight="800" />
                            </View>

                            {/* Receipt Decorative Notch */}
                            <View style={styles.notchLeft} />
                            <View style={styles.notchRight} />
                        </View>
                    </ViewShot>

                    {/* Important Travel Guidance */}
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
                        <AppButton
                            title={t('view_my_bookings') || 'View Bookings'}
                            onPress={() => navigation.navigate('BottomTabs', { screen: 'Bookings' })}
                            style={styles.bookingsBtn}
                        />
                    </View>
                </ScrollView>
            </View>
        </ScreenWrapper>
    );
};

const DetailRow = ({
    label,
    value,
    valueColor = Colors.PRIMARY,
    valueWeight = '700',
}: {
    label: string;
    value: string;
    valueColor?: string;
    valueWeight?: any;
}) => (
    <View style={styles.detailRow}>
        <AppText color={Colors.DARK_GRAY} size={13} weight="600">{label}</AppText>
        <AppText color={valueColor} size={13.5} weight={valueWeight}>{value}</AppText>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: verticalScale(15),
        paddingBottom: verticalScale(50),
    },
    receiptCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: scale(20),
        padding: scale(20),
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
        position: 'relative',
        overflow: 'hidden',
    },
    successHeader: {
        alignItems: 'center',
        paddingVertical: verticalScale(10),
    },
    dashedLine: {
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderStyle: 'dashed',
        marginVertical: verticalScale(16),
    },
    innerDivider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: verticalScale(4),
    },
    detailsList: {
        gap: verticalScale(12),
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    notchLeft: {
        position: 'absolute',
        left: -scale(12),
        top: '32%',
        width: scale(20),
        height: scale(20),
        borderRadius: scale(10),
        backgroundColor: Colors.BACKGROUND,
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
    },
    notchRight: {
        position: 'absolute',
        right: -scale(12),
        top: '32%',
        width: scale(20),
        height: scale(20),
        borderRadius: scale(10),
        backgroundColor: Colors.BACKGROUND,
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
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
        marginTop: verticalScale(24),
        gap: verticalScale(12),
    },
    bookingsBtn: {
        backgroundColor: '#172C6B',
        paddingVertical: verticalScale(14),
        borderRadius: scale(14),
        alignItems: 'center',
        shadowColor: Colors.PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    homeBtn: {
        paddingVertical: verticalScale(14),
        borderRadius: scale(14),
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#172C6B',
        backgroundColor: Colors.SURFACE,
    },
});

export default BookingSuccess;
