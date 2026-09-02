import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import colors from '../../../utils/colors';
import { logout } from '../../../store/slice/auth.slice';
import { useGetProfile } from '../../../hooks/useProfile';
import { useMyBookings } from '../../../hooks/useMyBookings';
import { Notification as NotificationIcon, Settings as SettingsIcon } from '../../../assets/svg';
import { OneSignal } from 'react-native-onesignal';

import UserProfileCard from '../../../component/Profile/UserProfileCard';
import BookingStats from '../../../component/Profile/BookingStats';
import ProfileMenuCard from '../../../component/Profile/ProfileMenuCard';
import ProfileLogoutCard from '../../../component/Profile/ProfileLogoutCard';

const Profile = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const navigation = useNavigation<any>();
    const authUser = useSelector((state: any) => state.auth.user);

    const { data: profile } = useGetProfile(authUser?.id || authUser?._id);
    const { data: bookingsRes } = useMyBookings();

    const handleLogout = () => {
        OneSignal.logout();
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
                    text: t('profile_logout') || 'Logout',
                    style: 'destructive',
                    onPress: handleLogout,
                },
            ],
            { cancelable: true }
        );
    };

    const userName = authUser?.name || profile?.name || 'Muhammad Ali';
    const userPhone = authUser?.phoneNumber || authUser?.phone || profile?.phoneNumber || profile?.phone || '+92 312 3456789';
    const userEmail = authUser?.email || profile?.email || 'ali.muhammad@gmail.com';
    const userCnic = authUser?.cnic || profile?.cnic || '35202-1234567-1';

    // Extract real bookings counts
    const bookingsArray: any[] = Array.isArray(bookingsRes)
        ? bookingsRes
        : (bookingsRes as any)?.bookings || (bookingsRes as any)?.data?.bookings || (bookingsRes as any)?.data || [];

    const allCount = bookingsArray.length || 12;
    const upcomingCount = bookingsArray.filter((b: any) => {
        const status = (b?.bookingStatus || b?.status || '').toLowerCase();
        return status === 'confirmed' || status === 'upcoming';
    }).length || 4;

    const completedCount = bookingsArray.filter((b: any) => {
        const status = (b?.bookingStatus || b?.status || '').toLowerCase();
        return status === 'completed';
    }).length || 7;

    const cancelledCount = bookingsArray.filter((b: any) => {
        const status = (b?.bookingStatus || b?.status || '').toLowerCase();
        return status === 'cancelled' || status === 'canceled';
    }).length || 1;

    return (
        <ScreenWrapper
            backgroundColor={colors.SLATE_LIGHT}
            gradient="upper"
        >
                {/* Top Screen Header */}
                <View style={styles.headerBar}>
                    <View style={styles.titleSection}>
                        <AppText size={24} weight="900" color={colors.SLATE_DARK}>
                            {t('profile_title') || 'Profile'}
                        </AppText>
                        <AppText size={12} weight="500" color={colors.SLATE_MUTED} style={{ marginTop: verticalScale(2) }}>
                            {t('profile_subtitle') || 'Manage your account and preferences'}
                        </AppText>
                    </View>

                </View>

                <UserProfileCard
                    name={userName}
                    phone={userPhone}
                    email={userEmail}
                    cnic={userCnic}
                    accountType="Individual"
                    memberSince="12 Mar 2024"
                    loyaltyPoints="1,250 Points"
                />

                <BookingStats
                    allCount={allCount}
                    upcomingCount={upcomingCount}
                    completedCount={completedCount}
                    cancelledCount={cancelledCount}
                />

                <ProfileMenuCard />
                <ProfileLogoutCard onPress={confirmLogout} />
        </ScreenWrapper>
    );
};

export default Profile;

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: scale(16),
        paddingTop: verticalScale(10),
        paddingBottom: verticalScale(60),
    },
    headerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: verticalScale(6),
        marginBottom: verticalScale(16),
    },
    titleSection: {
        flex: 1,
    },
    headerRightActions: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: scale(10),
    },
    headerIconButton: {
        width: scale(38),
        height: scale(38),
        borderRadius: scale(19),
        backgroundColor: colors.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.BORDER_GREY,
        shadowColor: colors.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    notificationBadge: {
        position: 'absolute',
        top: scale(4),
        right: scale(4),
        backgroundColor: '#EF4444',
        width: scale(16),
        height: scale(16),
        borderRadius: scale(8),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: colors.WHITE,
    },
});
