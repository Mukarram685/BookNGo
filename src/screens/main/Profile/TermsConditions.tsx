import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { scale, verticalScale } from 'react-native-size-matters';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import Colors from '../../../utils/Colors.util';
import Header from '../../../component/Header';

const TermsConditions = () => {
    const { t } = useTranslation();

    return (
        <ScreenWrapper 
            backgroundColor={Colors.BACKGROUND} 
            header={<Header title={t('profile_terms') || 'Terms & Conditions'} showBack={true} />}
        >
              <View style={styles.card}>
                    <AppText size={18} weight="900" color={Colors.PRIMARY} style={styles.title}>
                        Terms & Conditions
                    </AppText>
                    <AppText size={12} color={Colors.TEXT_GREY} weight="600" style={styles.date}>
                        Last Updated: August 2026
                    </AppText>

                    <AppText size={14} color={Colors.PRIMARY} weight="500" style={styles.paragraph}>
                        By using the BookNGo mobile application, you agree to comply with and be bound by the following terms and conditions. Please read these terms carefully before accessing or using our services.
                    </AppText>

                    <AppText size={16} weight="800" color={Colors.PRIMARY} style={styles.sectionTitle}>
                        1. User Accounts
                    </AppText>
                    <AppText size={14} color={Colors.PRIMARY} weight="500" style={styles.paragraph}>
                        When creating an account, you must provide accurate, complete, and current information. You are solely responsible for safeguarding the credentials you use to access the service.
                    </AppText>

                    <AppText size={16} weight="800" color={Colors.PRIMARY} style={styles.sectionTitle}>
                        2. Booking & Payments
                    </AppText>
                    <AppText size={14} color={Colors.PRIMARY} weight="500" style={styles.paragraph}>
                        All tickets purchased through the app are subject to availability. Prices and ticket options may vary. You agree to pay all charges incurred at the prices in effect when your payment is initiated.
                    </AppText>

                    <AppText size={16} weight="800" color={Colors.PRIMARY} style={styles.sectionTitle}>
                        3. Cancellations & Refunds
                    </AppText>
                    <AppText size={14} color={Colors.PRIMARY} weight="500" style={styles.paragraph}>
                        Cancellation and refund policies are determined by the respective transit providers. BookNGo acts as an intermediary agent and does not guarantee refunds outside of provider policies.
                    </AppText>

                    <AppText size={16} weight="800" color={Colors.PRIMARY} style={styles.sectionTitle}>
                        4. Limitation of Liability
                    </AppText>
                    <AppText size={14} color={Colors.PRIMARY} weight="500" style={styles.paragraph}>
                        BookNGo shall not be liable for any indirect, incidental, or consequential damages resulting from the use of, or inability to use, our services or transport delays.
                    </AppText>
                </View>
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
        marginVertical: verticalScale(15),
        padding: scale(20),
        shadowColor: Colors.BLACK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
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

export default TermsConditions;
