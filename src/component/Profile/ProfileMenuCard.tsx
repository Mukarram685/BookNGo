import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import AppText from '../common/AppText';
import colors from '../../utils/colors';
import {
    Globe,
    Card,
    MapPin,
    Bell,
    ShieldCheck,
    Headset,
    Info,
    Feedback as FeedbackIcon,
    Company,
} from '../../assets/svg';
import ProfileMenuItem, { MenuItemData } from './ProfileMenuItem';

const ProfileMenuCard: React.FC = () => {
    const navigation = useNavigation<any>();
    const { t, i18n } = useTranslation();

    const showComingSoonToast = (featureName: string) => {
        Toast.show({
            type: 'info',
            text1: featureName,
            text2: 'This feature will be available in the upcoming release.',
            position: 'bottom',
            visibilityTime: 2500,
        });
    };

    const currentLangText = i18n.language === 'ur' ? 'اردو' : 'English';

    const menuItems: MenuItemData[] = [
        {
            id: 'language',
            title: t('menu_language') || 'Language',
            icon: <Globe width={scale(18)} height={scale(18)} color={colors.BLUE_PRIMARY} />,
            rightText: currentLangText,
            onPress: () => navigation.navigate('Language'),
        },
        // {
        //     id: 'payment',
        //     title: t('menu_payment_methods') || 'Payment Methods',
        //     icon: <Card width={scale(18)} height={scale(18)} color={colors.BLUE_PRIMARY} />,
        //     onPress: () => showComingSoonToast(t('menu_payment_methods') || 'Payment Methods'),
        // },
        // {
        //     id: 'address',
        //     title: t('menu_saved_addresses') || 'Saved Addresses',
        //     icon: <MapPin width={scale(18)} height={scale(18)} color={colors.BLUE_PRIMARY} />,
        //     onPress: () => showComingSoonToast(t('menu_saved_addresses') || 'Saved Addresses'),
        // },
        {
            id: 'notifications',
            title: t('profile_notification') || 'Notifications',
            icon: <Bell width={scale(18)} height={scale(18)} color={colors.BLUE_PRIMARY} />,
            onPress: () => navigation.navigate('Notifications'),
        },
        {
            id: 'privacy',
            title: t('privacy_security') || 'Privacy & Security',
            icon: <ShieldCheck width={scale(18)} height={scale(18)} color={colors.BLUE_PRIMARY} />,
            onPress: () => navigation.navigate('PrivacyPolicy'),
        },
        {
            id: 'feedback',
            title: t('menu_feedback') || 'Share Feedback',
            icon: <FeedbackIcon width={scale(18)} height={scale(18)} color={colors.BLUE_PRIMARY} />,
            onPress: () => navigation.navigate('Feedback'),
        },
        {
            id: 'register_company',
            title: t('menu_register_company') || 'Register Company',
            icon: <Company width={scale(19)} height={scale(19)} color={colors.BLUE_PRIMARY} />,
            onPress: () => navigation.navigate('RegisterCompany'),
        },
        // {
        //     id: 'support',
        //     title: t('support_center_title') || 'Help & Support',
        //     icon: <Headset width={scale(18)} height={scale(18)} color={colors.BLUE_PRIMARY} />,
        //     onPress: () => navigation.navigate('GetHelp'),
        // },
        {
            id: 'about',
            title: t('about_bookngo') || 'About Book&Go',
            icon: <Info width={scale(18)} height={scale(18)} color={colors.BLUE_PRIMARY} />,
            rightText: 'Version 1.0.0',
            onPress: () => showComingSoonToast(t('about_bookngo') || 'About Book&Go'),
        },
    ];

    return (
        <View style={styles.cardContainer}>

            <AppText size={15} weight="800" color={colors.SLATE_DARK} style={styles.cardTitle}>
                {t('app_settings') || 'App Settings'}
            </AppText>

            <FlatList
                data={menuItems}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item, index }) => (
                    <ProfileMenuItem
                        data={{
                            ...item,
                            isLast: index === menuItems.length - 1,
                        }}
                    />
                )}
            />
        </View>
    );
};

export default ProfileMenuCard;

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: colors.WHITE,
        borderRadius: scale(20),
        padding: scale(12),
        borderWidth: 1,
        borderColor: colors.BORDER_GREY,
        marginBottom: verticalScale(16),
        shadowColor: colors.BLACK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 3,
    },
    cardTitle: {
        marginBottom: verticalScale(10),
    },
});
