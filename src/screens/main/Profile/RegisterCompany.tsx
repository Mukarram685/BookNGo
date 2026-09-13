import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from 'react-native-size-matters';
import { Formik } from 'formik';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import AppInput from '../../../component/TextInput/TextInput';
import AppButton from '../../../component/common/AppButton';
import Header from '../../../component/Header';
import colors, { Colors } from '../../../utils/colors';
import { Mail, Phone, MapPin, CheckCircle, Company } from '../../../assets/svg';
import { companyRegistrationSchema, cleanPhoneNumber } from '../../../helpers/auth.helper';
import { useRegisterCompany } from '../../../hooks/useCompany';

const RegisterCompany = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const authUser = useSelector((state: any) => state.auth.user);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    const { mutate: registerCompany, isPending } = useRegisterCompany();

    const handleSubmitRegistration = (
        values: { name: string; email: string; phone: string; address: string },
        { resetForm }: any
    ) => {
        const userId = authUser?._id || authUser?.id || '';

        registerCompany(
            {
                name: values.name.trim(),
                email: values.email.trim(),
                phone: values.phone.trim(),
                address: values.address.trim(),
                userId,
            },
            {
                onSuccess: () => {
                    setIsSubmitted(true);
                    resetForm();
                },
            }
        );
    };

    return (
        <ScreenWrapper
            backgroundColor={Colors.BACKGROUND}
            isLoading={isPending}
            header={<Header title={t('menu_register_company') || 'Register Company'} showBack={true} />}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardContainer}
            >
                {isSubmitted ? (
                    /* Success Confirmation Card */
                    <View style={styles.successCard}>
                        <View style={styles.successIconCircle}>
                            <CheckCircle width={scale(48)} height={scale(48)} color={colors.BLUE_PRIMARY} />
                        </View>
                        <AppText size={22} weight="800" color={Colors.PRIMARY} style={styles.successTitle}>
                            {t('company_reg_success_title') || 'Request Submitted! 🎉'}
                        </AppText>
                        <AppText size={14} color="#64748B" weight="500" style={styles.successDesc}>
                            {t('company_reg_success_desc') ||
                                'Your company registration request has been submitted successfully. Waiting for Super Admin approval.'}
                        </AppText>
                        <TouchableOpacity
                            style={styles.backHomeBtn}
                            activeOpacity={0.7}
                            onPress={() => navigation.goBack()}
                        >
                            <AppText size={14} weight="700" color={Colors.PRIMARY}>
                                {t('feedback_go_back') || 'Go Back'}
                            </AppText>
                        </TouchableOpacity>
                    </View>
                ) : (
                    /* Main Company Registration Form */
                    <View style={styles.card}>
                        {/* Banner Header */}
                        <View style={styles.bannerHeader}>
                            <View style={styles.iconCircle}>
                                <Company width={scale(24)} height={scale(24)} color={colors.BLUE_PRIMARY} />
                            </View>
                            <View style={styles.headerTextWrap}>
                                <AppText size={18} weight="800" color={Colors.PRIMARY}>
                                    {t('company_reg_title') || 'Register Transport Company'}
                                </AppText>
                                <AppText size={12} color="#64748B" weight="500">
                                    {t('company_reg_subtitle') ||
                                        'Submit your transport company details for registration and partner with BookNGo.'}
                                </AppText>
                            </View>
                        </View>

                        {/* Formik Form */}
                        <Formik
                            initialValues={{
                                name: '',
                                email: '',
                                phone: '',
                                address: '',
                            }}
                            validationSchema={companyRegistrationSchema}
                            onSubmit={handleSubmitRegistration}
                        >
                            {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
                                <View style={styles.formContainer}>
                                    {/* Company Name */}
                                    <AppInput
                                        label={t('company_name_label') || 'Company Name'}
                                        placeholder={t('company_name_placeholder') || 'e.g. Faisal Movers'}
                                        value={values.name}
                                        onChangeText={handleChange('name')}
                                        onBlur={handleBlur('name')}
                                        required={true}
                                        error={touched.name && errors.name ? String(errors.name) : undefined}
                                        LeftIcon={Company}
                                        leftIconColor={colors.BLUE_PRIMARY}
                                        placeholderTextColor={Colors.TEXT_GREY}
                                        inputStyle={styles.inputStyle}
                                        containerStyle={styles.inputContainer}
                                    />

                                    {/* Company Email */}
                                    <AppInput
                                        label={t('company_email_label') || 'Company Email'}
                                        placeholder={t('company_email_placeholder') || 'e.g. info@faisalmovers.com'}
                                        value={values.email}
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        required={true}
                                        error={touched.email && errors.email ? String(errors.email) : undefined}
                                        LeftIcon={Mail}
                                        leftIconColor={colors.BLUE_PRIMARY}
                                        placeholderTextColor={Colors.TEXT_GREY}
                                        inputStyle={styles.inputStyle}
                                        containerStyle={styles.inputContainer}
                                    />

                                    {/* Phone / Helpline */}
                                    <AppInput
                                        label={t('company_phone_label') || 'Phone / Helpline'}
                                        placeholder={t('company_phone_placeholder') || 'e.g. 3001234567'}
                                        value={values.phone}
                                        onChangeText={(text) => setFieldValue('phone', cleanPhoneNumber(text))}
                                        onBlur={handleBlur('phone')}
                                        keyboardType="phone-pad"
                                        maxLength={10}
                                        required={true}
                                        error={touched.phone && errors.phone ? String(errors.phone) : undefined}
                                        LeftIcon={Phone}
                                        leftIconColor={colors.BLUE_PRIMARY}
                                        placeholderTextColor={Colors.TEXT_GREY}
                                        inputStyle={styles.inputStyle}
                                        containerStyle={styles.inputContainer}
                                    />

                                    {/* Headquarter / Office Address */}
                                    <AppInput
                                        label={t('company_address_label') || 'Office / Headquarter Address'}
                                        placeholder={t('company_address_placeholder') || 'e.g. Lahore, Pakistan'}
                                        value={values.address}
                                        onChangeText={handleChange('address')}
                                        onBlur={handleBlur('address')}
                                        required={true}
                                        error={touched.address && errors.address ? String(errors.address) : undefined}
                                        LeftIcon={MapPin}
                                        leftIconColor={colors.BLUE_PRIMARY}
                                        placeholderTextColor={Colors.TEXT_GREY}
                                        inputStyle={styles.inputStyle}
                                        containerStyle={styles.inputContainer}
                                    />

                                    {/* Submit Button */}
                                    <AppButton
                                        title={t('company_reg_submit_btn') || 'Submit Registration Request'}
                                        onPress={handleSubmit}
                                        loading={isPending}
                                        style={styles.submitBtn}
                                    />
                                </View>
                            )}
                        </Formik>
                    </View>
                )}
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
};

export default RegisterCompany;

const styles = StyleSheet.create({
    keyboardContainer: {
        flex: 1,
        paddingBottom: verticalScale(30),
    },
    card: {
        backgroundColor: colors.WHITE,
        borderRadius: scale(20),
        padding: scale(16),
        borderWidth: 1,
        borderColor: colors.BORDER_GREY,
        shadowColor: colors.BLACK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: verticalScale(20),
    },
    bannerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: verticalScale(14),
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        marginBottom: verticalScale(14),
    },
    iconCircle: {
        width: scale(44),
        height: scale(44),
        borderRadius: scale(22),
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(12),
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    headerTextWrap: {
        flex: 1,
    },
    formContainer: {
        gap: verticalScale(12),
    },
    inputContainer: {
        marginBottom: 0,
    },
    inputStyle: {
        fontSize: scale(13),
        fontWeight: '600',
        color: colors.SLATE_DARK,
    },
    submitBtn: {
        marginTop: verticalScale(8),
    },
    successCard: {
        backgroundColor: colors.WHITE,
        borderRadius: scale(20),
        padding: scale(24),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.BORDER_GREY,
        shadowColor: colors.BLACK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 3,
        marginTop: verticalScale(20),
    },
    successIconCircle: {
        marginBottom: verticalScale(16),
    },
    successTitle: {
        textAlign: 'center',
        marginBottom: verticalScale(8),
    },
    successDesc: {
        textAlign: 'center',
        lineHeight: scale(20),
        marginBottom: verticalScale(24),
    },
    backHomeBtn: {
        paddingVertical: verticalScale(12),
        paddingHorizontal: scale(24),
        borderRadius: scale(12),
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
});
