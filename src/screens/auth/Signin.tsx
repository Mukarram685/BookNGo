import React from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Formik } from 'formik';
import { scale, verticalScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import { loginSchema } from '../../helpers/auth.helper';
import AppText from '../../component/common/AppText';
import AppInput from '../../component/TextInput/TextInput';
import ScreenWrapper from '../../component/common/ScreenWrapper';
import Colors from '../../utils/Colors.util';
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

            <View style={styles.titleContainer}>
              <AppText size={32} weight="700" color={Colors.PRIMARY} style={styles.welcomeText}>
                {t('auth_signin_title')}
              </AppText>
              <AppText size={16} color={Colors.PRIMARY} weight="500">
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
              <AppText size={14} weight="600" color={Colors.PRIMARY}>
                {t('auth_signin_forgotPassword')}
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleSubmit as any} activeOpacity={0.8}>
              <AppText size={16} weight="700" color={Colors.WHITE}>
                {t('auth_signin_button')}
              </AppText>
            </TouchableOpacity>

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
        )}
      </Formik>
    </ScreenWrapper>
  );
};

export default Signin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: verticalScale(40),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(50),
  },
  brandName: {
    marginLeft: scale(10),
    letterSpacing: 1,
  },
  titleContainer: {
    marginBottom: verticalScale(30),
  },
  welcomeText: {
    paddingVertical: verticalScale(8),
    height: verticalScale(50),
  },
  inputContainer: {
    marginBottom: verticalScale(20),
  },
  inputStyle: {
    backgroundColor: Colors.SURFACE,
    borderColor: Colors.BORDER_GREY,
    color: Colors.PRIMARY,
  },
  forgotPassword: {
    alignSelf: 'center',
    marginBottom: verticalScale(30),
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: verticalScale(16),
    borderRadius: scale(14),
    alignItems: 'center',
    marginBottom: verticalScale(30),
    shadowColor: Colors.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: verticalScale(20),
  },
});
