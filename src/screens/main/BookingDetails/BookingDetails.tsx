import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { scale, verticalScale } from 'react-native-size-matters';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import Toast from 'react-native-toast-message';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import Colors from '../../../utils/Colors.util';
import Header from '../../../component/Header';
import AppButton from '../../../component/common/AppButton';
import { useCancelBooking } from '../../../hooks/useCancelBooking';

type BookingDetailsRouteProp = RouteProp<
  { BookingDetails: { booking: any } },
  'BookingDetails'
>;

const BookingDetails = () => {
  const { t } = useTranslation();
  const route = useRoute<BookingDetailsRouteProp>();
  const navigation = useNavigation<any>();
  const { booking } = route.params;
  const fullData = booking.fullData;
  const viewShotRef = useRef<any>(null);
  const cancelBookingMutation = useCancelBooking();

  const currentStatus = (fullData?.bookingStatus || booking.status || 'confirmed').toLowerCase();
  const isCancelled = currentStatus === 'cancelled';
  const isCompleted = currentStatus === 'completed';
  const canCancel = !isCancelled && !isCompleted;

  const getStatusBadgeStyle = () => {
    if (currentStatus === 'confirmed') {
      return { bg: '#E6F7ED', text: '#2CC93C', label: 'CONFIRMED' };
    } else if (currentStatus === 'completed') {
      return { bg: '#E0F2FE', text: '#0284C7', label: 'COMPLETED' };
    } else if (currentStatus === 'cancelled') {
      return { bg: '#FEE2E2', text: '#DC2626', label: 'CANCELLED' };
    }
    return { bg: '#FEF3C7', text: '#D97706', label: (currentStatus || 'PENDING').toUpperCase() };
  };

  const badge = getStatusBadgeStyle();

  const handleCancelBooking = () => {
    Alert.alert(
      t('cancel_booking_title') || 'Cancel Booking',
      t('cancel_booking_confirm') || 'Are you sure you want to cancel this booking?',
      [
        { text: t('no') || 'No', style: 'cancel' },
        {
          text: t('yes_cancel') || 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            cancelBookingMutation.mutate(
              { bookingId: booking.id || fullData?._id },
              {
                onSuccess: () => {
                  Toast.show({
                    type: 'success',
                    text1: 'Booking Cancelled',
                    text2: 'Your booking has been cancelled successfully.',
                  });
                  navigation.goBack();
                },
                onError: (err: any) => {
                  Toast.show({
                    type: 'error',
                    text1: 'Cancellation Failed',
                    text2: err?.response?.data?.message || err?.data?.message || 'Could not cancel booking',
                  });
                },
              }
            );
          },
        },
      ]
    );
  };

  const seatNumbers =
    fullData?.seats?.map((s: any) => s.seatNumber).join(', ') || 'N/A';
  const busNumber = fullData?.schedule?.bus?.busNumber || 'BS-4592';
  const fromCity =
    fullData?.schedule?.route?.fromCity || booking.route.split(' to ')[0];
  const toCity =
    fullData?.schedule?.route?.toCity || booking.route.split(' to ')[1];
  const pnr = fullData?.pnr || 'PNR-NOT-FOUND';

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
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
        title: 'BookNGo Ticket Details',
        url: uri,
        type: 'image/png',
      };
      await Share.open(options);
    } catch (error) {
      console.log('Error sharing/downloading ticket:', error);
    }
  };

  return (
    <ScreenWrapper
      header={<Header title={t('booking_details_title') || "Booking Details"} showBack={true} />}
    >
      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.9 }}>
        <View
          style={{
            paddingBottom: scale(10),
          }}
        >
          <View style={styles.headerInfoCard}>
            <View style={styles.headerRow}>
              <AppText size={11} color={Colors.TEXT_GREY} weight="800">
                {t('booking_details_id') || "BOOKING ID"}
              </AppText>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: badge.bg },
                ]}
              >
                <AppText
                  size={11}
                  weight="800"
                  color={badge.text}
                >
                  {badge.label}
                </AppText>
              </View>
            </View>
            <AppText
              size={15}
              weight="800"
              color={Colors.PRIMARY}
              style={{ marginTop: verticalScale(6) }}
            >
              #{booking.id}
            </AppText>
          </View>

          {/* Main Ticket Info Card */}
          <View style={styles.ticketCard}>
            <View style={styles.routeSection}>
              <View style={styles.cityInfo}>
                <AppText size={24} weight="900" color={Colors.PRIMARY}>
                  {fromCity}
                </AppText>
                <AppText
                  size={12}
                  color={Colors.TEXT_GREY}
                  weight="600"
                  style={{ marginTop: 2 }}
                >
                  {t('booking_details_departure') || "Departure"}
                </AppText>
              </View>

              <View style={styles.busIconContainer}>
                <View style={styles.line} />
                <View style={styles.dot} />
                <View style={styles.line} />
              </View>

              <View style={[styles.cityInfo, { alignItems: 'flex-end' }]}>
                <AppText size={24} weight="900" color={Colors.PRIMARY}>
                  {toCity}
                </AppText>
                <AppText
                  size={12}
                  color={Colors.TEXT_GREY}
                  weight="600"
                  style={{ marginTop: 2 }}
                >
                  {t('booking_details_arrival') || "Arrival"}
                </AppText>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <AppText size={11} color={Colors.TEXT_GREY} weight="700">
                  {t('booking_details_date') || "DATE"}
                </AppText>
                <AppText
                  size={14}
                  weight="600"
                  color={Colors.PRIMARY}
                  style={{ marginTop: 2 }}
                >
                  {booking.date}
                </AppText>
              </View>
              <View style={styles.infoItem}>
                <AppText size={11} color={Colors.TEXT_GREY} weight="700">
                  {t('booking_details_time') || "TIME"}
                </AppText>
                <AppText
                  size={14}
                  weight="600"
                  color={Colors.PRIMARY}
                  style={{ marginTop: 2 }}
                >
                  {booking.time}
                </AppText>
              </View>
            </View>

            <View style={[styles.infoGrid, { marginTop: scale(18) }]}>
              <View style={styles.infoItem}>
                <AppText size={11} color={Colors.TEXT_GREY} weight="700">
                  {t('booking_details_bus_number') || "BUS NUMBER"}
                </AppText>
                <AppText
                  size={14}
                  weight="600"
                  color={Colors.PRIMARY}
                  style={{ marginTop: 2 }}
                >
                  {busNumber}
                </AppText>
              </View>
              <View style={styles.infoItem}>
                <AppText size={11} color={Colors.TEXT_GREY} weight="700">
                  {t('booking_details_seat_number') || "SEAT NUMBER(S)"}
                </AppText>
                <AppText
                  size={14}
                  weight="600"
                  color={Colors.PRIMARY}
                  style={{ marginTop: 2 }}
                >
                  {seatNumbers}
                </AppText>
              </View>
            </View>

            <View style={[styles.infoGrid, { marginTop: scale(18) }]}>
              <View style={styles.infoItem}>
                <AppText size={11} color={Colors.TEXT_GREY} weight="700">
                  {t('booking_details_pnr') || "PNR NUMBER"}
                </AppText>
                <AppText
                  size={14}
                  weight="800"
                  color="#172C6B"
                  style={{ marginTop: 2 }}
                >
                  {pnr}
                </AppText>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <AppText
              size={15}
              weight="bold"
              color={Colors.PRIMARY}
              style={styles.sectionTitle}
            >
              {t('booking_details_passenger_info') || "Passenger Information"}
            </AppText>
            <View style={styles.detailCard}>
              <View style={styles.detailRow}>
                <AppText size={13} color={Colors.DARK_GRAY} weight="600">
                  {t('booking_details_name') || "Name"}
                </AppText>
                <AppText size={14} weight="700" color={Colors.PRIMARY}>
                  {fullData?.seats?.[0]?.passengerName || 'Mukarram Ali'}
                </AppText>
              </View>
              <View style={styles.detailRow}>
                <AppText size={13} color={Colors.DARK_GRAY} weight="600">
                  {t('booking_details_phone') || "Phone"}
                </AppText>
                <AppText size={14} weight="700" color={Colors.PRIMARY}>
                  {fullData?.seats?.[0]?.passengerPhone || '+92 312 4567890'}
                </AppText>
              </View>
              <View style={styles.detailRow}>
                <AppText size={13} color={Colors.DARK_GRAY} weight="600">
                  {t('booking_details_gender') || "Gender"}
                </AppText>
                <AppText size={14} weight="700" color={Colors.PRIMARY}>
                  {fullData?.seats?.[0]?.gender || 'Male'}
                </AppText>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <AppText
              size={15}
              weight="bold"
              color={Colors.PRIMARY}
              style={styles.sectionTitle}
            >
              {t('booking_details_payment_summary') || "Payment Summary"}
            </AppText>
            <View style={styles.detailCard}>
              <View style={styles.detailRow}>
                <AppText size={13} color={Colors.DARK_GRAY} weight="600">
                  {t('booking_details_ticket_fare') || "Ticket Fare"}
                </AppText>
                <AppText size={14} weight="700" color={Colors.PRIMARY}>
                  Rs. {booking.price}
                </AppText>
              </View>
              <View style={styles.detailRow}>
                <AppText size={13} color={Colors.DARK_GRAY} weight="600">
                  {t('booking_details_service_fee') || "Service Fee"}
                </AppText>
                <AppText size={14} weight="700" color={Colors.PRIMARY}>
                  Rs. {booking.serviceFee || 0}
                </AppText>
              </View>
              <View style={styles.dividerSmall} />
              <View style={styles.detailRow}>
                <AppText size={15} weight="bold" color={Colors.PRIMARY}>
                  {t('booking_details_total') || "Total Amount"}
                </AppText>
                <AppText size={17} weight="900" color={Colors.PRIMARY}>
                  Rs. {booking.price}
                </AppText>
              </View>
            </View>
          </View>
        </View>
      </ViewShot>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <AppButton
          title={t('booking_details_share') || "Share Ticket"}
          onPress={shareTicket}
          style={styles.downloadButton}
        />
        {canCancel && (
          <AppButton
            title={cancelBookingMutation.isPending ? 'Cancelling...' : (t('booking_details_cancel') || "Cancel Booking")}
            variant="danger-outline"
            style={styles.cancelButton}
            onPress={handleCancelBooking}
            disabled={cancelBookingMutation.isPending}
          />
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  headerInfoCard: {
    backgroundColor: Colors.SURFACE,
    borderRadius: scale(16),
    paddingHorizontal: scale(18),
    paddingVertical: scale(10),
    borderWidth: 1,
    borderColor: Colors.BORDER_GREY,
    marginVertical: verticalScale(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: scale(14),
    paddingVertical: scale(6),
    borderRadius: scale(8),
  },
  ticketCard: {
    backgroundColor: Colors.SURFACE,
    borderRadius: scale(16),
    padding: scale(18),
    borderWidth: 1,
    borderColor: Colors.BORDER_GREY,
    marginBottom: scale(25),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  routeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(15),
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
    backgroundColor: '#172C6B', // Brand Navy Dot
    marginHorizontal: scale(5),
  },
  divider: {
    height: 1,
    backgroundColor: Colors.BORDER_GREY,
    marginVertical: scale(16),
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
  },
  section: {
    marginBottom: scale(25),
  },
  sectionTitle: {
    marginBottom: scale(10),
    marginLeft: scale(4),
  },
  detailCard: {
    backgroundColor: Colors.SURFACE,
    borderRadius: scale(16),
    padding: scale(16),
    borderWidth: 1,
    borderColor: Colors.BORDER_GREY,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  dividerSmall: {
    height: 1,
    backgroundColor: Colors.BORDER_GREY,
    marginVertical: scale(10),
  },
  actions: {
    marginTop: scale(10),
    gap: scale(12),
  },
  downloadButton: {
    backgroundColor: '#172C6B', // Brand Navy
    height: scale(48),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3,
  },
  cancelButton: {
    height: scale(48),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.RED,
    backgroundColor: Colors.SURFACE,
  },
});

export default BookingDetails;
