import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { scale, verticalScale } from 'react-native-size-matters';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import colors, { Colors } from '../../../utils/colors';
import Header from '../../../component/Header';
import EmptyCard from '../../../component/common/EmptyCard';
import { INITIAL_NOTIFICATIONS, NotificationItem } from '../../../data/notifications.data';

const Notifications = () => {
    const { t } = useTranslation();
    const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

    const handleNotificationPress = (id: string) => {
        setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read: true } : n))
        );
    };

    return (
        <ScreenWrapper
            backgroundColor={Colors.BACKGROUND}
            header={<Header title={t('notifications_title') || 'Notifications'} showBack={true} />}
        >
            <StatusBar barStyle="dark-content" backgroundColor={Colors.BACKGROUND} />

            <FlatList
                data={notifications}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.notificationCard,
                            !item.read && styles.unreadNotificationCard,
                        ]}
                        activeOpacity={0.8}
                        onPress={() => handleNotificationPress(item.id)}
                    >
                        {/* Title & Time Header */}
                        <View style={styles.cardHeader}>
                            <AppText
                                size={15}
                                weight="800"
                                color={Colors.PRIMARY}
                                style={styles.titleText}
                                numberOfLines={1}
                            >
                                {item.title}
                            </AppText>
                            <AppText size={12} color="#94A3B8" weight="500" style={styles.timeText}>
                                {item.timestamp}
                            </AppText>
                        </View>

                        {/* Description Text */}
                        <AppText
                            size={13}
                            color="#475569"
                            weight="500"
                            style={styles.descriptionText}
                        >
                            {item.message}
                        </AppText>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <EmptyCard
                        title={t('no_notifications_title') || 'No Notifications Yet'}
                        message={t('no_notifications_desc') || "You're all caught up! Booking updates and reminders will appear here."}
                    />
                }
            />
        </ScreenWrapper>
    );
};

export default Notifications;

const styles = StyleSheet.create({
    listContent: {
         paddingTop: verticalScale(14),
        paddingBottom: verticalScale(30),
        flexGrow: 1,
    },
    notificationCard: {
        backgroundColor: Colors.SURFACE,
        borderRadius: scale(14),
        paddingHorizontal: scale(16),
        paddingVertical: verticalScale(14),
        marginBottom: verticalScale(10),
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        shadowColor: Colors.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 1,
    },
    unreadNotificationCard: {
        borderLeftWidth: 3.5,
        borderLeftColor: '#172C6B',
        backgroundColor: '#F8FAFC',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: verticalScale(6),
    },
    titleText: {
        flex: 1,
        marginRight: scale(10),
        letterSpacing: 0.2,
    },
    timeText: {
        flexShrink: 0,
    },
    descriptionText: {
        lineHeight: verticalScale(19),
    },
});
