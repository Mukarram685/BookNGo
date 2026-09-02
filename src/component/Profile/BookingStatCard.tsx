import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import AppText from '../common/AppText';
import colors from '../../utils/colors';

export interface BookingStatData {
    id: string;
    title: string;
    count: number;
    bgColor: string;
    icon: React.ReactNode;
    onPress?: () => void;
}

interface BookingStatCardProps {
    data: BookingStatData;
}

const BookingStatCard: React.FC<BookingStatCardProps> = ({ data }) => {
    const { title, count, bgColor, icon, onPress } = data;

    return (
        <TouchableOpacity
            style={[styles.statBox, { backgroundColor: bgColor }]}
            activeOpacity={0.8}
            onPress={onPress}
        >
            <View style={styles.iconWrapper}>
                {icon}
            </View>
            <AppText size={20} weight="800" color={colors.SLATE_DARK} style={styles.statCount}>
                {count}
            </AppText>
            <AppText size={11} weight="600" color="#475569" style={styles.statLabel}>
                {title}
            </AppText>
        </TouchableOpacity>
    );
};

export default BookingStatCard;

const styles = StyleSheet.create({
    statBox: {
        width: scale(90),
        borderRadius: scale(18),
        paddingVertical: verticalScale(8),
        paddingHorizontal: scale(4),
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapper: {
        height: scale(28),
        justifyContent: 'center',
        alignItems: 'center',
    },
    statCount: {
        marginTop: verticalScale(6),
        marginBottom: verticalScale(2),
    },
    statLabel: {
        textAlign: 'center',
    },
});
