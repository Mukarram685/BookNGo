import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AppText from '../common/AppText';
import AppButton from '../common/AppButton';
import { useTranslation } from 'react-i18next';
import colors from '../../utils/colors';
import { scale, verticalScale } from 'react-native-size-matters';

interface BookingCardProps {
    booking: {
        id: string;
        route: string;
        date: string;
        time: string;
        status: string;
        price: string;
    };
    onView?: () => void;
}

const BookingCard = ({ booking, onView }: BookingCardProps) => {
    const { t } = useTranslation();
    const isCompleted = booking.status.toLowerCase() === 'completed' || booking.status.toLowerCase() === 'confirmed';

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.headerTextContainer}>
                    <AppText size={16} weight="bold" color={colors.PRIMARY}>{booking.route}</AppText>
                    <AppText size={12} color={colors.TEXT_GREY}>{t('booking_details_id') || "ID"}: #{booking.id}</AppText>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: isCompleted ? colors.GREEN_LIGHT_BG : colors.AMBER_LIGHT_BG }]}>
                    <AppText size={10} weight="800" color={isCompleted ? colors.SUCCESS : colors.AMBER_WARNING}>
                        {booking.status.toUpperCase()}
                    </AppText>
                </View>
            </View>
            
            <View style={styles.details}>
                <View style={styles.detailItem}>
                    <AppText size={11} color={colors.TEXT_GREY} weight="700">{t('booking_details_date') || "DATE"}</AppText>
                    <AppText size={14} weight="600" color={colors.PRIMARY}>{booking.date}</AppText>
                </View>
                <View style={styles.detailItem}>
                    <AppText size={11} color={colors.TEXT_GREY} weight="700">{t('booking_details_time') || "TIME"}</AppText>
                    <AppText size={14} weight="600" color={colors.PRIMARY}>{booking.time}</AppText>
                </View>
            </View>

            <View style={styles.footer}>
                <View>
                    <AppText size={11} color={colors.TEXT_GREY} weight="700">{t('booking_card_total_price') || "TOTAL PRICE"}</AppText>
                    <AppText size={18} weight="800" color={colors.PRIMARY}>Rs. {booking.price}</AppText>
                </View>
                <AppButton
                    title={t('booking_card_view') || "View"}
                    onPress={onView}
                    style={styles.viewButton}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.WHITE,
        borderRadius: scale(16),
        padding: scale(18),
        marginVertical: verticalScale(8),
        borderWidth: 1,
        borderColor: colors.BORDER_GREY,
        shadowColor: colors.BLACK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: scale(15),
    },
    headerTextContainer: {
        flex: 1,
        marginEnd: scale(12),
    },
    statusBadge: {
        paddingHorizontal: scale(12),
        paddingVertical: scale(6),
        borderRadius: scale(8),
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: scale(15),
        paddingVertical: scale(12),
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: colors.BORDER_GREY,
    },
    detailItem: {
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    viewButton: {
        backgroundColor: colors.PRIMARY,
        paddingHorizontal: scale(24),
        paddingVertical: scale(10),
        borderRadius: scale(10),
    },
});

export default BookingCard;
