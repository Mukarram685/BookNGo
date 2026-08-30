import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import Colors from '../../../utils/Colors.util';
import Header from '../../../component/Header';
import { useGetProfile, useUpdateProfile } from '../../../hooks/useProfile';

const UpdateProfile = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const authUser = useSelector((state: any) => state.auth.user);
  const { data: profile } = useGetProfile(authUser?.id || authUser?._id);
  const updateProfileMutation = useUpdateProfile();

  const [name, setName] = useState(authUser?.name || profile?.name || '');
  const [phone, setPhone] = useState(
    authUser?.phone ||
      authUser?.phoneNumber ||
      profile?.phone ||
      profile?.phoneNumber ||
      '',
  );
  const [cnic, setCnic] = useState(authUser?.cnic || profile?.cnic || '');
  const email = authUser?.email || profile?.email || '';

  const formatCNIC = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 13);
    if (cleaned.length > 12) {
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 12)}-${cleaned.slice(
        12,
      )}`;
    } else if (cleaned.length > 5) {
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    }
    return cleaned;
  };

  useEffect(() => {
    if (authUser?.name) setName(authUser.name);
    if (authUser?.phone || authUser?.phoneNumber)
      setPhone(authUser.phone || authUser.phoneNumber);
    if (authUser?.cnic) setCnic(authUser.cnic);
  }, [authUser]);

  const handleUpdate = () => {
    if (!name.trim()) {
      return;
    }
    updateProfileMutation.mutate(
      {
        id: authUser?.id || authUser?._id,
        data: { name, phoneNumber: phone, cnic },
      },
      {
        onSuccess: () => {
          navigation.goBack();
        },
      },
    );
  };

  const getInitials = (nameStr: string) => {
    if (!nameStr) return 'UN';
    const parts = nameStr.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <ScreenWrapper
      backgroundColor={Colors.BACKGROUND}
      header={
        <Header
          title={t('personal_info_screen_title') || 'Personal Information'}
          showBack={true}
        />
      }
    >
      {/* Centered Avatar */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarLarge}>
          <AppText size={28} weight="900" color={Colors.WHITE}>
            {getInitials(name)}
          </AppText>
        </View>
      </View>

      {/* Form Fields Card */}
      <View style={styles.formCard}>
        <View style={styles.inputGroup}>
          <AppText
            size={12}
            color={Colors.TEXT_GREY}
            weight="800"
            style={styles.label}
          >
            {t('full_name') || 'FULL NAME'}
          </AppText>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder={t('auth_signup_namePlaceholder') || 'Enter your name'}
            placeholderTextColor={Colors.TEXT_GREY}
          />
        </View>

        <View style={styles.inputGroup}>
          <AppText
            size={12}
            color={Colors.TEXT_GREY}
            weight="800"
            style={styles.label}
          >
            {t('email_address') || 'EMAIL ADDRESS'}
          </AppText>
          <TextInput
            style={[styles.textInput, styles.disabledInput]}
            value={email}
            editable={false}
            placeholder={t('auth_signup_emailPlaceholder') || 'Email address'}
            placeholderTextColor={Colors.TEXT_GREY}
          />
        </View>

        <View style={styles.inputGroup}>
          <AppText
            size={12}
            color={Colors.TEXT_GREY}
            weight="800"
            style={styles.label}
          >
            {t('auth_signup_cnicLabel') || 'CNIC'}
          </AppText>
          <TextInput
            style={styles.textInput}
            value={cnic}
            onChangeText={val => setCnic(formatCNIC(val))}
            placeholder="00000-0000000-0"
            placeholderTextColor={Colors.TEXT_GREY}
            keyboardType="numeric"
            maxLength={15}
          />
        </View>

        <View style={styles.inputGroup}>
          <AppText
            size={12}
            color={Colors.TEXT_GREY}
            weight="800"
            style={styles.label}
          >
            {t('phone_number') || 'PHONE NUMBER'}
          </AppText>
          <TextInput
            style={styles.textInput}
            value={phone}
            onChangeText={setPhone}
            placeholder={
              t('auth_signup_phonePlaceholder') || 'Enter phone number'
            }
            placeholderTextColor={Colors.TEXT_GREY}
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <View style={styles.infoContent}>
        <AppText size={13} weight="800" color={Colors.SLATE_DARK}>
          Your information is secure
        </AppText>

        <AppText
          size={11}
          weight="500"
          color={Colors.SLATE_MUTED}
          style={styles.infoText}
        >
          Your personal information is protected and only used to manage your
          BookNGo account.
        </AppText>
      </View>

      {/* Update Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          updateProfileMutation.isPending && styles.disabledButton,
        ]}
        onPress={handleUpdate}
        disabled={updateProfileMutation.isPending}
        activeOpacity={0.8}
      >
        <AppText size={16} weight="700" color={Colors.WHITE}>
          {updateProfileMutation.isPending
            ? t('bookingReview_processing') || 'Updating...'
            : t('save_changes') || 'Save Changes'}
        </AppText>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(30),
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: verticalScale(20),
  },
  avatarLarge: {
    width: scale(88),
    height: scale(88),
    borderRadius: scale(44),
    backgroundColor: '#172C6B', // Brand Navy
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#172C6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 3,
    borderColor: Colors.WHITE,
  },
  formCard: {
    backgroundColor: Colors.SURFACE,
    borderRadius: scale(18),
    padding: scale(20),
    borderWidth: 1,
    borderColor: Colors.BORDER_GREY,
    marginBottom: verticalScale(30),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: verticalScale(18),
  },
  label: {
    marginBottom: verticalScale(6),
    marginLeft: scale(2),
    letterSpacing: 0.8,
  },
  textInput: {
    backgroundColor: '#F8FAFF', // Light theme text field back
    borderWidth: 1,
    borderColor: Colors.BORDER_GREY,
    borderRadius: scale(12),
    paddingHorizontal: scale(14),
    height: verticalScale(46),
    fontSize: scale(14),
    color: Colors.PRIMARY,
    fontWeight: '600',
  },
  disabledInput: {
    backgroundColor: '#F1F5F9', // Slightly darker back for read-only
    color: Colors.DARK_GRAY,
  },

  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: Colors.BLUE_LIGHT_BG,

    borderRadius: scale(16),

    paddingHorizontal: scale(13),
    paddingVertical: verticalScale(12),

    marginTop: verticalScale(14),

    borderWidth: 1,
    borderColor: Colors.BLUE_BORDER,
  },

  infoCircle: {
    width: scale(32),
    height: scale(32),

    borderRadius: scale(16),

    backgroundColor: Colors.WHITE,

    alignItems: 'center',
    justifyContent: 'center',

    marginRight: scale(10),
  },

  infoContent: {
    flex: 1,
  },

  infoText: {
    marginTop: verticalScale(2),
    lineHeight: verticalScale(16),
  },
  submitButton: {
    backgroundColor: '#172C6B', // Brand Navy
    height: scale(50),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: Colors.TEXT_GREY,
  },
});

export default UpdateProfile;
