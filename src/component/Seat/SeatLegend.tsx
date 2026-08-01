import React from 'react';
import { View, StyleSheet } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import AppText from '../common/AppText';
import Colors from '../../utils/Colors.util';

export const SeatLegend: React.FC = () => {
    const { t } = useTranslation();
    return (
        <View style={styles.legendCard}>
            <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendBox, styles.selectedBox]} />
                    <AppText size={12} weight="600" color={Colors.DARK_GRAY}>{t('seatSelection_selected') || "Selected"}</AppText>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendBox, styles.availableBox]} />
                    <AppText size={12} weight="600" color={Colors.DARK_GRAY}>{t('seatSelection_available') || "Available"}</AppText>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendBox, styles.bookedBox]} />
                    <AppText size={12} weight="600" color={Colors.DARK_GRAY}>{t('seatSelection_booked') || "Booked"}</AppText>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    availableBox: {
        backgroundColor: Colors.SEAT_AVAILABLE,
    },
    bookedBox: {
        backgroundColor: Colors.SEAT_BOOKED,
    },
    legendBox: {
        borderRadius: scale(4),
        height: scale(18),
        width: scale(18),
    },
    legendCard: {
        backgroundColor: Colors.SURFACE,
        borderColor: Colors.BORDER_GREY,
        borderRadius: scale(14),
        borderWidth: 1,
        elevation: 2,
        marginBottom: verticalScale(15),
        paddingHorizontal: scale(15),
        paddingVertical: verticalScale(15),
        shadowColor: Colors.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
    },
    legendItem: {
        alignItems: 'center',
        columnGap: scale(8),
        flexDirection: 'row',
    },
    legendRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    selectedBox: {
        backgroundColor: Colors.SEAT_SELECTED,
        borderColor: Colors.SEAT_SELECTED_BORDER,
        borderWidth: 1,
    },
});

export default SeatLegend;
