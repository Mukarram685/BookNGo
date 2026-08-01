import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import AppText from '../common/AppText';
import Colors from '../../utils/Colors.util';

interface SeatItemProps {
    seatNumber: number;
    status: 'available' | 'selected' | 'booked';
    onPress: (seatNumber: number) => void;
}

const SeatItem: React.FC<SeatItemProps> = ({ seatNumber, status, onPress }) => {
    const handlePress = () => {
        if (status !== 'booked') {
            onPress(seatNumber);
        }
    };

    if (status === 'booked') {
        return (
            <View style={[styles.container, styles.bookedContainer]}>
                <AppText align="center" color={Colors.WHITE} size={11} weight="700">
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
                <AppText align="center" color={Colors.PRIMARY} size={11} weight="700">
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
            <AppText align="center" color={Colors.WHITE} size={11} weight="700">
                {seatNumber}
            </AppText>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    availableContainer: {
        backgroundColor: Colors.SEAT_AVAILABLE,
        borderWidth: 0,
    },
    bookedContainer: {
        backgroundColor: Colors.SEAT_BOOKED,
        borderWidth: 0,
        // opacity: 0.4,
    },
    container: {
        alignItems: 'center',
        borderRadius: scale(11),
        height: scale(38),
        justifyContent: 'center',
        margin: scale(5),
        width: scale(38),
    },
    selectedContainer: {
        backgroundColor: Colors.SEAT_SELECTED,
        borderColor: Colors.SEAT_SELECTED_BORDER,
        borderWidth: 1,
    },
});

export default memo(SeatItem);
