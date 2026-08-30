import React from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Formik } from 'formik';
import { scale, verticalScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import { loginSchema } from '../../helpers/auth.helper';
import AppText from '../../component/common/AppText';
import AppInput from '../../component/TextInput/TextInput';
import ScreenWrapper from '../../component/common/ScreenWrapper';
import AppButton from '../../component/common/AppButton';
import colors, { Colors } from '../../utils/colors';
import { Bus, Lock, User } from '../../assets/svg';
import { useNavigation } from '@react-navigation/native';
import { useLogin } from '../../hooks/useSignIn';

const Signin = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const { mutate: login, isPending } = useLogin();

  return (
    <ScreenWrapper backgroundColor={Colors.BACKGROUND} isLoading={isPending}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.PRIMARY} />
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={(values) => {
          login(values, {
            onSuccess: () => {
              // navigation.navigate('Home');
            }
          });
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.container}>
            <View style={styles.headerContainer}>
              <Bus width={scale(44)} height={scale(44)} color={Colors.PRIMARY} />
              <AppText size={30} weight="700" color={Colors.PRIMARY} style={styles.brandName}>
                {t('app_name')}
              </AppText>
            </View>

            <View style={styles.card}>
              <View style={styles.titleContainer}>
                <AppText size={26} weight="700" color={Colors.PRIMARY} style={styles.welcomeText}>
                  {t('auth_signin_title')}
                </AppText>
                <AppText size={14} color={Colors.DARK_GRAY} weight="500">
                  {t('auth_signin_subtitle')}
                </AppText>
              </View>

              <AppInput
                label={t('auth_signin_emailPhoneLabel')}
                placeholder={t('auth_signin_emailPhonePlaceholder')}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                keyboardType="email-address"
                autoCapitalize="none"
                error={touched.email ? errors.email : undefined}
                LeftIcon={User}
                placeholderTextColor={Colors.TEXT_GREY}
                inputStyle={styles.inputStyle}
                containerStyle={styles.inputContainer}
              />

              <AppInput
                label={t('auth_signin_passwordLabel')}
                placeholder={t('auth_signin_passwordPlaceholder')}
                isPassword
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                error={touched.password ? errors.password : undefined}
                LeftIcon={Lock}
                placeholderTextColor={Colors.TEXT_GREY}
                inputStyle={styles.inputStyle}
                containerStyle={styles.inputContainer}
              />

              <TouchableOpacity style={styles.forgotPassword} activeOpacity={0.7}>
                <AppText size={14} weight="600" color={Colors.SECONDARY}>
                  {t('auth_signin_forgotPassword')}
                </AppText>
              </TouchableOpacity>

              <AppButton
                title={t('auth_signin_button')}
                onPress={handleSubmit as any}
                style={styles.button}
              />

            <View style={styles.footer}>
              <AppText size={14} color={Colors.DARK_GRAY}>
                {t('auth_signin_footer')}{' '}
              </AppText>
              <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Signup')}>
                <AppText size={14} weight="700" color={Colors.PRIMARY}>
                  {t('auth_signin_signupLink')}
                </AppText>
              </TouchableOpacity>
            </View>
            </View>
          </View>
        )}
      </Formik>
    </ScreenWrapper>
  );
};

export default Signin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: verticalScale(20),
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(24),
  },
  brandName: {
    marginLeft: scale(10),
    letterSpacing: 1,
  },
  card: {
    backgroundColor: Colors.WHITE,
    borderRadius: scale(20),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(24),
    borderWidth: 1,
    borderColor: Colors.BORDER_GREY,
    shadowColor: Colors.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
    marginBottom: verticalScale(24),
  },
  titleContainer: {
    marginBottom: verticalScale(20),
  },
  welcomeText: {
    marginBottom: verticalScale(6),
  },
  inputContainer: {
    marginBottom: verticalScale(16),
  },
  inputStyle: {
    backgroundColor: Colors.SURFACE,
    borderColor: Colors.BORDER_GREY,
    color: Colors.PRIMARY,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: verticalScale(2),
    marginBottom: verticalScale(24),
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: verticalScale(14),
    borderRadius: scale(12),
    alignItems: 'center',
    shadowColor: Colors.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: verticalScale(8),
    marginBottom: verticalScale(20),
  },
});
