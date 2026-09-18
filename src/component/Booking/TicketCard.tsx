import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { scale, verticalScale } from 'react-native-size-matters';
import AppText from '../common/AppText';
import colors, { Colors } from '../../utils/colors';
import { formatCNIC } from '../../helpers/auth.helper';

export interface TicketCardProps {
    booking: any;
}

const TicketCard: React.FC<TicketCardProps> = ({ booking }) => {
    const { t } = useTranslation();
    const rawBooking = booking?.fullData || booking || {};

    const currentStatus = (
        rawBooking?.bookingStatus ||
        booking?.status ||
        'confirmed'
    ).toLowerCase();
    const isCancelled = currentStatus === 'cancelled';
    const isCompleted = currentStatus === 'completed';
    const isRescheduled = Boolean(
        rawBooking?.rescheduledAt ||
        (rawBooking?.rescheduleHistory && rawBooking.rescheduleHistory.length > 0)
    );

    const getStatusBadgeStyle = () => {
        if (currentStatus === 'confirmed') {
            if (isRescheduled) {
                return { bg: '#EFF6FF', text: '#2563EB', label: 'RESCHEDULED' };
            }
            return { bg: '#E6F7ED', text: '#2CC93C', label: 'CONFIRMED' };
        } else if (currentStatus === 'completed') {
            return { bg: '#E0F2FE', text: '#0284C7', label: 'COMPLETED' };
        } else if (currentStatus === 'cancelled') {
            return { bg: '#FEE2E2', text: '#DC2626', label: 'CANCELLED' };
        }
        return {
            bg: '#FEF3C7',
            text: '#D97706',
            label: (currentStatus || 'PENDING').toUpperCase(),
        };
    };

    const badge = getStatusBadgeStyle();

    const displayBookingId =
        booking?.bookingId ||
        rawBooking?.pnrNumber ||
        (rawBooking?._id ? `BNG-${rawBooking._id.slice(-6).toUpperCase()}` : 'BNG-784512');

    const seatsList = rawBooking?.seats || booking?.seats;
    const seatNumbers = Array.isArray(seatsList)
        ? seatsList
            .map((s: any) => (typeof s === 'object' ? s?.seatNumber || s?.seatNo || s : s))
            .filter(Boolean)
            .join(', ')
        : typeof seatsList === 'string'
        ? seatsList
        : '12, 13';

    const busNumber =
        rawBooking?.schedule?.bus?.busNumber ||
        rawBooking?.schedule?.bus?.name ||
        booking?.busName ||
        'BS-4592';

    const routeStr = booking?.route || '';
    const routeParts = typeof routeStr === 'string' ? routeStr.split(' to ') : [];
    const fromCity =
        rawBooking?.schedule?.route?.fromCity ||
        rawBooking?.fromCity ||
        booking?.fromCity ||
        routeParts[0] ||
        'Lahore';
    const toCity =
        rawBooking?.schedule?.route?.toCity ||
        rawBooking?.toCity ||
        booking?.toCity ||
        routeParts[1] ||
        'Karachi';

    const pnr =
        rawBooking?.pnr ||
        rawBooking?.pnrNumber ||
        booking?.bookingId ||
        displayBookingId;

    const dateFormatted =
        booking?.date ||
        (rawBooking?.schedule?.departureDate
            ? new Date(rawBooking.schedule.departureDate).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            })
            : '20 May 2025');

    const timeFormatted =
        booking?.time || rawBooking?.schedule?.departureTime || '08:00';

    const passengerName =
        rawBooking?.seats?.[0]?.passengerName ||
        rawBooking?.user?.name ||
        booking?.name ||
        booking?.passengerName ||
        'Passenger';
    const passengerPhone =
        rawBooking?.seats?.[0]?.passengerPhone ||
        rawBooking?.user?.phone ||
        rawBooking?.user?.phoneNumber ||
        booking?.phone ||
        booking?.passengerPhone ||
        '';
    const passengerGender =
        rawBooking?.seats?.[0]?.gender ||
        rawBooking?.user?.gender ||
        booking?.gender ||
        'Male';
    const passengerCNIC =
        rawBooking?.seats?.[0]?.passengerCNIC ||
        rawBooking?.user?.cnic ||
        rawBooking?.passengerCNIC ||
        booking?.cnic ||
        booking?.passengerCNIC ||
        '';

    const ticketPrice =
        typeof booking?.price === 'number'
            ? booking.price
            : typeof rawBooking?.totalAmount === 'number'
            ? rawBooking.totalAmount
            : typeof rawBooking?.fare === 'number'
            ? rawBooking.fare
            : 5000;
    const serviceFee = booking?.serviceFee || rawBooking?.serviceFee || 0;
    const totalAmount = ticketPrice + serviceFee;

    return (
        <View style={styles.unifiedTicketCard}>
            {/* Header */}
            <View style={styles.ticketHeader}>
                <View>
                    <AppText size={18} weight="900" color="#172C6B">
                        BookNGo
                    </AppText>
                    <AppText size={10} weight="700" color={Colors.TEXT_GREY} style={{ letterSpacing: 0.5 }}>
                        OFFICIAL E-TICKET / BOARDING PASS
                    </AppText>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                    <AppText size={11} weight="800" color={badge.text}>
                        {badge.label}
                    </AppText>
                </View>
            </View>

            {/* Booking ID & PNR Banner */}
            <View style={styles.pnrBanner}>
                <View style={styles.pnrTopRow}>
                    <View>
                        <AppText size={10} color={Colors.TEXT_GREY} weight="800" style={{ letterSpacing: 0.5 }}>
                            PNR NUMBER
                        </AppText>
                        <AppText size={15} weight="900" color="#172C6B" style={{ marginTop: 2 }}>
                            {pnr}
                        </AppText>
                    </View>
                </View>

                <View style={styles.pnrDivider} />

                <View style={styles.pnrBottomRow}>
                    <AppText size={10} color={Colors.TEXT_GREY} weight="800" style={{ letterSpacing: 0.5 }}>
                        BOOKING ID:
                    </AppText>
                    <AppText size={12} weight="800" color={Colors.PRIMARY} style={{ marginLeft: scale(6), flex: 1 }} numberOfLines={1}>
                        #{booking?.id || rawBooking?._id || displayBookingId}
                    </AppText>
                </View>
            </View>

            {/* Route Section */}
            <View style={styles.routeSection}>
                <View style={styles.cityInfo}>
                    <AppText size={20} weight="800" color={Colors.PRIMARY}>
                        {fromCity}
                    </AppText>
                    <AppText
                        size={11}
                        color={Colors.TEXT_GREY}
                        weight="600"
                        style={{ marginTop: 2 }}
                    >
                        {t('booking_details_departure') || 'Departure'}
                    </AppText>
                </View>

                <View style={styles.busIconContainer}>
                    <View style={styles.line} />
                    <View style={styles.dot} />
                    <View style={styles.line} />
                </View>

                <View style={[styles.cityInfo, { alignItems: 'flex-end' }]}>
                    <AppText size={20} weight="800" color={Colors.PRIMARY}>
                        {toCity}
                    </AppText>
                    <AppText
                        size={11}
                        color={Colors.TEXT_GREY}
                        weight="600"
                        style={{ marginTop: 2 }}
                    >
                        {t('booking_details_arrival') || 'Arrival'}
                    </AppText>
                </View>
            </View>

            {/* Primary Journey Grid */}
            <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                    <AppText size={10} color={Colors.TEXT_GREY} weight="700">
                        {t('booking_details_date') || 'DATE'}
                    </AppText>
                    <AppText size={13} weight="700" color={Colors.PRIMARY} style={{ marginTop: 2 }}>
                        {dateFormatted}
                    </AppText>
                </View>
                <View style={styles.infoItem}>
                    <AppText size={10} color={Colors.TEXT_GREY} weight="700">
                        {t('booking_details_time') || 'TIME'}
                    </AppText>
                    <AppText size={13} weight="700" color={Colors.PRIMARY} style={{ marginTop: 2 }}>
                        {timeFormatted}
                    </AppText>
                </View>
            </View>

            <View style={[styles.infoGrid, { marginTop: verticalScale(12) }]}>
                <View style={styles.infoItem}>
                    <AppText size={10} color={Colors.TEXT_GREY} weight="700">
                        {t('booking_details_bus_number') || 'BUS NUMBER'}
                    </AppText>
                    <AppText size={13} weight="700" color={Colors.PRIMARY} style={{ marginTop: 2 }}>
                        {busNumber}
                    </AppText>
                </View>
                <View style={styles.infoItem}>
                    <AppText size={10} color={Colors.TEXT_GREY} weight="700">
                        {t('booking_details_seat_number') || 'SEAT NUMBER(S)'}
                    </AppText>
                    <AppText size={13} weight="800" color="#172C6B" style={{ marginTop: 2 }}>
                        #{seatNumbers}
                    </AppText>
                </View>
            </View>

            {/* Perforated Ticket Divider with Cutout Notches */}
            <View style={styles.notchContainer}>
                <View style={styles.notchLeft} />
                <View style={styles.dashedLine} />
                <View style={styles.notchRight} />
            </View>

            {/* Passenger Information Section */}
            <View style={styles.sectionInner}>
                <AppText size={13} weight="800" color={Colors.PRIMARY} style={{ marginBottom: verticalScale(8) }}>
                    {t('booking_details_passenger_info') || 'Passenger Information'}
                </AppText>
                {Array.isArray(rawBooking?.seats) && rawBooking.seats.length > 1 ? (
                    rawBooking.seats.map((seat: any, index: number) => (
                        <View key={index} style={[styles.passengerSubCard, index > 0 && { marginTop: verticalScale(8) }]}>
                            <View style={styles.detailRow}>
                                <AppText size={12} color={Colors.DARK_GRAY} weight="600">
                                    {t('booking_details_name') || 'Name'}{' '}
                                    {seat.seatNumber ? `(Seat ${seat.seatNumber})` : `(${index + 1})`}
                                </AppText>
                                <AppText size={13} weight="700" color={Colors.PRIMARY}>
                                    {seat.passengerName || passengerName}
                                </AppText>
                            </View>
                            {seat.passengerCNIC || passengerCNIC ? (
                                <View style={styles.detailRow}>
                                    <AppText size={12} color={Colors.DARK_GRAY} weight="600">
                                        {t('label_cnic') || 'CNIC'}
                                    </AppText>
                                    <AppText size={13} weight="700" color={Colors.PRIMARY}>
                                        {formatCNIC(seat.passengerCNIC || passengerCNIC)}
                                    </AppText>
                                </View>
                            ) : null}
                            {seat.passengerPhone || passengerPhone ? (
                                <View style={styles.detailRow}>
                                    <AppText size={12} color={Colors.DARK_GRAY} weight="600">
                                        {t('booking_details_phone') || 'Phone'}
                                    </AppText>
                                    <AppText size={13} weight="700" color={Colors.PRIMARY}>
                                        {seat.passengerPhone || passengerPhone}
                                    </AppText>
                                </View>
                            ) : null}
                            <View style={styles.detailRow}>
                                <AppText size={12} color={Colors.DARK_GRAY} weight="600">
                                    {t('booking_details_gender') || 'Gender'}
                                </AppText>
                                <AppText size={13} weight="700" color={Colors.PRIMARY}>
                                    {seat.gender || passengerGender}
                                </AppText>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.passengerSubCard}>
                        <View style={styles.detailRow}>
                            <AppText size={12} color={Colors.DARK_GRAY} weight="600">
                                {t('booking_details_name') || 'Name'}
                            </AppText>
                            <AppText size={13} weight="700" color={Colors.PRIMARY}>
                                {passengerName}
                            </AppText>
                        </View>
                        {passengerCNIC ? (
                            <View style={styles.detailRow}>
                                <AppText size={12} color={Colors.DARK_GRAY} weight="600">
                                    {t('label_cnic') || 'CNIC'}
                                </AppText>
                                <AppText size={13} weight="700" color={Colors.PRIMARY}>
                                    {formatCNIC(passengerCNIC)}
                                </AppText>
                            </View>
                        ) : null}
                        {passengerPhone ? (
                            <View style={styles.detailRow}>
                                <AppText size={12} color={Colors.DARK_GRAY} weight="600">
                                    {t('booking_details_phone') || 'Phone'}
                                </AppText>
                                <AppText size={13} weight="700" color={Colors.PRIMARY}>
                                    {passengerPhone}
                                </AppText>
                            </View>
                        ) : null}
                        <View style={styles.detailRow}>
                            <AppText size={12} color={Colors.DARK_GRAY} weight="600">
                                {t('booking_details_gender') || 'Gender'}
                            </AppText>
                            <AppText size={13} weight="700" color={Colors.PRIMARY}>
                                {passengerGender}
                            </AppText>
                        </View>
                    </View>
                )}
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
                            {t('booking_details_ticket_fare') || 'Ticket Fare'}
                        </AppText>
                        <AppText size={13} weight="700" color={Colors.PRIMARY}>
                            Rs. {ticketPrice.toLocaleString()}
                        </AppText>
                    </View>
                    <View style={styles.detailRow}>
                        <AppText size={12} color={Colors.DARK_GRAY} weight="600">
                            {t('booking_details_service_fee') || 'Service Fee'}
                        </AppText>
                        <AppText size={13} weight="700" color={Colors.PRIMARY}>
                            Rs. {serviceFee}
                        </AppText>
                    </View>
                    <View style={styles.dividerSmall} />
                    <View style={styles.detailRow}>
                        <AppText size={14} weight="800" color={Colors.PRIMARY}>
                            {t('booking_details_total') || 'Total Paid'}
                        </AppText>
                        <AppText size={16} weight="900" color="#172C6B">
                            Rs. {totalAmount.toLocaleString()}
                        </AppText>
                    </View>
                </View>
            </View>

            {/* Footer / Barcode */}
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
    );
};

export default TicketCard;

const styles = StyleSheet.create({
    unifiedTicketCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: scale(20),
        padding: scale(18),
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginVertical: verticalScale(12),
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
        paddingBottom: verticalScale(10),
    },
    statusBadge: {
        paddingHorizontal: scale(12),
        paddingVertical: scale(5),
        borderRadius: scale(8),
        marginBottom: verticalScale(14),
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
    pnrDivider: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: verticalScale(8),
    },
    pnrBottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
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
    busIconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: scale(10),
    },
    line: {
        height: 1,
        width: scale(20),
        backgroundColor: Colors.TEXT_GREY,
        opacity: 0.3,
    },
    dot: {
        width: scale(8),
        height: scale(8),
        borderRadius: scale(4),
        backgroundColor: '#172C6B',
        marginHorizontal: scale(5),
    },
    infoGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    infoItem: {
        flex: 1,
    },
    notchContainer: {
        position: 'relative',
        height: scale(30),
        justifyContent: 'center',
        marginVertical: verticalScale(10),
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
        marginVertical: verticalScale(12),
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
});
