import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar, ScrollView, TextInput, Image } from 'react-native';
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
import { Lock, Mail, Arrow, ShieldCheck } from '../../assets/svg';
import { useForgotPassword, useVerifyOTP, useResetPassword } from '../../hooks/useForgotPassword';

interface OtpInputBoxesProps {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}

const OtpInputBoxes: React.FC<OtpInputBoxesProps> = ({ value, onChange, error }) => {
  const { t } = useTranslation();
  const inputsRef = useRef<Array<any>>([]);
  const digits = Array.from({ length: 6 }, (_, i) => (value && value[i]) || '');

  const handleChangeText = (text: string, index: number) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    if (!cleaned) {
      const newDigits = [...digits];
      newDigits[index] = '';
      onChange(newDigits.join(''));
      return;
    }

    if (cleaned.length > 1) {
      const pasted = cleaned.slice(0, 6);
      onChange(pasted);
      const nextFocus = Math.min(pasted.length, 5);
      inputsRef.current[nextFocus]?.focus();
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = cleaned;
    const newOtp = newDigits.join('');
    onChange(newOtp);

    if (index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
      }
    }
  };

  return (
    <View style={styles.otpSectionContainer}>
      <AppText size={12} weight="700" color={Colors.PRIMARY} style={{ marginBottom: verticalScale(6) }}>
        {t('auth_verify_code_label')}
      </AppText>
      <View style={styles.otpBoxesRow}>
        {Array.from({ length: 6 }).map((_, i) => {
          const hasVal = Boolean(digits[i]);
          return (
            <TextInput
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              style={[
                styles.otpBox,
                hasVal && styles.otpBoxActive,
                error ? styles.otpBoxError : null,
              ]}
              value={digits[i]}
              onChangeText={(text) => handleChangeText(text, i)}
              onKeyPress={(e) => handleKeyPress(e, i)}
              keyboardType="number-pad"
              maxLength={6}
              selectTextOnFocus
              placeholder="-"
              placeholderTextColor={Colors.TEXT_GREY}
            />
          );
        })}
      </View>
      {Boolean(error) && (
        <AppText size={11} color="#EF4444" style={styles.otpErrorText}>
          {error}
        </AppText>
      )}
    </View>
  );
};

const ForgotPassword = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const [step, setStep] = useState<'email' | 'verify' | 'reset'>('email');
  const [targetEmail, setTargetEmail] = useState('');
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
    verifyOtp(
      {
        email: targetEmail,
        otp: values.otp.trim(),
      },
      {
        onSuccess: () => {
          setStep('reset');
        },
      }
    );
  };

  const handleResetPassword = (values: { newPassword: string; confirmPassword: string }) => {
    resetPass(
      {
        email: targetEmail,
        otp: '', // OTP already verified in previous step
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
            {step === 'reset' ? t('back_to_verify') : step === 'verify' ? t('change_email') : t('back_to_login')}
          </AppText>
        </TouchableOpacity>

        {/* Brand Header */}
        <View style={styles.headerContainer}>
          <Image
            source={require('../../assets/png/app_icon.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <AppText size={28} weight="800" color={Colors.PRIMARY} style={styles.brandName}>
            {t('app_name') || 'Book&Go'}
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
                    {t('auth_forgot_title')}
                  </AppText>
                  <AppText size={13} color={Colors.DARK_GRAY} weight="500" style={styles.subtitleText}>
                    {t('auth_forgot_subtitle')}
                  </AppText>
                </View>

                <AppInput
                  label={t('auth_forgot_email_label')}
                  placeholder={t('auth_forgot_email_placeholder')}
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
                  title={t('auth_forgot_send_code')}
                  onPress={handleSubmit as any}
                  style={styles.button}
                />

                <View style={styles.footer}>
                  <AppText size={13} color={Colors.DARK_GRAY}>
                    {t('auth_forgot_remember')}{' '}
                  </AppText>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Signin')}>
                    <AppText size={13} weight="700" color={Colors.PRIMARY}>
                      {t('auth_forgot_sign_in')}
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
                .length(6, t('val_otp_length'))
                .required(t('val_otp_required')),
            })}
            onSubmit={handleVerifyOtp}
          >
            {({ setFieldValue, handleSubmit, values, errors, touched }) => (
              <View style={styles.card}>
                <View style={styles.titleContainer}>
                  <AppText size={22} weight="800" color={Colors.PRIMARY} style={styles.welcomeText}>
                    {t('auth_verify_title')}
                  </AppText>
                  <AppText size={13} color={Colors.DARK_GRAY} weight="500" style={styles.subtitleText}>
                    {t('auth_verify_subtitle', { email: targetEmail })}
                  </AppText>
                </View>

                <OtpInputBoxes
                  value={values.otp}
                  onChange={(val) => setFieldValue('otp', val)}
                  error={touched.otp && errors.otp ? String(errors.otp) : undefined}
                />

                <View style={styles.resendRow}>
                  <AppText size={12} color={Colors.DARK_GRAY}>
                    {t('auth_verify_didnt_get')}{' '}
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
                      {resendTimer > 0 ? t('auth_verify_resend_in', { seconds: resendTimer }) : t('auth_verify_resend')}
                    </AppText>
                  </TouchableOpacity>
                </View>

                <AppButton
                  title={t('auth_verify_button')}
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
                .min(6, t('val_password_min'))
                .required(t('val_new_password_required')),
              confirmPassword: Yup.string()
                .oneOf([Yup.ref('newPassword')], t('val_passwords_match'))
                .required(t('val_confirm_password_required')),
            })}
            onSubmit={handleResetPassword}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.card}>
                <View style={styles.titleContainer}>
                  <AppText size={22} weight="800" color={Colors.PRIMARY} style={styles.welcomeText}>
                    {t('auth_reset_title')}
                  </AppText>
                  <AppText size={13} color={Colors.DARK_GRAY} weight="500" style={styles.subtitleText}>
                    {t('auth_reset_subtitle')}
                  </AppText>
                </View>

                <AppInput
                  label={t('auth_reset_new_password')}
                  placeholder={t('auth_reset_new_password_placeholder')}
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
                  label={t('auth_reset_confirm_password')}
                  placeholder={t('auth_reset_confirm_password_placeholder')}
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
                  title={t('auth_reset_button')}
                  onPress={handleSubmit as any}
                  style={styles.button}
                />
              </View>
            )}
          </Formik>
        )}
    </ScreenWrapper>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  scrollContainer: {
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
  logoImage: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(10),
  },
  brandName: {
    marginLeft: scale(10),
    letterSpacing: 0.5,
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
  otpSectionContainer: {
    marginBottom: verticalScale(16),
  },
  otpBoxesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: verticalScale(8),
  },
  otpBox: {
    width: scale(42),
    height: scale(50),
    borderRadius: scale(12),
    borderWidth: 1.5,
    borderColor: Colors.BORDER_GREY,
    backgroundColor: Colors.SURFACE,
    textAlign: 'center',
    fontSize: scale(18),
    fontWeight: '800',
    color: Colors.PRIMARY,
  },
  otpBoxActive: {
    borderColor: Colors.PRIMARY,
    backgroundColor: Colors.WHITE,
  },
  otpBoxError: {
    borderColor: '#EF4444',
  },
  otpErrorText: {
    marginTop: verticalScale(4),
    marginLeft: scale(2),
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
