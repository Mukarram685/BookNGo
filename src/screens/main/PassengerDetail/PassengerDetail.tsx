import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import Header from '../../../component/Header';
import Colors, { alpha } from '../../../utils/Colors.util';
import PassengerForm from '../../../component/Booking/PassengerForm';
import { BusSchedule } from '../../../interface/bus.interface';

const CNIC_REGEX = /^\d{5}-\d{7}-\d$/;

const PassengerDetail = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { schedule, selectedSeats }: { schedule: BusSchedule; selectedSeats: number[] } = route.params;
  const { t } = useTranslation();

  const user = useSelector((state: any) => state.auth.user);
  const [isGroupBooking, setIsGroupBooking] = useState(false);

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
    <ScreenWrapper backgroundColor={Colors.DARK_BG} header={<Header title={t('passengerDetail_title')} />}>
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
                    <AppText size={16} weight="700" color={Colors.WHITE}>{t('passengerDetail_groupBooking')}</AppText>
                    <AppText size={12} color={Colors.TEXT_GREY}>{t('passengerDetail_groupBookingDesc', { count: selectedSeats.length })}</AppText>
                  </View>
                  <Switch
                    value={isGroupBooking}
                    onValueChange={setIsGroupBooking}
                    trackColor={{ false: '#3E3E3E', true: Colors.BRIGHT_BLUE }}
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
                <TouchableOpacity style={styles.button} onPress={handleSubmit as any}>
                  <AppText size={16} weight="700" color={Colors.WHITE}>{t('passengerDetail_reviewButton')}</AppText>
                </TouchableOpacity>
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
    paddingHorizontal: scale(20),
  },
  scrollContent: {
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(100),
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: alpha(Colors.WHITE, 0.05),
    padding: scale(15),
    borderRadius: scale(12),
    marginBottom: verticalScale(15),
    borderWidth: 1,
    borderColor: alpha(Colors.WHITE, 0.1),
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

export default PassengerDetail;