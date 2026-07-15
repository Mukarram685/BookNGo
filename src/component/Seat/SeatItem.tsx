import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import AppText from '../common/AppText';
import Colors, { alpha } from '../../utils/Colors.util';

interface SeatItemProps {
    seatNumber: number;
    status: 'available' | 'selected' | 'booked';
    onPress: (seatNumber: number) => void;
}

const SeatItem: React.FC<SeatItemProps> = ({ seatNumber, status, onPress }) => {
    const getBackgroundColor = () => {
        switch (status) {
            case 'selected':
                return Colors.BRIGHT_BLUE;
            case 'booked':
                return alpha(Colors.RED, 0.1);
            default:
                return Colors.INPUT_BG;
        }
    };

    const getBorderColor = () => {
        switch (status) {
            case 'selected':
                return Colors.BRIGHT_BLUE;
            case 'booked':
                return alpha(Colors.RED, 0.5);
            default:
                return alpha(Colors.BRIGHT_BLUE, 0.4);
        }
    };

    const getTextColor = () => {
        switch (status) {
            case 'selected':
                return Colors.WHITE;
            case 'booked':
                return Colors.RED;
            default:
                return Colors.WHITE;
        }
    };

    const handlePress = () => {
        if (status !== 'booked') {
            onPress(seatNumber);
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={status === 'booked' ? 1 : 0.7}
            onPress={handlePress}
            style={[
                styles.container,
                {
                    backgroundColor: getBackgroundColor(),
                    borderColor: getBorderColor(),
                },
            ]}
        >
            <View style={[
                styles.headrest,
                { backgroundColor: status === 'selected' ? alpha(Colors.WHITE, 0.2) : alpha(Colors.BLACK, 0.2) }
            ]} />

            <AppText size={10} weight="700" color={getTextColor()}>
                {seatNumber}
            </AppText>

            <View style={styles.cushion} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: scale(38),
        height: scale(42),
        borderRadius: scale(8),
        borderWidth: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        margin: scale(4),
        // Depth effect
        shadowColor: Colors.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    headrest: {
        width: '60%',
        height: scale(10),
        position: 'absolute',
        top: scale(2),
        borderRadius: scale(3),
    },
    cushion: {
        position: 'absolute',
        bottom: scale(4),
        width: '80%',
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: scale(1),
    }
});

export default memo(SeatItem);
