import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Svg, { Defs, LinearGradient, Stop, Rect, Path, Circle } from 'react-native-svg';
import AppText from '../common/AppText';
import colors from '../../utils/colors';

interface UserProfileCardProps {
    name: string;
    phone: string;
    email: string;
    cnic?: string;
    accountType?: string;
    memberSince?: string;
    loyaltyPoints?: string;
}

// Icons matching exact mockup shapes
const CardMailIcon = () => (
    <Svg width={scale(14)} height={scale(14)} viewBox="0 0 24 24" fill="none">
        <Rect x="3" y="5" width="18" height="14" rx="3" stroke="#FFFFFF" strokeWidth="1.8" />
        <Path d="M3 7L12 13L21 7" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const CardPhoneIcon = () => (
    <Svg width={scale(14)} height={scale(14)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const CardCnicIcon = () => (
    <Svg width={scale(14)} height={scale(14)} viewBox="0 0 24 24" fill="none">
        <Rect x="2.5" y="5" width="19" height="14" rx="3" stroke="#FFFFFF" strokeWidth="1.8" />
        <Circle cx="8" cy="11" r="2.2" stroke="#FFFFFF" strokeWidth="1.5" />
        <Path d="M14 10H18M14 14H17" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
);

const CardUserIcon = () => (
    <Svg width={scale(14)} height={scale(14)} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="8" r="4" stroke="#FFFFFF" strokeWidth="1.8" />
        <Path d="M5 20C5 16.134 8.13401 13 12 13C15.866 13 19 16.134 19 20" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
);

const CardCalendarIcon = () => (
    <Svg width={scale(14)} height={scale(14)} viewBox="0 0 24 24" fill="none">
        <Rect x="3" y="6" width="18" height="15" rx="3" stroke="#FFFFFF" strokeWidth="1.8" />
        <Path d="M3 10.5H21" stroke="#FFFFFF" strokeWidth="1.5" />
        <Path d="M8 3.5V6.5M16 3.5V6.5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
);

const CardStarIcon = () => (
    <Svg width={scale(14)} height={scale(14)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            stroke="#F59E0B"
            strokeWidth="1.8"
            fill="none"
        />
    </Svg>
);

const VerifiedBadgeIcon = () => (
    <Svg width={scale(14)} height={scale(14)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M12 2L14.5 4.5L18 4L18.5 7.5L21.5 9L20.5 12.5L22 15.5L19 17.5L18.5 21L15 20.5L12.5 22.5L10 20.5L6.5 21L6 17.5L3 15.5L4.5 12.5L3.5 9L6.5 7.5L7 4L10.5 4.5L12 2Z"
            fill="#3B82F6"
        />
        <Path d="M9 12L11 14L15 9" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

const EditPencilIcon = ({ size = 12 }: { size?: number }) => (
    <Svg width={scale(size)} height={scale(size)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const UserProfileCard: React.FC<UserProfileCardProps> = ({
    name,
    phone,
    email,
    cnic,
    accountType = 'Individual',
    memberSince = '12 Mar 2024',
    loyaltyPoints = '1,250 Points',
}) => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();

    const getInitials = (nameStr: string) => {
        if (!nameStr) return 'MA';
        const parts = nameStr.trim().split(' ').filter(Boolean);
        if (parts.length === 0) return 'MA';
        if (parts.length === 1) {
            return parts[0].substring(0, 2).toUpperCase();
        }
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    return (
        <View style={styles.cardContainer}>
            {/* Rich Royal Blue Linear Gradient Background */}
            <View style={styles.gradientContainer} pointerEvents="none">
                <Svg width="100%" height="100%">
                    <Defs>
                        <LinearGradient id="blueCardGrad" x1="0" y1="0" x2="1" y2="1">
                            <Stop offset="0%" stopColor="#0B48C4" />
                            <Stop offset="50%" stopColor="#0C3EA5" />
                            <Stop offset="100%" stopColor="#07276B" />
                        </LinearGradient>
                    </Defs>
                    <Rect width="100%" height="100%" fill="url(#blueCardGrad)" />
                </Svg>
            </View>

            {/* Top Row: Avatar, User Name, Verified Badge & Edit Profile Button */}
            <View style={styles.topRow}>
                <View style={styles.avatarSection}>
                    <View style={styles.avatarCircleLarge}>
                        <AppText size={22} weight="800" color={colors.WHITE}>
                            {getInitials(name)}
                        </AppText>
                    </View>
                    <TouchableOpacity
                        style={styles.cameraBadge}
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate('UpdateProfile')}
                    >
                        <EditPencilIcon size={10} />
                    </TouchableOpacity>
                </View>

                <View style={styles.nameSection}>
                    <AppText size={20} weight="800" color={colors.WHITE} numberOfLines={1}>
                        {name || 'Muhammad Ali'}
                    </AppText>

                    <View style={styles.verifiedBadgePill}>
                        <VerifiedBadgeIcon />
                        <AppText size={11} weight="600" color={colors.WHITE} style={{ marginLeft: scale(5) }}>
                            {t('verified_user') || 'Verified User'}
                        </AppText>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.editButtonPill}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('UpdateProfile')}
                >
                    <EditPencilIcon size={12} />
                    <AppText size={12} weight="600" color={colors.WHITE} style={{ marginLeft: scale(6) }}>
                        {t('profile_edit') || 'Edit Profile'}
                    </AppText>
                </TouchableOpacity>
            </View>

            {/* 2-Column Info Grid with subtle dividers */}
            <View style={styles.gridContainer}>
                {/* Left Column */}
                <View style={styles.gridColumn}>
                    {/* Email */}
                    <View style={styles.gridItem}>
                        <CardMailIcon />
                        <View style={styles.itemTextWrapper}>
                            <AppText size={11} weight="500" color="#BFDBFE">
                                {t('label_email') || 'Email'}
                            </AppText>
                            <AppText size={13} weight="600" color={colors.WHITE} numberOfLines={1}>
                                {email || 'ali.muhammad@gmail.com'}
                            </AppText>
                        </View>
                    </View>

                    <View style={styles.itemDivider} />

                    {/* CNIC */}
                    <View style={styles.gridItem}>
                        <CardCnicIcon />
                        <View style={styles.itemTextWrapper}>
                            <AppText size={11} weight="500" color="#BFDBFE">
                                {t('label_cnic') || 'CNIC'}
                            </AppText>
                            <AppText size={13} weight="600" color={colors.WHITE} numberOfLines={1}>
                                {cnic || '35202-1234567-1'}
                            </AppText>
                        </View>
                    </View>

                    <View style={styles.itemDivider} />

                    {/* Member Since */}
                    <View style={styles.gridItem}>
                        <CardCalendarIcon />
                        <View style={styles.itemTextWrapper}>
                            <AppText size={11} weight="500" color="#BFDBFE">
                                {t('label_member_since') || 'Member Since'}
                            </AppText>
                            <AppText size={13} weight="600" color={colors.WHITE} numberOfLines={1}>
                                {memberSince}
                            </AppText>
                        </View>
                    </View>
                </View>

                {/* Right Column */}
                <View style={styles.gridColumn}>
                    {/* Phone Number */}
                    <View style={styles.gridItem}>
                        <CardPhoneIcon />
                        <View style={styles.itemTextWrapper}>
                            <AppText size={11} weight="500" color="#BFDBFE">
                                {t('label_phone') || 'Phone Number'}
                            </AppText>
                            <AppText size={13} weight="600" color={colors.WHITE} numberOfLines={1}>
                                {phone || '+92 312 3456789'}
                            </AppText>
                        </View>
                    </View>

                    <View style={styles.itemDivider} />

                    {/* Account Type */}
                    <View style={styles.gridItem}>
                        <CardUserIcon />
                        <View style={styles.itemTextWrapper}>
                            <AppText size={11} weight="500" color="#BFDBFE">
                                {t('label_account_type') || 'Account Type'}
                            </AppText>
                            <AppText size={13} weight="600" color={colors.WHITE} numberOfLines={1}>
                                {accountType}
                            </AppText>
                        </View>
                    </View>

                    <View style={styles.itemDivider} />

                    {/* Loyalty Points */}
                    <View style={styles.gridItem}>
                        <CardStarIcon />
                        <View style={styles.itemTextWrapper}>
                            <AppText size={11} weight="500" color="#BFDBFE">
                                {t('label_loyalty_points') || 'Loyalty Points'}
                            </AppText>
                            <AppText size={13} weight="800" color="#FBBF24" numberOfLines={1}>
                                {loyaltyPoints}
                            </AppText>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default UserProfileCard;

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: scale(26),
        paddingHorizontal: scale(10),
        paddingTop: verticalScale(20),
        paddingBottom: verticalScale(22),
        marginBottom: verticalScale(12),
        overflow: 'hidden',
        position: 'relative',
        shadowColor: '#0C3EA5',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    },
    gradientContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(22),
    },
    avatarSection: {
        position: 'relative',
        marginRight: scale(14),
    },
    avatarCircleLarge: {
        width: scale(66),
        height: scale(66),
        borderRadius: scale(33),
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.WHITE,
    },
    cameraBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#1D4ED8',
        width: scale(22),
        height: scale(22),
        borderRadius: scale(11),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.8,
        borderColor: colors.WHITE,
    },
    nameSection: {
        flex: 1,
        justifyContent: 'center',
    },
    verifiedBadgePill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.18)',
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(4),
        borderRadius: scale(14),
        alignSelf: 'flex-start',
        marginTop: verticalScale(5),
    },
    editButtonPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        paddingHorizontal: scale(14),
        paddingVertical: verticalScale(8),
        borderRadius: scale(20),
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.35)',
    },
    gridContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        columnGap: scale(16),
    },
    gridColumn: {
        flex: 1,
    },
    gridItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: verticalScale(6),
    },
    itemTextWrapper: {
        marginLeft: scale(10),
        flex: 1,
    },
    itemDivider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginVertical: verticalScale(6),
    },
});
