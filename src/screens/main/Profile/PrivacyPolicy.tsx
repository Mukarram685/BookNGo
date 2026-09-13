import React from 'react';
import { View, StyleSheet, ScrollView, StatusBar, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { scale, verticalScale } from 'react-native-size-matters';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import  { Colors } from '../../../utils/colors';
import Header from '../../../component/Header';
import { Privacy } from '../../../assets/svg';
import { getPrivacyPolicySections, POLICY_LAST_UPDATED } from '../../../data/privacyPolicy.data';

const PrivacyPolicy = () => {
    const { t } = useTranslation();
    const sections = getPrivacyPolicySections(t);
    const lastUpdated = t('privacy_last_updated_val') || POLICY_LAST_UPDATED;

    return (
        <ScreenWrapper 
            backgroundColor={Colors.BACKGROUND} 
            header={<Header title={t('profile_privacy') || 'Privacy Policy'} showBack={true} />}
        >
            <StatusBar barStyle="dark-content" backgroundColor={Colors.BACKGROUND} />
            <ScrollView 
                contentContainerStyle={styles.scrollContent} 
                showsVerticalScrollIndicator={false}
            >
                {/* Header Banner Card */}
                <View style={styles.bannerCard}>
                    <View style={styles.iconCircle}>
                        <Privacy width={scale(24)} height={scale(24)} />
                    </View>
                    <View style={styles.bannerTextContainer}>
                        <AppText size={18} weight="900" color={Colors.PRIMARY}>
                            {t('privacy_policy_header') || 'BookNGo Privacy Policy'}
                        </AppText>
                        <AppText size={12} color={Colors.TEXT_GREY} weight="600" style={styles.dateText}>
                            {t('privacy_last_updated', { date: lastUpdated }) || `Last Updated: ${lastUpdated}`}
                        </AppText>
                    </View>
                </View>

                {/* Policy Sections */}
                {sections.map((section) => (
                    <View key={section.id} style={styles.sectionCard}>
                        <AppText size={16} weight="800" color={Colors.PRIMARY} style={styles.sectionTitle}>
                            {section.title}
                        </AppText>
                        <AppText size={14} color="#334155" weight="500" style={styles.paragraph}>
                            {section.content}
                        </AppText>

                        {section.points && section.points.length > 0 && (
                            <View style={styles.pointsList}>
                                {section.points.map((point, index) => (
                                    <View key={index} style={styles.pointRow}>
                                        <View style={styles.bulletDot} />
                                        <AppText size={13} color="#475569" weight="500" style={styles.pointText}>
                                            {point}
                                        </AppText>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                ))}

                <View style={styles.footerNote}>
                    <AppText size={12} color={Colors.TEXT_GREY} align="center" weight="500">
                        {t('privacy_thank_you_footer') || 'Thank you for trusting BookNGo with your travel reservations.'}
                    </AppText>
                </View>
            </ScrollView>
        </ScreenWrapper>
    );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
    scrollContent: {
        paddingTop: verticalScale(12),
        paddingBottom: verticalScale(40),
    },
    bannerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.SURFACE,
        borderRadius: scale(18),
        padding: scale(16),
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        marginBottom: verticalScale(14),
        shadowColor: Colors.PRIMARY,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconCircle: {
        width: scale(46),
        height: scale(46),
        borderRadius: scale(23),
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scale(14),
    },
    bannerTextContainer: {
        flex: 1,
    },
    dateText: {
        marginTop: verticalScale(3),
    },
    sectionCard: {
        backgroundColor: Colors.SURFACE,
        borderColor: Colors.BORDER_GREY,
        borderRadius: scale(16),
        borderWidth: 1,
        elevation: 2,
        marginBottom: verticalScale(12),
        padding: scale(16),
        shadowColor: Colors.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
    },
    sectionTitle: {
        marginBottom: verticalScale(8),
        letterSpacing: 0.2,
    },
    paragraph: {
        lineHeight: verticalScale(20),
    },
    pointsList: {
        marginTop: verticalScale(10),
    },
    pointRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: verticalScale(6),
    },
    bulletDot: {
        width: scale(6),
        height: scale(6),
        borderRadius: scale(3),
        backgroundColor: '#172C6B',
        marginTop: verticalScale(7),
        marginRight: scale(10),
    },
    pointText: {
        flex: 1,
        lineHeight: verticalScale(18),
    },
    footerNote: {
        marginTop: verticalScale(16),
        marginBottom: verticalScale(10),
        paddingHorizontal: scale(20),
    },
});
