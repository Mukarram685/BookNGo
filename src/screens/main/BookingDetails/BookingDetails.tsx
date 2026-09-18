import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
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
import { Colors } from '../../../utils/colors';
import Header from '../../../component/Header';
import AppButton from '../../../component/common/AppButton';
import { useCancelBooking } from '../../../hooks/useCancelBooking';
import TicketCard from '../../../component/Booking/TicketCard';

type BookingDetailsRouteProp = RouteProp<
  { BookingDetails: { booking: any } },
  'BookingDetails'
>;

const BookingDetails = () => {
  const { t } = useTranslation();
  const route = useRoute<BookingDetailsRouteProp>();
  const navigation = useNavigation<any>();
  const routeParams = route?.params || {};
  const booking = routeParams?.booking || {};
  const rawBooking = booking?.fullData || booking;
  const viewShotRef = useRef<any>(null);
  const cancelBookingMutation = useCancelBooking();

  const currentStatus = (
    rawBooking?.bookingStatus ||
    booking?.status ||
    'confirmed'
  ).toLowerCase();
  const isCancelled = currentStatus === 'cancelled';
  const isCompleted = currentStatus === 'completed';
  const canCancel = !isCancelled && !isCompleted;

  const handleCancelBooking = () => {
    Alert.alert(
      t('cancel_booking_title') || 'Cancel Booking',
      t('cancel_booking_confirm') ||
        'Are you sure you want to cancel this booking?',
      [
        { text: t('no') || 'No', style: 'cancel' },
        {
          text: t('yes_cancel') || 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            cancelBookingMutation.mutate(
              { bookingId: booking?.id || rawBooking?._id },
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
                    text2:
                      err?.response?.data?.message ||
                      err?.data?.message ||
                      'Could not cancel booking',
                  });
                },
              },
            );
          },
        },
      ],
    );
  };

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
      header={
        <Header
          title={t('booking_details_title') || 'Booking Details'}
          showBack={true}
          showShareButton={true}
          onShare={shareTicket}
        />
      }
    >
      <View style={styles.scrollWrapper}>
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.95 }}>
          <TicketCard booking={booking} />
        </ViewShot>

        <View style={styles.actions}>
          {canCancel && (
            <>
              <AppButton
                title="Reschedule Ticket"
                variant="outline"
                style={styles.rescheduleButton}
                textStyle={{ color: Colors.PRIMARY }}
                onPress={() => {
                  navigation.navigate('RescheduleTrip', {
                    booking: rawBooking || booking,
                  });
                }}
              />
              <AppButton
                title={
                  cancelBookingMutation.isPending
                    ? 'Cancelling...'
                    : t('booking_details_cancel') || 'Cancel Booking'
                }
                variant="danger-outline"
                style={styles.cancelButton}
                onPress={handleCancelBooking}
                disabled={cancelBookingMutation.isPending}
              />
            </>
          )}
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollWrapper: {
    paddingBottom: verticalScale(25),
  },
  actions: {
    marginTop: verticalScale(12),
    gap: scale(12),
  },
  rescheduleButton: {
    minHeight: scale(48),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(16),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.PRIMARY,
    backgroundColor: Colors.SURFACE,
  },
  cancelButton: {
    minHeight: scale(48),
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(16),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.RED,
    backgroundColor: Colors.SURFACE,
  },
});

export default BookingDetails;
