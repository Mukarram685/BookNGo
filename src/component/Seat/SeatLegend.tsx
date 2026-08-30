import React from 'react';
import { View, StyleSheet } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import AppText from '../common/AppText';
import { Seat as SeatIcon } from '../../assets/svg';
import colors from '../../constants/colors';

export const SeatLegend: React.FC = () => {
    const { t } = useTranslation();
    return (
        <View style={styles.legendCard}>
            <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                    <SeatIcon width={scale(18)} height={scale(18)} color={colors.PRIMARY} />
                    <AppText size={12} weight="600" color={colors.PRIMARY}>
                        {t('seatSelection_available') || "Available"}
                    </AppText>
                </View>
                <View style={styles.legendItem}>
                    <SeatIcon width={scale(18)} height={scale(18)} color={colors.GREEN_SUCCESS} />
                    <AppText size={12} weight="600" color={colors.GREEN_SUCCESS}>
                        {t('seatSelection_selected') || "Selected"}
                    </AppText>
                </View>
                <View style={styles.legendItem}>
                    <SeatIcon width={scale(18)} height={scale(18)} color={colors.RED} />
                    <AppText size={12} weight="600" color={colors.RED}>
                        {t('seatSelection_booked') || "Reserved"}
                    </AppText>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    legendCard: {
        backgroundColor: colors.WHITE,
        borderColor: colors.BORDER_GREY,
        borderRadius: scale(16),
        borderWidth: 1,
        elevation: 2,
        marginBottom: verticalScale(14),
        paddingHorizontal: scale(14),
        paddingVertical: verticalScale(14),
        shadowColor: colors.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
    },
    legendItem: {
        alignItems: 'center',
        columnGap: scale(6),
        flexDirection: 'row',
    },
    legendRow: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
});

export default SeatLegend;
