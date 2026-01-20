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
import Colors from '../../utils/Colors.util';
import { Bus, Lock, User, Mail, Phone } from '../../assets/svg';
import { useRegister } from '../../hooks/useAuth';


const Signup = () => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const { mutate: register, isPending } = useRegister();

    return (
        <ScreenWrapper backgroundColor={Colors.DARK_BG} isLoading={isPending}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.DARK_BG} />
            <Formik
                initialValues={{ name: '', email: '', phoneNumber: '', password: '', role: 'user' }}
                validationSchema={signupSchema}
                onSubmit={(values) => {
                    register(values, {
                        onSuccess: () => {
                            navigation.navigate('Signin');
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
                            <Bus width={scale(40)} height={scale(40)} />
                            <AppText size={28} weight="700" color={Colors.WHITE} style={styles.brandName}>
                                {t('common_brandName')}
                            </AppText>
                        </View>

                        <View style={styles.titleContainer}>
                            <AppText size={30} weight="700" color={Colors.WHITE} style={styles.welcomeText}>
                                {t('auth_signup_title')}
                            </AppText>
                            <AppText size={16} color={Colors.TEXT_GREY} weight="500">
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

                        <TouchableOpacity style={styles.button} onPress={handleSubmit as any} activeOpacity={0.8}>
                            <AppText size={16} weight="700" color={Colors.WHITE}>
                                {t('auth_signup_button')}
                            </AppText>
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <AppText size={14} color={Colors.TEXT_GREY}>
                                {t('auth_signup_footer')}{' '}
                            </AppText>
                            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Signin')}>
                                <AppText size={14} weight="700" color={Colors.BRIGHT_BLUE}>
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
        height: verticalScale(44),
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
    button: {
        backgroundColor: Colors.BRIGHT_BLUE,
        paddingVertical: verticalScale(14),
        borderRadius: scale(12),
        alignItems: 'center',
        marginBottom: verticalScale(30),
        marginTop: verticalScale(10),
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
