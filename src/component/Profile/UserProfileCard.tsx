import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import AppText from '../common/AppText';
import colors from '../../utils/colors';
import { formatCNIC } from '../../helpers/auth.helper';
import {
    Mail as CardMailIcon,
    Phone as CardPhoneIcon,
    Cnic as CardCnicIcon,
    User as CardUserIcon,
    Calendar as CardCalendarIcon,
    VerifiedBadge as VerifiedBadgeIcon,
    Pencil as EditPencilIcon,
} from '../../assets/svg';

interface UserProfileCardProps {
    name: string;
    phone: string;
    email: string;
    cnic?: string;
    accountType?: string;
    memberSince?: string;
    loyaltyPoints?: string;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
    name,
    phone,
    email,
    cnic,
    accountType = 'Individual',
    memberSince = '12 Mar 2024',
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
                        <EditPencilIcon width={scale(10)} height={scale(10)} />
                    </TouchableOpacity>
                </View>

                <View style={styles.nameSection}>
                    <AppText size={16} weight="800" color={colors.WHITE} numberOfLines={1}>
                        {name || 'Muhammad Ali'}
                    </AppText>

                    <View style={styles.verifiedBadgePill}>
                        <VerifiedBadgeIcon width={scale(14)} height={scale(14)} />
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
                    <EditPencilIcon width={scale(12)} height={scale(12)} />
                    <AppText size={12} color={colors.WHITE} style={{ marginLeft: scale(6) }}>
                        {t('profile_edit') || 'Edit Profile'}
                    </AppText>
                </TouchableOpacity>
            </View>

            <View style={styles.gridContainer}>
                <View style={styles.gridColumn}>
                    <View style={styles.gridItem}>
                        <CardMailIcon width={scale(14)} height={scale(14)} />
                        <View style={styles.itemTextWrapper}>
                            <AppText size={11} weight="500" color="#BFDBFE">
                                {t('label_email') || 'Email'}
                            </AppText>
                            <AppText size={12} weight="600" color={colors.WHITE} numberOfLines={1}>
                                {email || 'ali.muhammad@gmail.com'}
                            </AppText>
                        </View>
                    </View>

                    <View style={styles.itemDivider} />

                    <View style={styles.gridItem}>
                        <CardCnicIcon width={scale(14)} height={scale(14)} />
                        <View style={styles.itemTextWrapper}>
                            <AppText size={11} weight="500" color="#BFDBFE">
                                {t('label_cnic') || 'CNIC'}
                            </AppText>
                            <AppText size={12} weight="600" color={colors.WHITE} numberOfLines={1}>
                                {cnic ? formatCNIC(cnic) : '35202-1234567-1'}
                            </AppText>
                        </View>
                    </View>

                    <View style={styles.itemDivider} />

                    <View style={styles.gridItem}>
                        <CardCalendarIcon width={scale(14)} height={scale(14)} />
                        <View style={styles.itemTextWrapper}>
                            <AppText size={11} weight="500" color="#BFDBFE">
                                {t('label_member_since') || 'Member Since'}
                            </AppText>
                            <AppText size={12} weight="600" color={colors.WHITE} numberOfLines={1}>
                                {memberSince}
                            </AppText>
                        </View>
                    </View>
                </View>

                <View style={styles.gridColumn}>
                    <View style={styles.gridItem}>
                        <CardPhoneIcon width={scale(14)} height={scale(14)}  />
                        <View style={styles.itemTextWrapper}>
                            <AppText size={11} weight="500" color="#BFDBFE">
                                {t('label_phone') || 'Phone Number'}
                            </AppText>
                            <AppText size={12} weight="600" color={colors.WHITE} numberOfLines={1}>
                                {phone || '+92 312 3456789'}
                            </AppText>
                        </View>
                    </View>

                    <View style={styles.itemDivider} />

                    <View style={styles.gridItem}>
                        <CardUserIcon width={scale(14)} height={scale(14)}  />
                        <View style={styles.itemTextWrapper}>
                            <AppText size={11} weight="500" color="#BFDBFE">
                                {t('label_account_type') || 'Account Type'}
                            </AppText>
                            <AppText size={12} weight="600" color={colors.WHITE} numberOfLines={1}>
                                {accountType}
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
        borderRadius: scale(22),
        paddingHorizontal: scale(12),
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(12),
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
        marginBottom: verticalScale(16),
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
        paddingVertical: verticalScale(4),
        borderRadius: scale(16),
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
        paddingVertical: verticalScale(3),
    },
    itemTextWrapper: {
        marginLeft: scale(10),
        flex: 1,
    },
    itemDivider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        marginVertical: verticalScale(4),
    },
});
