import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';
import { scale, verticalScale } from 'react-native-size-matters';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import Colors from '../../../utils/Colors.util';
import Header from '../../../component/Header';

const PrivacyPolicy = () => {
    const { t } = useTranslation();

    return (
        <ScreenWrapper 
            backgroundColor={Colors.BACKGROUND} 
            header={<Header title={t('profile_privacy') || 'Privacy Policy'} showBack={true} />}
        >
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    <AppText size={18} weight="900" color={Colors.PRIMARY} style={styles.title}>
                        Privacy Policy
                    </AppText>
                    <AppText size={12} color={Colors.TEXT_GREY} weight="600" style={styles.date}>
                        Last Updated: August 2026
                    </AppText>
                    
                    <AppText size={14} color={Colors.PRIMARY} weight="500" style={styles.paragraph}>
                        Welcome to BookNGo. We value your privacy and are committed to protecting your personal data. This privacy policy describes how we collect, use, and share your information when you use our services.
                    </AppText>

                    <AppText size={16} weight="800" color={Colors.PRIMARY} style={styles.sectionTitle}>
                        1. Information We Collect
                    </AppText>
                    <AppText size={14} color={Colors.PRIMARY} weight="500" style={styles.paragraph}>
                        We collect personal details such as your name, email address, phone number, and payment information when you register an account or book tickets on our platform.
                    </AppText>

                    <AppText size={16} weight="800" color={Colors.PRIMARY} style={styles.sectionTitle}>
                        2. How We Use Your Information
                    </AppText>
                    <AppText size={14} color={Colors.PRIMARY} weight="500" style={styles.paragraph}>
                        Your data is used to process bookings, confirm ticket details, provide customer support, send update notifications, and improve the overall app experience.
                    </AppText>

                    <AppText size={16} weight="800" color={Colors.PRIMARY} style={styles.sectionTitle}>
                        3. Data Protection & Security
                    </AppText>
                    <AppText size={14} color={Colors.PRIMARY} weight="500" style={styles.paragraph}>
                        We implement strict security measures to protect your sensitive details from unauthorized access, loss, or disclosure. Payment information is securely handled via encrypted industry-standard protocols.
                    </AppText>

                    <AppText size={16} weight="800" color={Colors.PRIMARY} style={styles.sectionTitle}>
                        4. Contact Us
                    </AppText>
                    <AppText size={14} color={Colors.PRIMARY} weight="500" style={styles.paragraph}>
                        If you have any questions or suggestions regarding our Privacy Policy, please feel free to reach out to us via the Help Center.
                    </AppText>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.SURFACE,
        borderColor: Colors.BORDER_GREY,
        borderRadius: scale(18),
        borderWidth: 1,
        elevation: 3,
        padding: scale(20),
        shadowColor: Colors.BLACK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
    },
    container: {
        paddingBottom: verticalScale(30),
        paddingHorizontal: scale(20),
        paddingTop: verticalScale(15),
    },
    date: {
        marginBottom: verticalScale(16),
    },
    paragraph: {
        lineHeight: verticalScale(20),
    },
    sectionTitle: {
        marginBottom: verticalScale(8),
        marginTop: verticalScale(18),
    },
    title: {
        marginBottom: verticalScale(4),
    },
});

export default PrivacyPolicy;
