import React from 'react';
import { View, StyleSheet } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import AppText from '../common/AppText';
import AppInput from '../TextInput/TextInput';
import Colors, { alpha } from '../../utils/Colors.util';
import { User, Phone, Radio, Male } from '../../assets/svg';

interface PassengerFormProps {
    seatNumber: number;
    values: {
        passengerName: string;
        passengerCNIC: string;
        passengerPhone: string;
        gender: 'Male' | 'Female';
    };
    errors?: any;
    touched?: any;
    onChange: (field: string, value: string) => void;
}

const PassengerForm: React.FC<PassengerFormProps> = ({
    seatNumber,
    values,
    errors,
    touched,
    onChange
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.seatBadge}>
                    <AppText size={12} weight="800" color={Colors.WHITE}>S-{seatNumber}</AppText>
                </View>
                <AppText size={16} weight="700" color={Colors.PRIMARY}>Passenger Details</AppText>
            </View>

            <AppInput
                placeholder="Full Name"
                value={values.passengerName}
                onChangeText={(val) => onChange('passengerName', val)}
                error={touched?.passengerName ? errors?.passengerName : undefined}
                LeftIcon={User}
                containerStyle={styles.input}
            />

            <AppInput
                placeholder="CNIC (00000-0000000-0)"
                value={values.passengerCNIC}
                onChangeText={(val) => onChange('passengerCNIC', val)}
                error={touched?.passengerCNIC ? errors?.passengerCNIC : undefined}
                LeftIcon={Radio}
                keyboardType="numeric"
                containerStyle={styles.input}
            />

            <AppInput
                placeholder="Phone Number"
                value={values.passengerPhone}
                onChangeText={(val) => onChange('passengerPhone', val)}
                error={touched?.passengerPhone ? errors?.passengerPhone : undefined}
                LeftIcon={Phone}
                keyboardType="phone-pad"
                containerStyle={styles.input}
            />

            <View style={styles.genderContainer}>
                <AppText size={13} color={Colors.DARK_GRAY} weight="600" style={{ marginBottom: verticalScale(10) }}>Gender</AppText>
                <View style={styles.genderOptions}>
                    {(['Male', 'Female'] as const).map((g) => (
                        <View key={g} style={styles.genderRow}>
                            <Male
                                width={scale(18)}
                                height={scale(18)}
                                color={values.gender === g ? '#172C6B' : Colors.TEXT_GREY}
                                onPress={() => onChange('gender', g)}
                            />
                            <AppText
                                size={14}
                                color={values.gender === g ? Colors.PRIMARY : Colors.TEXT_GREY}
                                weight="600"
                                style={{ marginLeft: scale(8) }}
                            >
                                {g}
                            </AppText>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.SURFACE,
        borderRadius: scale(16),
        padding: scale(18),
        marginBottom: verticalScale(20),
        borderWidth: 1,
        borderColor: Colors.BORDER_GREY,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(18),
    },
    seatBadge: {
        backgroundColor: '#172C6B', // Matches brand primary navy
        paddingHorizontal: scale(10),
        paddingVertical: scale(4),
        borderRadius: scale(6),
        marginRight: scale(10),
    },
    input: {
        marginBottom: verticalScale(12),
    },
    genderContainer: {
        marginTop: verticalScale(10),
    },
    genderOptions: {
        flexDirection: 'row',
        gap: scale(30),
    },
    genderRow: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});

export default PassengerForm;
