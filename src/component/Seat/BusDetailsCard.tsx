import React from 'react';
import { View, StyleSheet } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import Svg, { Path } from 'react-native-svg';
import AppText from '../common/AppText';
import Colors from '../../utils/Colors.util';
import { Wifi, Charger, AC, Bus } from '../../assets/svg';

// Custom WC Icon
const WCIcon = () => (
    <Svg width={scale(16)} height={scale(16)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M9 22V11m0 0V8a2 2 0 012-2h2a2 2 0 012 2v3m-6 0h6m0 0v11M12 2a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"
            stroke="#475569"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export const BusDetailsCard: React.FC = () => {
    return (
        <View style={styles.detailsCard}>
            <View style={styles.detailsHeader}>
                <Bus width={scale(20)} height={scale(20)} fill={Colors.PRIMARY} />
                <AppText size={16} weight="700" color={Colors.PRIMARY} style={{ marginLeft: scale(8) }}>
                    Bus Details
                </AppText>
            </View>
            
            <View style={styles.amenitiesGrid}>
                <View style={styles.amenityItem}>
                    <View style={styles.amenityIconBox}>
                        <Wifi width={scale(16)} height={scale(16)} fill={Colors.DARK_GRAY} />
                    </View>
                    <AppText size={12} weight="600" color={Colors.DARK_GRAY}>Free WiFi</AppText>
                </View>

                <View style={styles.amenityItem}>
                    <View style={styles.amenityIconBox}>
                        <Charger width={scale(16)} height={scale(16)} fill={Colors.DARK_GRAY} />
                    </View>
                    <AppText size={12} weight="600" color={Colors.DARK_GRAY}>USB Port</AppText>
                </View>

                <View style={styles.amenityItem}>
                    <View style={styles.amenityIconBox}>
                        <AC width={scale(16)} height={scale(16)} fill={Colors.DARK_GRAY} />
                    </View>
                    <AppText size={12} weight="600" color={Colors.DARK_GRAY}>Fully AC</AppText>
                </View>

                <View style={styles.amenityItem}>
                    <View style={styles.amenityIconBox}>
                        <WCIcon />
                    </View>
                    <AppText size={12} weight="600" color={Colors.DARK_GRAY}>On-board WC</AppText>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    detailsCard: {
        backgroundColor: Colors.SURFACE,
        borderRadius: scale(20),
        padding: scale(18),
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    detailsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(15),
    },
    amenitiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: verticalScale(12),
    },
    amenityItem: {
        width: '50%',
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: scale(8),
    },
    amenityIconBox: {
        width: scale(32),
        height: scale(32),
        borderRadius: scale(8),
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default BusDetailsCard;
