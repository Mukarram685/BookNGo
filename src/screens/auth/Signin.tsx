import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import { scale, verticalScale } from 'react-native-size-matters';
import { loginSchema } from '../../helpers/auth.helper';
import AppText from '../../component/common/AppText';
import AppInput from '../../component/TextInput/TextInput';
import ScreenWrapper from '../../component/common/ScreenWrapper';
import Colors from '../../utils/Colors.util';

const Signin = () => {
  return (
    <ScreenWrapper>
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
            <AppText size={24} weight="700" color={Colors.PRIMARY} style={styles.title}>
              Login
            </AppText>

            <AppInput
              label="Email"
              placeholder="Enter email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              keyboardType="email-address"
              error={touched.email ? errors.email : undefined}
            />

            <AppInput
              label="Password"
              placeholder="Enter password"
              isPassword
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              error={touched.password ? errors.password : undefined}
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit as any} activeOpacity={0.8}>
              <AppText size={16} weight="600" color={Colors.WHITE}>
                Login
              </AppText>
            </TouchableOpacity>
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
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: verticalScale(40),
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: verticalScale(12),
    borderRadius: scale(8),
    alignItems: 'center',
    marginTop: verticalScale(20),
  },
});
