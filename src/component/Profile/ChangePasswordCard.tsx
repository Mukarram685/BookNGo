import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import AppText from '../common/AppText';
import AppButton from '../common/AppButton';
import colors from '../../utils/colors';
import { Eye, EyeOff } from '../../assets/svg';

interface ChangePasswordCardProps {
    onSavePress: (
        passwords: { currentPass: string; newPass: string; confirmPass: string },
        onSuccess: () => void,
    ) => void;
    isLoading?: boolean;
}

const ChangePasswordCard: React.FC<ChangePasswordCardProps> = ({ onSavePress, isLoading = false }) => {
    const { t } = useTranslation();
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const isPasswordFilled = Boolean(currentPass.trim() && newPass.trim() && confirmPass.trim());

    const handleSave = () => {
        onSavePress({ currentPass, newPass, confirmPass }, () => {
            setCurrentPass('');
            setNewPass('');
            setConfirmPass('');
        });
    };

    return (
        <View style={styles.cardContainer}>
            <AppText size={16} weight="800" color={colors.SLATE_DARK} style={styles.cardTitle}>
                {t('change_password_title') || 'Change Password'}
            </AppText>

            {/* Current Password */}
            <View style={styles.inputGroup}>
                <AppText size={12} weight="700" color={colors.SLATE_MEDIUM} style={styles.label}>
                    {t('current_password') || 'Current Password'} *
                </AppText>
                <View style={styles.passwordInputWrapper}>
                    <TextInput
                        style={styles.textInput}
                        value={currentPass}
                        onChangeText={setCurrentPass}
                        secureTextEntry={!showCurrent}
                        placeholder="••••••••••••••••"
                        placeholderTextColor={colors.BORDER_GREY}
                    />
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowCurrent(!showCurrent)}
                        activeOpacity={0.7}
                    >
                        {showCurrent ? (
                            <EyeOff width={scale(18)} height={scale(18)} fill={colors.SLATE_MUTED} />
                        ) : (
                            <Eye width={scale(18)} height={scale(18)} fill={colors.SLATE_MUTED} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* New Password */}
            <View style={styles.inputGroup}>
                <AppText size={12} weight="700" color={colors.SLATE_MEDIUM} style={styles.label}>
                    {t('new_password') || 'New Password'} *
                </AppText>
                <View style={styles.passwordInputWrapper}>
                    <TextInput
                        style={styles.textInput}
                        value={newPass}
                        onChangeText={setNewPass}
                        secureTextEntry={!showNew}
                        placeholder="••••••••••••••••"
                        placeholderTextColor={colors.BORDER_GREY}
                    />
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowNew(!showNew)}
                        activeOpacity={0.7}
                    >
                        {showNew ? (
                            <EyeOff width={scale(18)} height={scale(18)} fill={colors.SLATE_MUTED} />
                        ) : (
                            <Eye width={scale(18)} height={scale(18)} fill={colors.SLATE_MUTED} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
                <AppText size={12} weight="700" color={colors.SLATE_MEDIUM} style={styles.label}>
                    {t('confirm_password') || 'Confirm Password'} *
                </AppText>
                <View style={styles.passwordInputWrapper}>
                    <TextInput
                        style={styles.textInput}
                        value={confirmPass}
                        onChangeText={setConfirmPass}
                        secureTextEntry={!showConfirm}
                        placeholder="••••••••••••••••"
                        placeholderTextColor={colors.BORDER_GREY}
                    />
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowConfirm(!showConfirm)}
                        activeOpacity={0.7}
                    >
                        {showConfirm ? (
                            <EyeOff width={scale(18)} height={scale(18)} fill={colors.SLATE_MUTED} />
                        ) : (
                            <Eye width={scale(18)} height={scale(18)} fill={colors.SLATE_MUTED} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Change Password AppButton */}
            <AppButton
                title={t('change_password_title') || 'Change Password'}
                onPress={handleSave}
                disabled={!isPasswordFilled || isLoading}
                loading={isLoading}
                style={[styles.saveButton, !isPasswordFilled && styles.saveButtonDisabled]}
            />
        </View>
    );
};

export default ChangePasswordCard;

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
    passwordInputWrapper: {
        position: 'relative',
        justifyContent: 'center',
    },
    textInput: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: colors.BORDER_GREY,
        borderRadius: scale(12),
        paddingHorizontal: scale(14),
        paddingRight: scale(45),
        height: verticalScale(44),
        fontSize: scale(13),
        color: colors.SLATE_DARK,
        fontWeight: '600',
    },
    eyeButton: {
        position: 'absolute',
        right: scale(14),
        padding: scale(4),
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
});
