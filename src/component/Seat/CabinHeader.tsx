import React from 'react';
import { View, StyleSheet } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import Svg, { Circle, Path } from 'react-native-svg';
import AppText from '../common/AppText';

const SteeringWheelIcon = () => (
    <Svg width={scale(22)} height={scale(22)} viewBox="0 0 24 24" fill="none">
        <Circle cx="12" cy="12" r="10" stroke="#0052CC" strokeWidth="2" />
        <Circle cx="12" cy="12" r="3" stroke="#0052CC" strokeWidth="2" />
        <Path d="M12 5v4M5 12h4M15 12h4" stroke="#0052CC" strokeWidth="2" />
    </Svg>
);

const EntryIcon = () => (
    <Svg width={scale(22)} height={scale(22)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M14 3h5a2 2 0 012 2v14a2 2 0 01-2 2h-5M11 16l4-4-4-4M15 12H3"
            stroke="#0052CC"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

export const CabinHeader: React.FC = () => {
    const { t } = useTranslation();
    return (
        <View>
            <View style={styles.driverSection}>
                <View style={styles.cabinPanel}>
                    <View style={styles.cabinIconWrapper}>
                        <SteeringWheelIcon />
                    </View>
                    <AppText size={10} weight="800" color="#475467" style={{ marginTop: 4 }}>
                        {t('driver') || "DRIVER"}
                    </AppText>
                </View>

                <View style={styles.cabinPanel}>
                    <View style={styles.cabinIconWrapper}>
                        <EntryIcon />
                    </View>
                    <AppText size={10} weight="800" color="#475467" style={{ marginTop: 4 }}>
                        {t('entry') || "ENTRY"}
                    </AppText>
                </View>
            </View>
            <View style={styles.dashedLine} />
        </View>
    );
};

const styles = StyleSheet.create({
    driverSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: scale(25),
        paddingVertical: verticalScale(6),
    },
    cabinPanel: {
        alignItems: 'center',
    },
    cabinIconWrapper: {
        width: scale(44),
        height: scale(44),
        borderRadius: scale(14),
        backgroundColor: '#EBF3FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dashedLine: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
        marginVertical: verticalScale(12),
        marginHorizontal: scale(16),
    },
});

export default CabinHeader;
