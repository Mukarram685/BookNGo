import React from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Formik } from 'formik';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { signupSchema } from '../../helpers/auth.helper';
import AppText from '../../component/common/AppText';
import AppInput from '../../component/TextInput/TextInput';
import ScreenWrapper from '../../component/common/ScreenWrapper';
import AppButton from '../../component/common/AppButton';
import Colors from '../../utils/Colors.util';
import { Bus, Lock, User, Mail, Phone } from '../../assets/svg';
import { useRegister } from '../../hooks/useSignUp';


const Signup = () => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const { mutate: register, isPending } = useRegister();

    return (
        <ScreenWrapper backgroundColor={Colors.BACKGROUND} isLoading={isPending}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.PRIMARY} />
            <Formik
                initialValues={{ name: '', email: '', phoneNumber: '', password: '', role: 'user' }}
                validationSchema={signupSchema}
                onSubmit={(values) => {
                    register(values);
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
                            <AppText size={30} weight="800" color={Colors.PRIMARY} style={styles.brandName}>
                                {t('app_name')}
                            </AppText>
                        </View>

                        <View style={styles.titleContainer}>
                            <AppText size={30} weight="700" color={Colors.PRIMARY} style={styles.welcomeText}>
                                {t('auth_signup_title')}
                            </AppText>
                            <AppText size={16} color={Colors.PRIMARY} weight="500">
                                {t('auth_signup_subtitle')}
                            </AppText>
                        </View>

                        <AppInput
                            label={t('auth_signup_nameLabel')}
                            placeholder={t('auth_signup_namePlaceholder')}
                            value={values.name}
                            onChangeText={handleChange('name')}
                            onBlur={handleBlur('name')}
                            error={touched.name ? errors.name : undefined}
                            LeftIcon={User}
                            placeholderTextColor={Colors.TEXT_GREY}
                            inputStyle={styles.inputStyle}
                            containerStyle={styles.inputContainer}
                        />

                        <AppInput
                            label={t('auth_signup_emailLabel')}
                            placeholder={t('auth_signup_emailPlaceholder')}
                            value={values.email}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            keyboardType="email-address"
                            error={touched.email ? errors.email : undefined}
                            LeftIcon={Mail}
                            placeholderTextColor={Colors.TEXT_GREY}
                            inputStyle={styles.inputStyle}
                            containerStyle={styles.inputContainer}
                        />

                        <AppInput
                            label={t('auth_signup_phoneLabel')}
                            placeholder={t('auth_signup_phonePlaceholder')}
                            value={values.phoneNumber}
                            onChangeText={handleChange('phoneNumber')}
                            onBlur={handleBlur('phoneNumber')}
                            keyboardType="phone-pad"
                            error={touched.phoneNumber ? errors.phoneNumber : undefined}
                            LeftIcon={Phone}
                            placeholderTextColor={Colors.TEXT_GREY}
                            inputStyle={styles.inputStyle}
                            containerStyle={styles.inputContainer}
                        />

                        <AppInput
                            label={t('auth_signup_passwordLabel')}
                            placeholder={t('auth_signup_passwordPlaceholder')}
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

                        <AppButton
                            title={t('auth_signup_button')}
                            onPress={handleSubmit as any}
                            style={styles.button}
                        />

                        <View style={styles.footer}>
                            <AppText size={14} color={Colors.DARK_GRAY}>
                                {t('auth_signup_footer')}{' '}
                            </AppText>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Signin')}>
                                <AppText size={14} weight="700" color={Colors.PRIMARY}>
                                    {t('auth_signup_loginLink')}
                                </AppText>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </Formik>
        </ScreenWrapper>
    );
};

export default Signup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: verticalScale(40),
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: verticalScale(30),
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
    },
    inputContainer: {
        marginBottom: verticalScale(20),
    },
    inputStyle: {
        backgroundColor: Colors.SURFACE,
        borderColor: Colors.BORDER_GREY,
        color: Colors.PRIMARY,
        borderRadius: scale(14),
    },
    button: {
        backgroundColor: Colors.PRIMARY,
        paddingVertical: verticalScale(16),
        borderRadius: scale(14),
        alignItems: 'center',
        marginBottom: verticalScale(30),
        marginTop: verticalScale(10),
        shadowColor: Colors.SECONDARY,
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
