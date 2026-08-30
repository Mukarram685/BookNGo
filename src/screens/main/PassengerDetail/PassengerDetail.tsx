import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import AppButton from '../../../component/common/AppButton';
import Header from '../../../component/Header';
import colors, { Colors } from '../../../utils/colors';
import PassengerForm from '../../../component/Booking/PassengerForm';
import { BusSchedule } from '../../../interface/bus.interface';

const CNIC_REGEX = /^\d{5}-\d{7}-\d$/;

const PassengerDetail = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { schedule, selectedSeats }: { schedule: BusSchedule; selectedSeats: number[] } = route.params;

  const user = useSelector((state: any) => state.auth.user);
  const [isGroupBooking, setIsGroupBooking] = useState(true);

  const initialValues = {
    passengers: selectedSeats.map((seat, index) => ({
      seatNumber: seat,
      passengerName: index === 0 ? (user?.name || '') : '',
      passengerCNIC: index === 0 ? (user?.cnic || '') : '',
      passengerPhone: index === 0 ? (user?.phoneNumber?.toString() || '') : '',
      gender: 'Male' as const,
    })),
  };

  const individualPassengerSchema = Yup.object().shape({
    passengerName: Yup.string().required('Name is required'),
    passengerCNIC: Yup.string()
      .matches(CNIC_REGEX, 'Format: 00000-0000000-0')
      .required('CNIC is required'),
    passengerPhone: Yup.string().required('Phone is required'),
    gender: Yup.string().oneOf(['Male', 'Female']).required('Gender is required'),
  });

  const passengerSchema = Yup.object().shape({
    passengers: Yup.array().of(individualPassengerSchema),
  });

  const validate = (values: any) => {
    const errors: any = {};
    if (isGroupBooking) {
      try {
        individualPassengerSchema.validateSync(values.passengers[0], { abortEarly: false });
      } catch (err: any) {
        const passengerErrors: any = {};
        err.inner?.forEach((error: any) => {
          passengerErrors[error.path] = error.message;
        });
        errors.passengers = [passengerErrors];
      }
    }
    return errors;
  };

  const handleContinue = (values: any) => {
    let finalPassengers = values.passengers;

    if (isGroupBooking) {
      const firstPassenger = values.passengers[0];
      finalPassengers = selectedSeats.map(seat => ({
        ...firstPassenger,
        seatNumber: seat
      }));
    }

    navigation.navigate('BookingReview', {
      schedule,
      passengers: finalPassengers,
      totalAmount: schedule.price * selectedSeats.length
    });
  };

  return (
    <ScreenWrapper backgroundColor={Colors.BACKGROUND} header={<Header title={t('passenger_details_title') || "Passenger Details"} showBack={true} />}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={isGroupBooking ? undefined : passengerSchema}
          validate={validate}
          enableReinitialize={true}
          onSubmit={handleContinue}
        >
          {({ setFieldValue, handleSubmit, values, errors, touched }) => (
            <View style={styles.container}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                <View style={styles.toggleContainer}>
                  <View style={{ flex: 1 }}>
                    <AppText size={16} weight="700" color={Colors.PRIMARY}>{t('group_booking') || "Group Booking"}</AppText>
                    <AppText size={12} color={Colors.TEXT_GREY}>{t('group_booking_desc', { count: selectedSeats.length }) || `Use same details for all ${selectedSeats.length} seats`}</AppText>
                  </View>
                  <Switch
                    value={isGroupBooking}
                    onValueChange={setIsGroupBooking}
                    trackColor={{ false: '#CBD5E1', true: Colors.PRIMARY }}
                    thumbColor={Colors.WHITE}
                  />
                </View>

                {isGroupBooking ? (
                  <PassengerForm
                    seatNumber={values.passengers[0].seatNumber}
                    values={values.passengers[0]}
                    onChange={(field, val) => setFieldValue(`passengers[0].${field}`, val)}
                    errors={errors.passengers?.[0] as any}
                    touched={touched.passengers?.[0] as any}
                  />
                ) : (
                  values.passengers.map((passenger, index) => (
                    <PassengerForm
                      key={passenger.seatNumber}
                      seatNumber={passenger.seatNumber}
                      values={passenger}
                      onChange={(field, val) => setFieldValue(`passengers[${index}].${field}`, val)}
                      errors={errors.passengers?.[index as any]}
                      touched={touched.passengers?.[index as any]}
                    />
                  ))
                )}
              </ScrollView>

              <View style={styles.footer}>
                <AppButton
                  title={t('review_booking') || "Review Booking"}
                  onPress={handleSubmit as any}
                  style={styles.button}
                />
              </View>
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
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
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.SURFACE,
    padding: scale(18),
    borderRadius: scale(16),
    marginBottom: verticalScale(20),
    borderWidth: 1,
    borderColor: Colors.BORDER_GREY,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
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

export default PassengerDetail;