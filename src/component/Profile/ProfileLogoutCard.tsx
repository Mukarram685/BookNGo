import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import AppText from '../common/AppText';
import { Logout as LogoutIcon } from '../../assets/svg';

interface ProfileLogoutCardProps {
    onPress: () => void;
}

const ProfileLogoutCard: React.FC<ProfileLogoutCardProps> = ({ onPress }) => {
    const { t } = useTranslation();

    return (
        <TouchableOpacity
            style={styles.logoutButton}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.contentRow}>
                <LogoutIcon width={scale(18)} height={scale(18)} fill="#EF4444" />
                <AppText size={15} weight="800" color="#EF4444" style={styles.logoutText}>
                    {t('profile_logout') || 'Logout'}
                </AppText>
            </View>
        </TouchableOpacity>
    );
};

export default ProfileLogoutCard;

const styles = StyleSheet.create({
    logoutButton: {
        backgroundColor: '#FEF2F2',
        borderRadius: scale(20),
        paddingVertical: verticalScale(14),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#FEE2E2',
        marginTop: verticalScale(4),
        marginBottom: verticalScale(24),
    },
    contentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutText: {
        marginLeft: scale(8),
    },
});
