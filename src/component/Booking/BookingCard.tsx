import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { scale, verticalScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';

let Clipboard: any;
try {
    Clipboard = require('@react-native-clipboard/clipboard').default;
} catch (e) {
    Clipboard = { setString: () => {} };
}
import AppText from '../common/AppText';
import colors from '../../utils/colors';
import {
    Bus as BusIcon,
    LocationB,
    Eye,
    Download,
    More,
    Copy,
    JourneyCalendar,
    BusSeatOutline,
    TotalFareTag,
    PaymentCard,
} from '../../assets/svg';

export interface BookingCardItem {
    id: string;
    bookingId?: string;
    busName?: string;
    busType?: string;
    busImage?: string;
    status: string;
    fromCity?: string;
    toCity?: string;
    fromTerminal?: string;
    toTerminal?: string;
    departureTime?: string;
    arrivalTime?: string;
    duration?: string;
    date?: string;
    dayOfWeek?: string;
    seats?: string | string[];
    seatsCount?: number;
    price: string | number;
    paymentStatus?: string;
    route?: string;
    time?: string;
    fullData?: any;
}

interface BookingCardProps {
    booking: BookingCardItem;
    onView?: () => void;
    onDownload?: () => void;
    onMore?: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
    booking,
    onView,
    onDownload,
    onMore,
}) => {
    const { t } = useTranslation();

    const displayBookingId = booking.bookingId || `BNG-${booking.id?.slice(-6).toUpperCase() || '784512'}`;
    const displayBusName = booking.busName || 'Test Express 314';
    const displayBusType = booking.busType || 'Luxury';
    const displayFromCity = booking.fromCity || (booking.route?.split(' to ')[0]) || 'Lahore';
    const displayToCity = booking.toCity || (booking.route?.split(' to ')[1]) || 'Karachi';
    const displayFromTerminal = booking.fromTerminal || `${displayFromCity} Terminal`;
    const displayToTerminal = booking.toTerminal || `${displayToCity} Terminal`;
    const displayDepartureTime = booking.departureTime || booking.time || '08:00';
    const displayArrivalTime = booking.arrivalTime || '23:00';
    const displayDuration = booking.duration || '4h';
    const displayDate = booking.date || '20 May 2025';
    const displayDayOfWeek = booking.dayOfWeek || 'Tuesday';

    const formattedSeatsCount = booking.seatsCount || (Array.isArray(booking.seats) ? booking.seats.length : 2);
    const formattedSeatsList = Array.isArray(booking.seats) ? booking.seats.join(', ') : (booking.seats || '12, 13');
    const formattedPrice = typeof booking.price === 'number' ? booking.price.toLocaleString() : (booking.price || '5,000');

    const statusLower = (booking.status || 'Upcoming').toLowerCase();
    const isUpcoming = statusLower.includes('upcoming') || statusLower.includes('confirm') || statusLower.includes('active');
    const isCancelled = statusLower.includes('cancel');

    const statusBg = isCancelled ? '#FEF2F2' : isUpcoming ? '#F0FDF4' : '#F5F3FF';
    const statusTextColor = isCancelled ? '#EF4444' : isUpcoming ? '#16A34A' : '#9333EA';

    const handleCopyId = () => {
        try {
            Clipboard.setString(displayBookingId);
        } catch (e) {
            // fallback
        }
        Alert.alert(t('copied') || 'Copied', `${displayBookingId} ${t('copied_to_clipboard') || 'copied to clipboard'}`);
    };

    return (
        <View style={styles.cardContainer}>
            {/* Top Header Section */}
            <View style={styles.headerRow}>
                <View style={styles.companyInfoContainer}>
                    <View style={styles.logoBox}>
                        <Image
                            source={
                                booking.busImage
                                    ? { uri: booking.busImage }
                                    : require('../../assets/png/buslogo-removebg-preview.png')
                            }
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.nameAndClass}>
                        <AppText size={16} weight="800" color={colors.SLATE_DARK} numberOfLines={1}>
                            {displayBusName}
                        </AppText>
                        <View style={styles.luxuryBadge}>
                            <AppText size={10} style={{ marginRight: 3 }}>
                                👑
                            </AppText>
                            <AppText size={11} weight="700" color={colors.BLUE_PRIMARY}>
                                {displayBusType}
                            </AppText>
                        </View>
                    </View>
                </View>

                {/* Right Side: Status Badge & Booking ID */}
                <View style={styles.headerRightSection}>
                    <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                        <AppText size={11} weight="700" color={statusTextColor}>
                            {booking.status || 'Upcoming'}
                        </AppText>
                    </View>

                    <View style={styles.bookingIdRow}>
                        <View style={{ alignItems: 'flex-end' }}>
                            <AppText size={10} color={colors.SLATE_MUTED} weight="500">
                                {t('booking_details_id') || 'Booking ID'}
                            </AppText>
                            <TouchableOpacity
                                style={styles.idCopyButton}
                                activeOpacity={0.7}
                                onPress={handleCopyId}
                            >
                                <AppText size={12} weight="800" color={colors.BLUE_PRIMARY} style={{ marginRight: scale(4) }}>
                                    {displayBookingId}
                                </AppText>
                                <Copy width={scale(12)} height={scale(12)} stroke={colors.BLUE_PRIMARY} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Route & Time Row */}
            <View style={styles.routeRow}>
                {/* Departure */}
                <View style={styles.timeLocContainer}>
                    <AppText size={18} weight="900" color={colors.SLATE_DARK}>
                        {displayDepartureTime}
                    </AppText>
                    <AppText size={14} color={colors.SLATE_MEDIUM} weight="700" numberOfLines={1} style={{ marginTop: 2 }}>
                        {displayFromCity}
                    </AppText>
                    <View style={styles.terminalRow}>
                        <LocationB width={scale(11)} height={scale(11)} color={colors.BLUE_PRIMARY} />
                        <AppText size={11} color={colors.SLATE_MEDIUM} weight="500" numberOfLines={1} style={{ marginLeft: 3 }}>
                            {displayFromTerminal}
                        </AppText>
                    </View>
                </View>

                {/* Duration & Route Graphic */}
                <View style={styles.durationContainer}>
                    <View style={styles.durationPill}>
                        <AppText size={10} weight="700" color={colors.SLATE_MEDIUM}>
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
                            <BusIcon width={scale(11)} height={scale(11)} color={colors.BLUE_PRIMARY} />
                        </View>
                    </View>

                    <AppText size={11} weight="700" color="#16A34A" style={{ marginTop: 2 }}>
                        {t('direct_route') || 'Direct'}
                    </AppText>
                </View>

                {/* Arrival */}
                <View style={[styles.timeLocContainer, { alignItems: 'flex-end' }]}>
                    <AppText size={18} weight="900" color={colors.SLATE_DARK}>
                        {displayArrivalTime}
                    </AppText>
                    <AppText size={14} color={colors.SLATE_MEDIUM} weight="700" numberOfLines={1} style={{ marginTop: 2 }}>
                        {displayToCity}
                    </AppText>
                    <View style={styles.terminalRow}>
                        <LocationB width={scale(11)} height={scale(11)} color={colors.BLUE_PRIMARY} />
                        <AppText size={11} color={colors.SLATE_MEDIUM} weight="500" numberOfLines={1} style={{ marginLeft: 3 }}>
                            {displayToTerminal}
                        </AppText>
                    </View>
                </View>
            </View>

            {/* Sub-card Info Section with Equal Column Division & Left-aligned Values */}
            <View style={styles.infoGridCard}>
                {/* 1. Journey Date */}
                <View style={styles.gridColumn}>
                    <View style={styles.iconWrap}>
                        <JourneyCalendar width={scale(14)} height={scale(14)} />
                    </View>
                    <View style={styles.columnTextWrap}>
                        <AppText size={9.5} color={colors.SLATE_MUTED} weight="600" numberOfLines={1}>
                            {t('date') || 'Date'}
                        </AppText>
                        <AppText size={9.5} weight="800" color="#1E40AF" numberOfLines={1} style={{ marginTop: verticalScale(1) }}>
                            {displayDate}
                        </AppText>
                        <AppText size={9.5} weight="600" color="#2563EB" numberOfLines={1}>
                            {displayDayOfWeek}
                        </AppText>
                    </View>
                </View>

                {/* 2. Seats */}
                <View style={styles.gridColumn}>
                    <View style={styles.iconWrap}>
                        <BusSeatOutline width={scale(14)} height={scale(14)} />
                    </View>
                    <View style={styles.columnTextWrap}>
                        <AppText size={9.5} color={colors.SLATE_MUTED} weight="600" numberOfLines={1}>
                            {t('seats_label') || 'Seats'}
                        </AppText>
                        <AppText size={10.5} weight="800" color="#1E40AF" numberOfLines={1} style={{ marginTop: verticalScale(1) }}>
                            {formattedSeatsCount} {t('seats_unit') || 'Seats'}
                        </AppText>
                        <AppText size={9.5} weight="600" color="#2563EB" numberOfLines={1}>
                            {formattedSeatsList}
                        </AppText>
                    </View>
                </View>

                {/* 3. Total Fare */}
                <View style={styles.gridColumn}>
                    <View style={styles.iconWrap}>
                        <TotalFareTag width={scale(14)} height={scale(14)} />
                    </View>
                    <View style={styles.columnTextWrap}>
                        <AppText size={9.5} color={colors.SLATE_MUTED} weight="600" numberOfLines={1}>
                            {t('total_fare') || 'Total Fare'}
                        </AppText>
                        <AppText size={11} weight="800" color="#1E40AF" numberOfLines={1} style={{ marginTop: verticalScale(1) }}>
                            Rs. {formattedPrice}
                        </AppText>
                    </View>
                </View>

                {/* 4. Payment */}
                <View style={styles.gridColumn}>
                    <View style={styles.iconWrap}>
                        <PaymentCard width={scale(14)} height={scale(14)} />
                    </View>
                    <View style={styles.columnTextWrap}>
                        <AppText size={9.5} color={colors.SLATE_MUTED} weight="600" numberOfLines={1}>
                            {t('payment_label') || 'Payment'}
                        </AppText>
                        <AppText size={10.5} weight="800" color="#16A34A" numberOfLines={1} style={{ marginTop: verticalScale(1) }}>
                            {booking.paymentStatus || 'Paid'}
                        </AppText>
                    </View>
                </View>
            </View>

            {/* Bottom Action Buttons Row */}
            <View style={styles.actionButtonsRow}>
                {/* View Details Button */}
                <TouchableOpacity
                    style={styles.viewDetailsButton}
                    onPress={onView}
                    activeOpacity={0.8}
                >
                    <Eye width={scale(14)} height={scale(14)} fill="#1D4ED8" />
                    <AppText size={12} weight="700" color="#1D4ED8" style={{ marginLeft: scale(6) }}>
                        {t('view_details') || 'View Details'}
                    </AppText>
                </TouchableOpacity>

                {/* Download Ticket Button */}
                <TouchableOpacity
                    style={styles.downloadTicketButton}
                    onPress={onDownload || onView}
                    activeOpacity={0.8}
                >
                    <Download width={scale(14)} height={scale(14)} fill={colors.WHITE} />
                    <AppText size={12} weight="700" color={colors.WHITE} style={{ marginLeft: scale(6) }}>
                        {t('download_ticket') || 'Download Ticket'}
                    </AppText>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.moreOptionsButton}
                    onPress={onMore || onView}
                    activeOpacity={0.8}
                >
                    <More width={scale(16)} height={scale(16)} fill={colors.SLATE_DARK} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default BookingCard;

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: colors.WHITE,
        borderRadius: scale(22),
        padding: scale(16),
        marginVertical: verticalScale(8),
        borderWidth: 1,
        borderColor: colors.BORDER_GREY,
        shadowColor: colors.BLUE_PRIMARY,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 14,
        elevation: 4,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    nameAndClass: {
        justifyContent: 'center',
        flex: 1,
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
    headerRightSection: {
        alignItems: 'flex-end',
    },
    statusBadge: {
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(4),
        borderRadius: scale(12),
        marginBottom: verticalScale(4),
    },
    bookingIdRow: {
        marginTop: verticalScale(2),
    },
    idCopyButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    divider: {
        height: 1,
        backgroundColor: colors.BORDER_GREY,
        marginVertical: verticalScale(12),
    },
    routeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: verticalScale(14),
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
    infoGridCard: {
        backgroundColor: '#F8FAFC',
        borderRadius: scale(16),
        paddingHorizontal: scale(2),
        paddingVertical: verticalScale(5),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        marginBottom: verticalScale(14),
    },
    gridColumn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: scale(2),
    },
    iconWrap: {
        marginTop: verticalScale(2),
        marginRight: scale(4),
    },
    columnTextWrap: {
        flex: 1,
    },
    actionButtonsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    viewDetailsButton: {
        flex: 1,
        paddingVertical: verticalScale(5),
        borderRadius: scale(8),
        borderWidth: 1,
        borderColor: '#CBD5E1',
        backgroundColor: colors.WHITE,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scale(8),
    },
    downloadTicketButton: {
        flex: 1.3,
        // height: verticalScale(40),
        paddingVertical: verticalScale(5),
        borderRadius: scale(8),
        backgroundColor: colors.BLUE_PRIMARY,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scale(8),
        shadowColor: colors.BLUE_PRIMARY,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    moreOptionsButton: {
        paddingVertical: verticalScale(5),
        borderRadius: scale(8),
        borderWidth: 1,
        borderColor: '#CBD5E1',
        backgroundColor: colors.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
