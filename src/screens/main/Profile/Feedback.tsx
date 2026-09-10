import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
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
import { Mail, Feedback as FeedbackIcon, Star, CheckCircle } from '../../../assets/svg';
import { feedbackSchema } from '../../../helpers/auth.helper';
import { useSubmitFeedback } from '../../../hooks/useFeedback';

const FeedbackScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const authUser = useSelector((state: any) => state.auth.user);
    const [rating, setRating] = useState<number>(5);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    const { mutate: submitFeedback, isPending } = useSubmitFeedback();

    const handleSubmitFeedback = (values: { email: string; description: string }, { resetForm }: any) => {
        submitFeedback(
            {
                email: values.email.trim(),
                description: values.description.trim(),
                name: authUser?.name || '',
                rating,
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
            header={<Header title={t('menu_feedback') || 'Share Feedback'} showBack={true} />}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardContainer}
            >
                    {isSubmitted ? (
                        /* Success Confirmation Card */
                        <View style={styles.successCard}>
                            <View style={styles.successIconCircle}>
                                <CheckCircle width={scale(48)} height={scale(48)} />
                            </View>
                            <AppText size={22} weight="800" color={Colors.PRIMARY} style={styles.successTitle}>
                                Thank You! 🎉
                            </AppText>
                            <AppText size={14} color="#64748B" weight="500" style={styles.successDesc}>
                                Your feedback has been received. A confirmation has been sent to your email address, and our team will review your suggestions carefully.
                            </AppText>
                            {/* <AppButton
                                title="Submit Another Response"
                                onPress={() => setIsSubmitted(false)}
                                style={styles.submitAnotherBtn}
                            /> */}
                            <TouchableOpacity
                                style={styles.backHomeBtn}
                                activeOpacity={0.7}
                                onPress={() => navigation.goBack()}
                            >
                                <AppText size={14} weight="700" color={Colors.PRIMARY}>
                                    Go Back
                                </AppText>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        /* Main Feedback Form */
                        <View style={styles.card}>
                            {/* Banner Header */}
                            <View style={styles.bannerHeader}>
                                <View style={styles.iconCircle}>
                                    <FeedbackIcon width={scale(24)} height={scale(24)} />
                                </View>
                                <View style={styles.headerTextWrap}>
                                    <AppText size={18} weight="800" color={Colors.PRIMARY}>
                                        We value your feedback! 💬
                                    </AppText>
                                    <AppText size={12} color="#64748B" weight="500">
                                        Tell us about your bus travel experience or feature suggestions.
                                    </AppText>
                                </View>
                            </View>

                            {/* Formik Form */}
                            <Formik
                                initialValues={{
                                    email: authUser?.email || '',
                                    description: '',
                                }}
                                validationSchema={feedbackSchema}
                                onSubmit={handleSubmitFeedback}
                                enableReinitialize={true}
                            >
                                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                    <View style={styles.formContainer}>
                                        {/* Input 1: Email Field */}
                                        <AppInput
                                            label="Your Email Address"
                                            placeholder="Enter your email"
                                            value={values.email}
                                            onChangeText={handleChange('email')}
                                            onBlur={handleBlur('email')}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            required={true}
                                            error={touched.email && errors.email ? String(errors.email) : undefined}
                                            LeftIcon={Mail}
                                            placeholderTextColor={Colors.TEXT_GREY}
                                            inputStyle={styles.inputStyle}
                                            containerStyle={styles.inputContainer}
                                        />

                                        {/* Input 2: Large Multiline Feedback / Description Field (3+ lines) */}
                                        <AppInput
                                            label="Feedback / Description"
                                            placeholder="Write your suggestions, review, or report an issue here (minimum 2-3 lines)..."
                                            value={values.description}
                                            onChangeText={handleChange('description')}
                                            onBlur={handleBlur('description')}
                                            required={true}
                                            multiline={true}
                                            numberOfLines={5}
                                            textAlignVertical="top"
                                            error={touched.description && errors.description ? String(errors.description) : undefined}
                                            placeholderTextColor={Colors.TEXT_GREY}
                                            shellStyle={styles.textAreaShell}
                                            inputStyle={styles.textAreaInput}
                                            containerStyle={styles.textAreaContainer}
                                        />

                                        <AppButton
                                            title="Send Feedback"
                                            onPress={handleSubmit as any}
                                            style={styles.submitBtn}
                                        />
                                    </View>
                                )}
                            </Formik>
                        </View>
                    )}

                    <View style={styles.infoCard}>
                        <AppText size={12} color="#475569" weight="500" style={styles.infoText}>
                            ℹ️ Every submission is automatically emailed to our customer experience team and logged for quality control. You will also receive an email confirmation.
                        </AppText>
                    </View>
            </KeyboardAvoidingView>
        </ScreenWrapper>
    );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
    keyboardContainer: {
        flex: 1,
        marginTop: verticalScale(12),
    },
    scrollContent: {
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(14),
        paddingBottom: verticalScale(40),
    },
    card: {
        backgroundColor: Colors.WHITE,
        borderRadius: scale(20),
        paddingHorizontal: scale(18),
        paddingVertical: verticalScale(20),
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        shadowColor: Colors.PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: verticalScale(16),
    },
    bannerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(18),
    },
    iconCircle: {
        width: scale(46),
        height: scale(46),
        borderRadius: scale(23),
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: scale(12),
    },
    headerTextWrap: {
        flex: 1,
    },
    ratingSection: {
        backgroundColor: '#F8FAFC',
        borderRadius: scale(14),
        padding: scale(14),
        alignItems: 'center',
        marginBottom: verticalScale(18),
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    ratingLabel: {
        marginBottom: verticalScale(8),
    },
    starsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: scale(6),
        marginBottom: verticalScale(6),
    },
    starTouchable: {
        padding: scale(4),
    },
    ratingStatusText: {
        marginTop: verticalScale(2),
    },
    formContainer: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: verticalScale(14),
    },
    inputStyle: {
        backgroundColor: Colors.SURFACE,
        borderColor: Colors.BORDER_GREY,
        color: Colors.PRIMARY,
    },
    textAreaContainer: {
        marginBottom: verticalScale(20),
    },
    textAreaShell: {
        height: 'auto',
        minHeight: verticalScale(130),
        alignItems: 'flex-start',
        paddingTop: verticalScale(12),
        paddingBottom: verticalScale(12),
    },
    textAreaInput: {
        height: verticalScale(105),
        fontSize: scale(13.5),
        lineHeight: verticalScale(19),
        textAlignVertical: 'top',
        color: Colors.PRIMARY,
    },
    submitBtn: {
        backgroundColor: Colors.PRIMARY,
        borderRadius: scale(12),
        paddingVertical: verticalScale(14),
        shadowColor: Colors.PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    successCard: {
        backgroundColor: Colors.WHITE,
        borderRadius: scale(20),
        padding: scale(24),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        shadowColor: Colors.PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: verticalScale(16),
    },
    successIconCircle: {
        marginBottom: verticalScale(14),
    },
    successTitle: {
        marginBottom: verticalScale(8),
        textAlign: 'center',
    },
    successDesc: {
        textAlign: 'center',
        lineHeight: verticalScale(20),
        marginBottom: verticalScale(22),
    },
    submitAnotherBtn: {
        backgroundColor: Colors.PRIMARY,
        width: '100%',
        borderRadius: scale(12),
        paddingVertical: verticalScale(12),
        marginBottom: verticalScale(12),
    },
    backHomeBtn: {
        paddingVertical: verticalScale(8),
        borderRadius: scale(12),
        paddingHorizontal: scale(16),
        borderWidth: 1,
        borderColor: Colors.PRIMARY,
    },
    infoCard: {
        backgroundColor: '#F1F5F9',
        borderRadius: scale(12),
        padding: scale(14),
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    infoText: {
        lineHeight: verticalScale(18),
    },
});
