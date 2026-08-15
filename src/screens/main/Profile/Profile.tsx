import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import Colors from '../../../utils/Colors.util';
import Header from '../../../component/Header';
import { logout } from '../../../store/slice/auth.slice';
import { useGetProfile } from '../../../hooks/useProfile';
import { Arrow } from '../../../assets/svg';

const Profile = () => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const navigation = useNavigation<any>();
    const authUser = useSelector((state: any) => state.auth.user);
    
    useGetProfile(authUser?.id || authUser?._id);

    const handleLogout = () => {
        dispatch(logout());
    };

    const confirmLogout = () => {
        Alert.alert(
            t('profile_logoutConfirmTitle') || 'Logout',
            t('profile_logoutConfirmDesc') || 'Are you sure you want to logout?',
            [
                {
                    text: t('cancel') || 'Cancel',
                    style: 'cancel',
                },
                {
                    text: t('profile_logout') || 'Log out',
                    style: 'destructive',
                    onPress: handleLogout,
                },
            ],
            { cancelable: true }
        );
    };

    const showComingSoonToast = () => {
        Toast.show({
            type: 'info',
            text1: 'Coming Soon',
            text2: 'This feature will be available in the next update.',
            position: 'bottom',
            visibilityTime: 2500,
        });
    };

    const getInitials = (name: string) => {
        if (!name) return 'UN';
        const parts = name.trim().split(' ');
        if (parts.length === 1) {
            return parts[0].substring(0, 2).toUpperCase();
        }
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const userName = authUser?.name || profile?.name || '';
    const userEmail = authUser?.email || profile?.email || 'Welcome to BookNGo';

    const renderMenuItem = (
        title: string,
        onPress: () => void,
        rightText?: string,
        isLast?: boolean
    ) => (
        <TouchableOpacity 
            style={[styles.menuItem, isLast && { borderBottomWidth: 0 }]} 
            onPress={onPress} 
            activeOpacity={0.7}
        >
            <AppText size={15} weight="700" color={Colors.PRIMARY}>{title}</AppText>
            <View style={styles.menuItemRight}>
                {rightText && (
                    <AppText size={13} color={Colors.TEXT_GREY} weight="600" style={{ marginRight: scale(8) }}>
                        {rightText}
                    </AppText>
                )}
                <Arrow
                    width={scale(14)}
                    height={scale(14)}
                    style={{ transform: [{ rotate: '180deg' }] }}
                    fill={Colors.TEXT_GREY}
                />
            </View>
        </TouchableOpacity>
    );

    return (
        <ScreenWrapper 
            backgroundColor={Colors.BACKGROUND} 
            header={<Header title={t('profile_title') || 'Profile'} />}
            gradient='upper'
        >
                
                <View style={styles.profileCard}>
                    <View style={styles.avatarWrapper}>
                        <View style={styles.avatarLarge}>
                            <AppText size={28} weight="900" color={Colors.WHITE}>
                                {getInitials(userName)}
                            </AppText>
                        </View>
                    </View>
                    
                    <AppText size={18} weight="900" color={Colors.PRIMARY} style={{ marginTop: verticalScale(14) }}>
                        {userName || 'Guest User'}
                    </AppText>
                    <AppText size={12} color={Colors.TEXT_GREY} weight="600" style={{ marginTop: verticalScale(3) }}>
                        {userEmail}
                    </AppText>
                </View>

                <AppText size={13} color={Colors.TEXT_GREY} weight="800" style={styles.sectionHeader}>
                    ACCOUNT SETTINGS
                </AppText>
                <View style={styles.sectionCard}>
                    {renderMenuItem(
                        t('profile_accountDetails') || 'Personal information',
                        () => navigation.navigate('UpdateProfile'),
                        undefined,
                        false
                    )}
                    {renderMenuItem(
                        t('profile_notification') || 'Notifications',
                        showComingSoonToast,
                        undefined,
                        false
                    )}
                    {renderMenuItem(
                        t('profile_paymentHistory') || 'Booking History',
                        () => navigation.navigate('Bookings'),
                        undefined,
                        false
                    )}
                    {renderMenuItem(
                        t('profile_settings') || 'Settings',
                        () => navigation.navigate('Language'),
                        i18n.language.toUpperCase(),
                        true
                    )}
                </View>

                <AppText size={13} color={Colors.TEXT_GREY} weight="800" style={styles.sectionHeader}>
                    HELP & SUPPORT
                </AppText>
                <View style={styles.sectionCard}>
                    {renderMenuItem(
                        t('profile_privacy') || 'Privacy policy',
                        () => navigation.navigate('PrivacyPolicy'),
                        undefined,
                        false
                    )}
                    {renderMenuItem(
                        t('profile_terms') || 'Terms & Conditions',
                        () => navigation.navigate('TermsConditions'),
                        undefined,
                        false
                    )}
                    {renderMenuItem(
                        t('profile_help') || 'FAQ & Help',
                        () => navigation.navigate('GetHelp'),
                        undefined,
                        true
                    )}
                </View>

                <TouchableOpacity 
                    style={styles.logoutButton} 
                    onPress={confirmLogout} 
                    activeOpacity={0.7}
                >
                    <AppText size={15} weight="800" color={Colors.RED}>
                        Log out
                    </AppText>
                    <Arrow
                        width={scale(14)}
                        height={scale(14)}
                        style={{ transform: [{ rotate: '180deg' }] }}
                        fill={Colors.RED}
                    />
                </TouchableOpacity>

        </ScreenWrapper>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        paddingTop: verticalScale(15),
        paddingBottom: verticalScale(40),
    },
    profileCard: {
        alignItems: 'center',
        backgroundColor: Colors.SURFACE,
        borderRadius: scale(18),
        paddingVertical: verticalScale(24),
        paddingHorizontal: scale(20),
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        marginVertical: verticalScale(25),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 3,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatarLarge: {
        width: scale(88),
        height: scale(88),
        borderRadius: scale(44),
        backgroundColor: '#172C6B', // Brand Navy
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: Colors.WHITE,
        shadowColor: '#172C6B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionHeader: {
        marginLeft: scale(6),
        marginBottom: verticalScale(8),
        letterSpacing: 1,
    },
    sectionCard: {
        backgroundColor: Colors.SURFACE,
        borderRadius: scale(18),
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        marginBottom: verticalScale(25),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 3,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: verticalScale(14),
        paddingHorizontal: scale(16),
        borderBottomWidth: 1,
        borderBottomColor: Colors.BORDER_GREY,
    },
    menuItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.SURFACE,
        borderRadius: scale(18),
        paddingVertical: verticalScale(14),
        paddingHorizontal: scale(16),
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        marginTop: verticalScale(5),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 12,
        elevation: 3,
    },
});

export default Profile;
