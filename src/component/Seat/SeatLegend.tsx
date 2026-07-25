import React from 'react';
import { View, StyleSheet } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import Svg, { Path } from 'react-native-svg';
import AppText from '../common/AppText';
import Colors from '../../utils/Colors.util';

export const SeatLegend: React.FC = () => {
    return (
        <View style={styles.legendCard}>
            <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendBox, { backgroundColor: '#EBEFF8' }]} />
                    <AppText size={12} weight="600" color={Colors.DARK_GRAY}>Available</AppText>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendBox, { backgroundColor: 'rgba(23, 44, 107, 0.15)', borderWidth: 1, borderColor: '#172C6B' }]} />
                    <AppText size={12} weight="600" color={Colors.DARK_GRAY}>Selected</AppText>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendBox, { backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center' }]}>
                        <Svg width={scale(8)} height={scale(8)} viewBox="0 0 24 24" fill="none">
                            <Path d="M18 6L6 18M6 6l12 12" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                        </Svg>
                    </View>
                    <AppText size={12} weight="600" color={Colors.DARK_GRAY}>Reserved</AppText>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    legendCard: {
        backgroundColor: Colors.SURFACE,
        borderRadius: scale(14),
        paddingVertical: verticalScale(15),
        paddingHorizontal: scale(15),
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        marginBottom: verticalScale(15),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    legendRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: scale(8),
    },
    legendBox: {
        width: scale(18),
        height: scale(18),
        borderRadius: scale(4),
    },
});

export default SeatLegend;
