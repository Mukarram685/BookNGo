import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import AppText from '../common/AppText';
import { useTranslation } from 'react-i18next';
import AppInput from '../TextInput/TextInput';
import colors from '../../utils/colors';
import { User, Phone, Radio } from '../../assets/svg';

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
    const { t } = useTranslation();
    const currentGender = values?.gender || 'Male';

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.seatBadge}>
                    <AppText size={12} weight="800" color={colors.WHITE}>S-{seatNumber}</AppText>
                </View>
                <AppText size={16} weight="800" color={colors.SLATE_DARK}>{t('passenger_details_title') || "Passenger Details"}</AppText>
            </View>

            <AppInput
                placeholder={t('passenger_name_placeholder') || "Full Name"}
                value={values.passengerName}
                onChangeText={(val) => onChange('passengerName', val)}
                error={touched?.passengerName ? errors?.passengerName : undefined}
                LeftIcon={User}
                containerStyle={styles.input}
            />

            <AppInput
                placeholder={t('passenger_cnic_placeholder') || "CNIC (00000-0000000-0)"}
                value={values.passengerCNIC}
                onChangeText={(val) => onChange('passengerCNIC', val)}
                error={touched?.passengerCNIC ? errors?.passengerCNIC : undefined}
                LeftIcon={Radio}
                keyboardType="numeric"
                containerStyle={styles.input}
            />

            <AppInput
                placeholder={t('passenger_phone_placeholder') || "Phone Number"}
                value={values.passengerPhone}
                onChangeText={(val) => onChange('passengerPhone', val)}
                error={touched?.passengerPhone ? errors?.passengerPhone : undefined}
                LeftIcon={Phone}
                keyboardType="phone-pad"
                containerStyle={styles.input}
            />

            {/* Gender Selection Section with Active Radio Buttons & Icons */}
            <View style={styles.genderContainer}>
                <AppText size={13} color={colors.SLATE_MEDIUM} weight="700" style={{ marginBottom: verticalScale(10) }}>
                    {t('booking_details_gender') || "Gender"}
                </AppText>

                <View style={styles.genderOptions}>
                    {/* Male Option */}
                    <TouchableOpacity
                        style={[styles.genderCard, currentGender === 'Male' && styles.genderCardActive]}
                        activeOpacity={0.8}
                        onPress={() => onChange('gender', 'Male')}
                    >
                        <View style={[styles.radioCircle, currentGender === 'Male' && styles.radioCircleActive]}>
                            {currentGender === 'Male' && <View style={styles.radioDot} />}
                        </View>
                        <AppText
                            size={14}
                            color={currentGender === 'Male' ? colors.BLUE_PRIMARY : colors.SLATE_MEDIUM}
                            weight="700"
                            style={{ marginLeft: scale(8) }}
                        >
                            {t('male') || 'Male'}
                        </AppText>
                    </TouchableOpacity>

                    {/* Female Option */}
                    <TouchableOpacity
                        style={[styles.genderCard, currentGender === 'Female' && styles.genderCardActive]}
                        activeOpacity={0.8}
                        onPress={() => onChange('gender', 'Female')}
                    >
                        <View style={[styles.radioCircle, currentGender === 'Female' && styles.radioCircleActive]}>
                            {currentGender === 'Female' && <View style={styles.radioDot} />}
                        </View>
                        <AppText
                            size={14}
                            color={currentGender === 'Female' ? colors.BLUE_PRIMARY : colors.SLATE_MEDIUM}
                            weight="700"
                            style={{ marginLeft: scale(8) }}
                        >
                            {t('female') || 'Female'}
                        </AppText>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.WHITE,
        borderRadius: scale(18),
        padding: scale(18),
        marginBottom: verticalScale(16),
        borderWidth: 1,
        borderColor: colors.BORDER_GREY,
        shadowColor: colors.BLUE_PRIMARY,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: verticalScale(16),
    },
    seatBadge: {
        backgroundColor: colors.BLUE_PRIMARY,
        paddingHorizontal: scale(10),
        paddingVertical: verticalScale(4),
        borderRadius: scale(8),
        marginRight: scale(10),
    },
    input: {
        marginBottom: verticalScale(12),
    },
    genderContainer: {
        marginTop: verticalScale(8),
    },
    genderOptions: {
        flexDirection: 'row',
        gap: scale(12),
    },
    genderCard: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.SLATE_LIGHT,
        borderRadius: scale(12),
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(11),
        borderWidth: 1.5,
        borderColor: colors.BORDER_GREY,
    },
    genderCardActive: {
        backgroundColor: colors.BLUE_LIGHT_BG,
        borderColor: colors.BLUE_PRIMARY,
    },
    radioCircle: {
        width: scale(18),
        height: scale(18),
        borderRadius: scale(9),
        borderWidth: 2,
        borderColor: colors.TEXT_GREY,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.WHITE,
    },
    radioCircleActive: {
        borderColor: colors.BLUE_PRIMARY,
    },
    radioDot: {
        width: scale(9),
        height: scale(9),
        borderRadius: scale(4.5),
        backgroundColor: colors.BLUE_PRIMARY,
    },
});

export default PassengerForm;
