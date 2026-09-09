import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { scale, verticalScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { forgotPasswordEmailSchema } from '../../helpers/auth.helper';
import AppText from '../../component/common/AppText';
import AppInput from '../../component/TextInput/TextInput';
import ScreenWrapper from '../../component/common/ScreenWrapper';
import AppButton from '../../component/common/AppButton';
import colors, { Colors } from '../../utils/colors';
import { Bus, Lock, Mail, Arrow, ShieldCheck } from '../../assets/svg';
import { useForgotPassword, useVerifyOTP, useResetPassword } from '../../hooks/useForgotPassword';

const ForgotPassword = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const [step, setStep] = useState<'email' | 'verify' | 'reset'>('email');
  const [targetEmail, setTargetEmail] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const { mutate: requestOtp, isPending: isSendingOtp } = useForgotPassword();
  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOTP();
  const { mutate: resetPass, isPending: isResetting } = useResetPassword();

  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendOtp = (values: { email: string }) => {
    requestOtp(
      { email: values.email },
      {
        onSuccess: () => {
          setTargetEmail(values.email.trim().toLowerCase());
          setStep('verify');
          setResendTimer(60);
        },
      }
    );
  };

  const handleResendOtp = () => {
    if (resendTimer > 0 || !targetEmail) return;
    requestOtp(
      { email: targetEmail },
      {
        onSuccess: () => {
          setResendTimer(60);
        },
      }
    );
  };

  const handleVerifyOtp = (values: { otp: string }) => {
    const trimmedOtp = values.otp.trim();
    verifyOtp(
      {
        email: targetEmail,
        otp: trimmedOtp,
      },
      {
        onSuccess: () => {
          setEnteredOtp(trimmedOtp);
          setStep('reset');
        },
      }
    );
  };

  const handleResetPassword = (values: { newPassword: string; confirmPassword: string }) => {
    resetPass(
      {
        email: targetEmail,
        otp: enteredOtp,
        newPassword: values.newPassword,
      },
      {
        onSuccess: () => {
          navigation.navigate('Signin');
        },
      }
    );
  };

  return (
    <ScreenWrapper backgroundColor={Colors.BACKGROUND} isLoading={isSendingOtp || isVerifying || isResetting}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.PRIMARY} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Back Navigation Bar */}
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => {
            if (step === 'reset') {
              setStep('verify');
            } else if (step === 'verify') {
              setStep('email');
            } else {
              navigation.goBack();
            }
          }}
        >
          <Arrow width={scale(18)} height={scale(18)} fill={Colors.PRIMARY} />
          <AppText size={14} weight="700" color={Colors.PRIMARY} style={styles.backText}>
            {step === 'reset' ? 'Back to Verify' : step === 'verify' ? 'Change Email' : 'Back to Login'}
          </AppText>
        </TouchableOpacity>

        {/* Brand Header */}
        <View style={styles.headerContainer}>
          <Bus width={scale(40)} height={scale(40)} color={Colors.PRIMARY} />
          <AppText size={28} weight="700" color={Colors.PRIMARY} style={styles.brandName}>
            {t('app_name') || 'BookNGo'}
          </AppText>
        </View>

        {/* Step 1: Enter Email */}
        {step === 'email' ? (
          <Formik
            initialValues={{ email: targetEmail }}
            validationSchema={forgotPasswordEmailSchema}
            onSubmit={handleSendOtp}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.card}>
                <View style={styles.titleContainer}>
                  <AppText size={22} weight="800" color={Colors.PRIMARY} style={styles.welcomeText}>
                    Forgot Password? 🔐
                  </AppText>
                  <AppText size={13} color={Colors.DARK_GRAY} weight="500" style={styles.subtitleText}>
                    Enter your registered email address and we'll send you a 6-digit verification code to reset your password.
                  </AppText>
                </View>

                <AppInput
                  label="Email Address"
                  placeholder="Enter your email"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={touched.email && errors.email ? String(errors.email) : undefined}
                  LeftIcon={Mail}
                  placeholderTextColor={Colors.TEXT_GREY}
                  inputStyle={styles.inputStyle}
                  containerStyle={styles.inputContainer}
                />

                <AppButton
                  title="Send Verification Code"
                  onPress={handleSubmit as any}
                  style={styles.button}
                />

                <View style={styles.footer}>
                  <AppText size={13} color={Colors.DARK_GRAY}>
                    Remember your password?{' '}
                  </AppText>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Signin')}>
                    <AppText size={13} weight="700" color={Colors.PRIMARY}>
                      Sign In
                    </AppText>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        ) : step === 'verify' ? (
          /* Step 2: Verify OTP */
          <Formik
            initialValues={{ otp: '' }}
            validationSchema={Yup.object().shape({
              otp: Yup.string()
                .length(6, 'Verification code must be 6 digits')
                .required('Verification code is required'),
            })}
            onSubmit={handleVerifyOtp}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.card}>
                <View style={styles.titleContainer}>
                  <AppText size={22} weight="800" color={Colors.PRIMARY} style={styles.welcomeText}>
                    Verify Code �
                  </AppText>
                  <AppText size={13} color={Colors.DARK_GRAY} weight="500" style={styles.subtitleText}>
                    We sent a 6-digit code to{' '}
                    <AppText size={13} weight="700" color={Colors.PRIMARY}>
                      {targetEmail}
                    </AppText>
                    . Enter the code below to verify your identity.
                  </AppText>
                </View>

                <AppInput
                  label="6-Digit Verification Code"
                  placeholder="e.g. 583921"
                  value={values.otp}
                  onChangeText={handleChange('otp')}
                  onBlur={handleBlur('otp')}
                  keyboardType="number-pad"
                  maxLength={6}
                  error={touched.otp && errors.otp ? String(errors.otp) : undefined}
                  LeftIcon={ShieldCheck}
                  placeholderTextColor={Colors.TEXT_GREY}
                  inputStyle={[styles.inputStyle, styles.otpInput]}
                  containerStyle={styles.inputContainer}
                />

                <View style={styles.resendRow}>
                  <AppText size={12} color={Colors.DARK_GRAY}>
                    Didn't get the code?{' '}
                  </AppText>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleResendOtp}
                    disabled={resendTimer > 0}
                  >
                    <AppText
                      size={12}
                      weight="700"
                      color={resendTimer > 0 ? Colors.TEXT_GREY : Colors.SECONDARY}
                    >
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                    </AppText>
                  </TouchableOpacity>
                </View>

                <AppButton
                  title="Verify Code"
                  onPress={handleSubmit as any}
                  style={styles.button}
                />
              </View>
            )}
          </Formik>
        ) : (
          /* Step 3: Enter New Password */
          <Formik
            initialValues={{ newPassword: '', confirmPassword: '' }}
            validationSchema={Yup.object().shape({
              newPassword: Yup.string()
                .min(6, 'Password must be at least 6 characters')
                .required('New password is required'),
              confirmPassword: Yup.string()
                .oneOf([Yup.ref('newPassword')], 'Passwords must match')
                .required('Please confirm your new password'),
            })}
            onSubmit={handleResetPassword}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.card}>
                <View style={styles.titleContainer}>
                  <AppText size={22} weight="800" color={Colors.PRIMARY} style={styles.welcomeText}>
                    Reset Password 🔑
                  </AppText>
                  <AppText size={13} color={Colors.DARK_GRAY} weight="500" style={styles.subtitleText}>
                    Your identity has been verified. Please choose your new password.
                  </AppText>
                </View>

                <AppInput
                  label="New Password"
                  placeholder="At least 6 characters"
                  isPassword
                  value={values.newPassword}
                  onChangeText={handleChange('newPassword')}
                  onBlur={handleBlur('newPassword')}
                  error={touched.newPassword && errors.newPassword ? String(errors.newPassword) : undefined}
                  LeftIcon={Lock}
                  placeholderTextColor={Colors.TEXT_GREY}
                  inputStyle={styles.inputStyle}
                  containerStyle={styles.inputContainer}
                />

                <AppInput
                  label="Confirm New Password"
                  placeholder="Re-type new password"
                  isPassword
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  error={touched.confirmPassword && errors.confirmPassword ? String(errors.confirmPassword) : undefined}
                  LeftIcon={Lock}
                  placeholderTextColor={Colors.TEXT_GREY}
                  inputStyle={styles.inputStyle}
                  containerStyle={styles.inputContainer}
                />

                <AppButton
                  title="Reset Password"
                  onPress={handleSubmit as any}
                  style={styles.button}
                />
              </View>
            )}
          </Formik>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(30),
    justifyContent: 'center',
    flexGrow: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(16),
    alignSelf: 'flex-start',
    paddingVertical: verticalScale(6),
    paddingHorizontal: scale(4),
  },
  backText: {
    marginLeft: scale(8),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(20),
  },
  brandName: {
    marginLeft: scale(10),
    letterSpacing: 0.8,
  },
  card: {
    backgroundColor: Colors.WHITE,
    borderRadius: scale(20),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(24),
    borderWidth: 1,
    borderColor: Colors.BORDER_GREY,
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 5,
  },
  titleContainer: {
    marginBottom: verticalScale(18),
  },
  welcomeText: {
    marginBottom: verticalScale(6),
  },
  subtitleText: {
    lineHeight: verticalScale(18),
  },
  inputContainer: {
    marginBottom: verticalScale(16),
  },
  inputStyle: {
    backgroundColor: Colors.SURFACE,
    borderColor: Colors.BORDER_GREY,
    color: Colors.PRIMARY,
  },
  otpInput: {
    letterSpacing: 4,
    fontWeight: '700',
    fontSize: scale(16),
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(18),
    marginTop: verticalScale(4),
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: verticalScale(14),
    borderRadius: scale(12),
    alignItems: 'center',
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: verticalScale(18),
  },
});
