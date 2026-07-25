import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import Svg, { Path } from 'react-native-svg';
import AppText from '../common/AppText';
import Colors from '../../utils/Colors.util';

interface SeatItemProps {
    seatNumber: number;
    status: 'available' | 'selected' | 'booked';
    onPress: (seatNumber: number) => void;
}

const CheckIcon = () => (
    <Svg width={scale(14)} height={scale(14)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M20 6L9 17L4 12"
            stroke={Colors.WHITE}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const XIcon = ({ color = '#94A3B8' }: { color?: string }) => (
    <Svg width={scale(12)} height={scale(12)} viewBox="0 0 24 24" fill="none">
        <Path
            d="M18 6L6 18M6 6l12 12"
            stroke={color}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const SeatItem: React.FC<SeatItemProps> = ({ seatNumber, status, onPress }) => {
    const handlePress = () => {
        if (status !== 'booked') {
            onPress(seatNumber);
        }
    };

    if (status === 'booked') {
        return (
            <View style={[styles.container, styles.bookedContainer]}>
                <XIcon color="#94A3B8" />
            </View>
        );
    }

    if (status === 'selected') {
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={handlePress}
                style={[styles.container, styles.selectedContainer]}
            >
                <AppText size={11} weight="700" color="#172C6B" align="center">
                    {seatNumber}
                </AppText>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={handlePress}
            style={[styles.container, styles.availableContainer]}
        >
            <AppText size={11} weight="700" color="#172C6B" align="center">
                {seatNumber}
            </AppText>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: scale(38),
        height: scale(38),
        borderRadius: scale(8),
        justifyContent: 'center',
        alignItems: 'center',
        margin: scale(5),
    },
    availableContainer: {
        backgroundColor: '#EBEFF8',
        borderWidth: 0,
    },
    selectedContainer: {
        backgroundColor: 'rgba(23, 44, 107, 0.15)', // Light brand navy with opacity
        borderWidth: 1.5,
        borderColor: '#172C6B', // Navy border
    },
    bookedContainer: {
        backgroundColor: '#E2E8F0', // Grey for Reserved
        borderWidth: 0,
    },
});

export default memo(SeatItem);

