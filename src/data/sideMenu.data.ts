import React from 'react';
import {
    Notification,
    Feedback,
    Privacy,
    Terms,
    Settings,
    Invite,
    Help,
    MoreApps,
    Emergency,
    Profile,
} from '../assets/svg';

export interface MenuItemData {
    id: string;
    titleKey: string;
    defaultTitle: string;
    Icon: React.FC<any>;
    actionType: 'navigate' | 'share' | 'toast' | 'emergency';
    targetScreen?: string;
    toastTitleKey?: string;
    toastMessageKey?: string;
    isEmergency?: boolean;
}

export const SIDE_MENU_ITEMS: MenuItemData[] = [
    {
        id: 'profile',
        titleKey: 'profile_title',
        defaultTitle: 'Profile',
        Icon: Profile,
        actionType: 'navigate',
        targetScreen: 'Profile',
    },
    {
        id: 'notifications',
        titleKey: 'menu_notifications',
        defaultTitle: 'Notifications (2)',
        Icon: Notification,
        actionType: 'navigate',
        targetScreen: 'Notifications',
    },
    {
        id: 'feedback',
        titleKey: 'menu_feedback',
        defaultTitle: 'Feedback',
        Icon: Feedback,
        actionType: 'navigate',
        targetScreen: 'Feedback',
    },
    {
        id: 'privacy',
        titleKey: 'menu_privacy_policy',
        defaultTitle: 'Privacy Policy',
        Icon: Privacy,
        actionType: 'navigate',
        targetScreen: 'PrivacyPolicy',
    },
    {
        id: 'terms',
        titleKey: 'menu_terms_conditions',
        defaultTitle: 'Terms & Conditions',
        Icon: Terms,
        actionType: 'navigate',
        targetScreen: 'TermsConditions',
    },
    // {
    //     id: 'settings',
    //     titleKey: 'menu_settings',
    //     defaultTitle: 'Settings',
    //     Icon: Settings,
    //     actionType: 'navigate',
    //     targetScreen: 'Language',
    // },
    // {
    //     id: 'invite',
    //     titleKey: 'menu_invite_friend',
    //     defaultTitle: 'Invite a friend',
    //     Icon: Invite,
    //     actionType: 'share',
    // },
    {
        id: 'support',
        titleKey: 'menu_support',
        defaultTitle: 'Support',
        Icon: Help,
        actionType: 'navigate',
        targetScreen: 'GetHelp',
    },
    // {
    //     id: 'more_apps',
    //     titleKey: 'menu_more_apps',
    //     defaultTitle: 'More Apps',
    //     Icon: MoreApps,
    //     actionType: 'toast',
    //     toastTitleKey: 'menu_more_apps_title',
    //     toastMessageKey: 'menu_more_apps_msg',
    // },
    {
        id: 'emergency',
        titleKey: 'menu_emergency_alert',
        defaultTitle: 'Emergency Alert',
        Icon: Emergency,
        actionType: 'emergency',
        isEmergency: true,
    },
];

export const APP_VERSION = '3.3.3';
