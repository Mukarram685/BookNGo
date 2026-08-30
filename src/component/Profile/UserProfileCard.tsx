import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import AppText from '../common/AppText';
import colors from '../../utils/colors';
import {
    Phone as PhoneIcon,
    Mail as MailIcon,
    Edit as EditIcon,
    VerifiedBadge,
    CameraBadge,
} from '../../assets/svg';

interface UserProfileCardProps {
    name: string;
    phone: string;
    email: string;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ name, phone, email }) => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();

    const getInitials = (nameStr: string) => {
        if (!nameStr) return 'UN';
        const parts = nameStr.trim().split(' ').filter(Boolean);
        if (parts.length === 0) return 'UN';
        if (parts.length === 1) {
            return parts[0].substring(0, 2).toUpperCase();
        }
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    return (
        <View style={styles.cardContainer}>
            <View style={styles.avatarSection}>
                <View style={styles.avatarCircleLarge}>
                    <AppText size={22} weight="900" color={colors.WHITE}>
                        {getInitials(name)}
                    </AppText>
                </View>
                <TouchableOpacity
                    style={styles.cameraBadge}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('UpdateProfile')}
                >
                    <CameraBadge width={scale(11)} height={scale(11)} />
                </TouchableOpacity>
            </View>

            <View style={styles.userInfoSection}>
                <View style={styles.nameRow}>
                    <AppText size={17} weight="800" color={colors.SLATE_DARK} style={styles.userNameText}>
                        {name || 'User'}
                    </AppText>
                    <View style={styles.verifiedBadgeWrapper}>
                        <VerifiedBadge width={scale(16)} height={scale(16)} />
                    </View>
                </View>

                {phone ? (
                    <View style={styles.detailRow}>
                        <PhoneIcon width={scale(13)} height={scale(13)} fill={colors.SLATE_MUTED} />
                        <AppText size={12} weight="600" color={colors.SLATE_MEDIUM} style={styles.detailText}>
                            {phone}
                        </AppText>
                    </View>
                ) : null}

                {email ? (
                    <View style={styles.detailRow}>
                        <MailIcon width={scale(13)} height={scale(13)} fill={colors.SLATE_MUTED} />
                        <AppText size={12} weight="600" color={colors.SLATE_MEDIUM} style={styles.detailText} numberOfLines={1}>
                            {email}
                        </AppText>
                    </View>
                ) : null}
            </View>

            <TouchableOpacity
                style={styles.editProfilePill}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('UpdateProfile')}
            >
                <EditIcon width={scale(13)} height={scale(13)} fill={colors.BLUE_PRIMARY} />
                <AppText size={11} weight="800" color={colors.BLUE_PRIMARY} style={{ marginLeft: scale(4) }}>
                    {t('profile_edit') || 'Edit Profile'}
                </AppText>
            </TouchableOpacity>
        </View>
    );
};

export default UserProfileCard;

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: colors.WHITE,
        borderRadius: scale(22),
        padding: scale(16),
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.BORDER_GREY,
        shadowColor: colors.BLUE_PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        marginBottom: verticalScale(14),
    },
    avatarSection: {
        position: 'relative',
        marginRight: scale(12),
    },
    avatarCircleLarge: {
        width: scale(64),
        height: scale(64),
        borderRadius: scale(32),
        backgroundColor: colors.PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.WHITE,
    },
    cameraBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.PRIMARY,
        width: scale(22),
        height: scale(22),
        borderRadius: scale(11),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.WHITE,
    },
    userInfoSection: {
        flex: 1,
        justifyContent: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(3),
    },
    userNameText: {
        marginRight: scale(6),
    },
    verifiedBadgeWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: verticalScale(2),
    },
    detailText: {
        marginLeft: scale(6),
    },
    editProfilePill: {
        position: 'absolute',
        top: scale(14),
        right: scale(14),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.BLUE_LIGHT_BG,
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(5),
        borderRadius: scale(16),
        borderWidth: 1,
        borderColor: colors.BLUE_BORDER,
    },
});
