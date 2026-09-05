import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import AppText from '../common/AppText';
import colors from '../../utils/colors';

interface PersonalInfoCardProps {
    firstName: string;
    setFirstName: (val: string) => void;
    lastName: string;
    setLastName: (val: string) => void;
    email: string;
    phone: string;
    setPhone: (val: string) => void;
    cnic: string;
    setCnic: (val: string) => void;
    dob: string;
    setDob: (val: string) => void;
    gender: string;
    setGender: (val: string) => void;
    isVerified?: boolean;
}

const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    phone,
    setPhone,
    cnic,
    setCnic,
    dob,
    setDob,
    gender,
    setGender,
    isVerified = true,
}) => {
    const { t } = useTranslation();

    return (
        <View style={styles.cardContainer}>
            <AppText size={16} weight="800" color={colors.SLATE_DARK} style={styles.cardTitle}>
                {t('personal_info_title') || 'Personal Information'}
            </AppText>

            {/* First Name */}
            <View style={styles.inputGroup}>
                <AppText size={12} weight="700" color={colors.SLATE_MEDIUM} style={styles.label}>
                    {t('first_name') || 'First Name'} *
                </AppText>
                <TextInput
                    style={styles.textInput}
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder={t('enter_first_name') || 'Enter first name'}
                    placeholderTextColor={colors.SLATE_MUTED}
                />
            </View>

            {/* Last Name */}
            {/* <View style={styles.inputGroup}>
                <AppText size={12} weight="700" color={colors.SLATE_MEDIUM} style={styles.label}>
                    {t('last_name') || 'Last Name'} *
                </AppText>
                <TextInput
                    style={styles.textInput}
                    value={lastName}
                    onChangeText={setLastName}
                    placeholder={t('enter_last_name') || 'Enter last name'}
                    placeholderTextColor={colors.SLATE_MUTED}
                />
            </View> */}

            {/* Email Address with Verified Badge */}
            <View style={styles.inputGroup}>
                <AppText size={12} weight="700" color={colors.SLATE_MEDIUM} style={styles.label}>
                    {t('email_address') || 'Email Address'} *
                </AppText>
                <View style={styles.emailInputWrapper}>
                    <TextInput
                        style={[styles.textInput, styles.emailInput]}
                        value={email}
                        editable={false}
                        placeholder="email@example.com"
                        placeholderTextColor={colors.SLATE_MUTED}
                    />
                    {isVerified && (
                        <View style={styles.verifiedBadge}>
                            <AppText size={11} weight="700" color="#15803D">
                                {t('verified') || 'Verified'}
                            </AppText>
                        </View>
                    )}
                </View>
            </View>

            {/* Phone Number */}
            <View style={styles.inputGroup}>
                <AppText size={12} weight="700" color={colors.SLATE_MEDIUM} style={styles.label}>
                    {t('phone_number') || 'Phone Number'}
                </AppText>
                <TextInput
                    style={styles.textInput}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="+92 3XX XXXXXXX"
                    placeholderTextColor={colors.SLATE_MUTED}
                    keyboardType="phone-pad"
                />
            </View>

            {/* CNIC */}
            <View style={styles.inputGroup}>
                <AppText size={12} weight="700" color={colors.SLATE_MEDIUM} style={styles.label}>
                    {t('cnic_label') || 'CNIC'}
                </AppText>
                <TextInput
                    style={styles.textInput}
                    value={cnic}
                    onChangeText={setCnic}
                    placeholder="35202-1234567-1"
                    placeholderTextColor={colors.SLATE_MUTED}
                    keyboardType="numeric"
                />
            </View>

            {/* Date of Birth */}
            {/* <View style={styles.inputGroup}>
                <AppText size={12} weight="700" color={colors.SLATE_MEDIUM} style={styles.label}>
                    {t('date_of_birth') || 'Date of Birth'} *
                </AppText>
                <TextInput
                    style={styles.textInput}
                    value={dob}
                    onChangeText={setDob}
                    placeholder="MM/DD/YYYY"
                    placeholderTextColor={colors.SLATE_MUTED}
                />
            </View> */}

            {/* Gender */}
            {/* <View style={styles.inputGroup}>
                <AppText size={12} weight="700" color={colors.SLATE_MEDIUM} style={styles.label}>
                    {t('gender_label') || 'Gender'} *
                </AppText>
                <View style={styles.genderRow}>
                    {['Male', 'Female'].map((g) => {
                        const selected = gender.toLowerCase() === g.toLowerCase();
                        return (
                            <TouchableOpacity
                                key={g}
                                style={[styles.genderChip, selected && styles.genderChipSelected]}
                                onPress={() => setGender(g)}
                                activeOpacity={0.8}
                            >
                                <AppText
                                    size={13}
                                    weight="700"
                                    color={selected ? colors.WHITE : colors.SLATE_DARK}
                                >
                                    {g}
                                </AppText>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View> */}
        </View>
    );
};

export default PersonalInfoCard;

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: colors.WHITE,
        borderRadius: scale(20),
        padding: scale(18),
        borderWidth: 1,
        borderColor: colors.BORDER_GREY,
        marginBottom: verticalScale(16),
        shadowColor: colors.BLACK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 3,
    },
    cardTitle: {
        marginBottom: verticalScale(14),
    },
    inputGroup: {
        marginBottom: verticalScale(14),
    },
    label: {
        marginBottom: verticalScale(6),
    },
    textInput: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: colors.BORDER_GREY,
        borderRadius: scale(12),
        paddingHorizontal: scale(14),
        height: verticalScale(44),
        fontSize: scale(13),
        color: colors.SLATE_DARK,
        fontWeight: '600',
    },
    emailInputWrapper: {
        position: 'relative',
        justifyContent: 'center',
    },
    emailInput: {
        paddingRight: scale(80),
        backgroundColor: '#F1F5F9',
    },
    verifiedBadge: {
        position: 'absolute',
        right: scale(10),
        backgroundColor: '#DCFCE7',
        paddingHorizontal: scale(8),
        paddingVertical: verticalScale(3),
        borderRadius: scale(8),
        borderWidth: 1,
        borderColor: '#BBF7D0',
    },
    genderRow: {
        flexDirection: 'row',
        columnGap: scale(10),
    },
    genderChip: {
        flex: 1,
        height: verticalScale(40),
        borderRadius: scale(10),
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: colors.BORDER_GREY,
        justifyContent: 'center',
        alignItems: 'center',
    },
    genderChipSelected: {
        backgroundColor: colors.BLUE_PRIMARY,
        borderColor: colors.BLUE_PRIMARY,
    },
});
