import React from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import AppText from '../common/AppText';
import colors from '../../utils/colors';
import { formatCNIC, cleanPhoneNumber } from '../../helpers/auth.helper';

import AppButton from '../common/AppButton';

interface PersonalInfoCardProps {
    name?: string;
    setName?: (val: string) => void;
    firstName?: string;
    setFirstName?: (val: string) => void;
    lastName?: string;
    setLastName?: (val: string) => void;
    email: string;
    phone: string;
    setPhone: (val: string) => void;
    cnic: string;
    setCnic: (val: string) => void;
    dob?: string;
    setDob?: (val: string) => void;
    gender?: string;
    setGender?: (val: string) => void;
    isVerified?: boolean;
    onSavePress: () => void;
    isSaveDisabled?: boolean;
    isLoading?: boolean;
}

const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({
    name,
    setName,
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
    onSavePress,
    isSaveDisabled = true,
    isLoading = false,
}) => {
    const { t } = useTranslation();

    const displayNameValue = name !== undefined ? name : (firstName || '');

    return (
        <View style={styles.cardContainer}>
            <AppText size={16} weight="800" color={colors.SLATE_DARK} style={styles.cardTitle}>
                {t('personal_info_title') || 'Personal Information'}
            </AppText>

            {/* Name */}
            <View style={styles.inputGroup}>
                <AppText size={12} weight="700" color={colors.SLATE_MEDIUM} style={styles.label}>
                    {t('auth_signup_nameLabel') || 'Name'} *
                </AppText>
                <TextInput
                    style={styles.textInput}
                    value={displayNameValue}
                    onChangeText={(val) => {
                        if (setName) setName(val);
                        if (setFirstName) setFirstName(val);
                    }}
                    placeholder={t('auth_signup_namePlaceholder') || 'Enter your name'}
                    placeholderTextColor={colors.SLATE_MUTED}
                />
            </View>

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
                <View style={styles.phoneInputWrapper}>
                    <View style={styles.prefixBox}>
                        <AppText size={13} weight="700" color={colors.SLATE_DARK}>+92</AppText>
                    </View>
                    <TextInput
                        style={styles.phoneTextInput}
                        value={phone}
                        onChangeText={(text) => setPhone(cleanPhoneNumber(text))}
                        placeholder="3001234567"
                        placeholderTextColor={colors.SLATE_MUTED}
                        keyboardType="phone-pad"
                        maxLength={10}
                    />
                </View>
            </View>

            {/* CNIC */}
            <View style={styles.inputGroup}>
                <AppText size={12} weight="700" color={colors.SLATE_MEDIUM} style={styles.label}>
                    {t('cnic_label') || 'CNIC'}
                </AppText>
                <TextInput
                    style={styles.textInput}
                    value={cnic}
                    onChangeText={(text) => setCnic(formatCNIC(text))}
                    placeholder="35202-1234567-1"
                    placeholderTextColor={colors.SLATE_MUTED}
                    keyboardType="numeric"
                    maxLength={15}
                />
            </View>

            {/* Save Changes Button */}
            <AppButton
                title={t('save_changes') || 'Save Changes'}
                onPress={onSavePress}
                disabled={isSaveDisabled || isLoading}
                loading={isLoading}
                style={[styles.saveButton, isSaveDisabled && styles.saveButtonDisabled]}
            />
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
    phoneInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: colors.BORDER_GREY,
        borderRadius: scale(12),
        height: verticalScale(44),
        overflow: 'hidden',
    },
    prefixBox: {
        paddingHorizontal: scale(12),
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        borderRightWidth: 1,
        borderRightColor: colors.BORDER_GREY,
    },
    phoneTextInput: {
        flex: 1,
        paddingHorizontal: scale(12),
        height: '100%',
        fontSize: scale(13),
        color: colors.SLATE_DARK,
        fontWeight: '600',
    },
    saveButton: {
        marginTop: verticalScale(6),
        backgroundColor: colors.BLUE_PRIMARY,
        borderRadius: scale(12),
    },
    saveButtonDisabled: {
        backgroundColor: '#CBD5E1',
        shadowOpacity: 0,
        elevation: 0,
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
