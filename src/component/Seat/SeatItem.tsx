import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { scale } from 'react-native-size-matters';
import AppText from '../common/AppText';
import Svg, { Path } from 'react-native-svg';

interface SeatItemProps {
    seatNumber: number;
    status: 'available' | 'selected' | 'booked';
    onPress: (seatNumber: number) => void;
}

const LockBadge = () => (
    <View style={styles.lockBadge}>
        <Svg width={scale(8)} height={scale(8)} viewBox="0 0 24 24" fill="none">
            <Path d="M19 11H5A2 2 0 003 13V20A2 2 0 005 22H19A2 2 0 0021 20V13A2 2 0 0019 11Z" fill="#FFFFFF" />
            <Path d="M7 11V7A5 5 0 0117 7V11" stroke="#FFFFFF" strokeWidth="2.5" />
        </Svg>
    </View>
);

const CheckBadge = () => (
    <View style={styles.checkBadge}>
        <Text style={styles.checkText}>✓</Text>
    </View>
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
                <LockBadge />
                <AppText align="center" color="#991B1B" size={13} weight="800">
                    {seatNumber}
                </AppText>
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
                <CheckBadge />
                <AppText align="center" color="#15803D" size={13} weight="800">
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
            <AppText align="center" color="#1D4ED8" size={13} weight="800">
                {seatNumber}
            </AppText>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        borderRadius: scale(10),
        height: scale(44),
        justifyContent: 'center',
        margin: scale(4),
        width: scale(42),
        position: 'relative',
    },
    availableContainer: {
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    bookedContainer: {
        backgroundColor: '#FFE4E6',
        borderWidth: 1,
        borderColor: '#FECDD3',
    },
    selectedContainer: {
        backgroundColor: '#DCFCE7',
        borderColor: '#BBF7D0',
        borderWidth: 1,
    },
    lockBadge: {
        position: 'absolute',
        top: scale(3),
        right: scale(3),
        width: scale(12),
        height: scale(12),
        borderRadius: scale(6),
        backgroundColor: '#F43F5E',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkBadge: {
        position: 'absolute',
        top: scale(3),
        right: scale(3),
        width: scale(12),
        height: scale(12),
        borderRadius: scale(6),
        backgroundColor: '#22C55E',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkText: {
        color: '#FFFFFF',
        fontSize: scale(8),
        fontWeight: '900',
        marginTop: -1,
    },
});

export default memo(SeatItem);
