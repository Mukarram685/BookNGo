import React from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Formik } from 'formik';
import { scale, verticalScale } from 'react-native-size-matters';
import { loginSchema } from '../../helpers/auth.helper';
import AppText from '../../component/common/AppText';
import AppInput from '../../component/TextInput/TextInput';
import ScreenWrapper from '../../component/common/ScreenWrapper';
import Colors from '../../utils/Colors.util';
import { Bus, Lock, User } from '../../assets/svg';

const Signin = () => {
  return (
    <ScreenWrapper backgroundColor={Colors.DARK_BG}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.DARK_BG} />
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={(values) => {
          console.log(values);
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
              <Bus width={scale(40)} height={scale(40)} />
              <AppText size={28} weight="700" color={Colors.WHITE} style={styles.brandName}>
                BOOK&GO
              </AppText>
            </View>

            <View style={styles.titleContainer}>
              <AppText size={32} weight="700" color={Colors.WHITE} style={styles.welcomeText}>
                Welcome Back
              </AppText>
              <AppText size={16} color={Colors.TEXT_GREY} weight="500">
                Sign in to continue your journey
              </AppText>
            </View>

            <AppInput
              label="Email or Phone Number"
              placeholder="Enter your email or phone"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              keyboardType="email-address"
              error={touched.email ? errors.email : undefined}
              LeftIcon={User}
              placeholderTextColor={Colors.TEXT_GREY}
              inputStyle={styles.inputStyle}
              labelStyle={styles.labelStyle}
              containerStyle={styles.inputContainer}
            />

            <AppInput
              label="Password"
              placeholder="Enter your password"
              isPassword
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              error={touched.password ? errors.password : undefined}
              LeftIcon={Lock}
              placeholderTextColor={Colors.TEXT_GREY}
              inputStyle={styles.inputStyle}
              labelStyle={styles.labelStyle}
              containerStyle={styles.inputContainer}
            />

            <TouchableOpacity style={styles.forgotPassword} activeOpacity={0.7}>
              <AppText size={14} weight="600" color={Colors.BRIGHT_BLUE}>
                Forgot Password?
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleSubmit as any} activeOpacity={0.8}>
              <AppText size={16} weight="700" color={Colors.WHITE}>
                Login
              </AppText>
            </TouchableOpacity>

            <View style={styles.footer}>
              <AppText size={14} color={Colors.TEXT_GREY}>
                Don't have an account?{' '}
              </AppText>
              <TouchableOpacity activeOpacity={0.7}>
                <AppText size={14} weight="700" color={Colors.BRIGHT_BLUE}>
                  Sign Up
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
    marginBottom: verticalScale(8),
  },
  inputContainer: {
    marginBottom: verticalScale(20),
  },
  inputStyle: {
    backgroundColor: Colors.INPUT_BG,
    borderWidth: 0,
    color: Colors.WHITE,
    borderRadius: scale(12),
  },
  labelStyle: {
    color: Colors.WHITE,
  },
  forgotPassword: {
    alignSelf: 'center',
    marginBottom: verticalScale(30),
  },
  button: {
    backgroundColor: Colors.BRIGHT_BLUE,
    paddingVertical: verticalScale(14),
    borderRadius: scale(12),
    alignItems: 'center',
    marginBottom: verticalScale(30),
    shadowColor: Colors.BRIGHT_BLUE,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: verticalScale(20),
  },
});
