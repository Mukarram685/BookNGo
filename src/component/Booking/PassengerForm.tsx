import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import AppText from '../common/AppText';
import { useTranslation } from 'react-i18next';
import AppInput from '../TextInput/TextInput';
import Colors from '../../utils/Colors.util';
import { User, Phone, Radio, Male, Female } from '../../assets/svg';

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
                    <AppText size={12} weight="800" color={Colors.WHITE}>S-{seatNumber}</AppText>
                </View>
                <AppText size={16} weight="800" color="#0F172A">{t('passenger_details_title') || "Passenger Details"}</AppText>
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
                <AppText size={13} color="#475467" weight="700" style={{ marginBottom: verticalScale(10) }}>
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
                            color={currentGender === 'Male' ? '#0052CC' : '#475467'}
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
                            color={currentGender === 'Female' ? '#0052CC' : '#475467'}
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
        backgroundColor: '#FFFFFF',
        borderRadius: scale(18),
        padding: scale(18),
        marginBottom: verticalScale(16),
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#0052CC',
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
        backgroundColor: '#0052CC',
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
        backgroundColor: '#F8FAFC',
        borderRadius: scale(12),
        paddingHorizontal: scale(12),
        paddingVertical: verticalScale(11),
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
    },
    genderCardActive: {
        backgroundColor: '#EBF3FF',
        borderColor: '#0052CC',
    },
    radioCircle: {
        width: scale(18),
        height: scale(18),
        borderRadius: scale(9),
        borderWidth: 2,
        borderColor: '#94A3B8',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    radioCircleActive: {
        borderColor: '#0052CC',
    },
    radioDot: {
        width: scale(9),
        height: scale(9),
        borderRadius: scale(4.5),
        backgroundColor: '#0052CC',
    },
});

export default PassengerForm;
