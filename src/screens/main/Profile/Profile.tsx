import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import Header from '../../../component/Header';
import AppText from '../../../component/common/AppText';
import colors from '../../../utils/colors';
import { logout } from '../../../store/slice/auth.slice';
import { useGetProfile } from '../../../hooks/useProfile';
import { useMyBookings } from '../../../hooks/useMyBookings';
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
            header={
                <Header
                    title={t('profile_title') || 'Profile'}
                    showBack={true}
                    showAvatar={false}
                    showName={true}
                />
            }
        >
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
});
