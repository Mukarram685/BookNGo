import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { scale, verticalScale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import ScreenWrapper from '../../../component/common/ScreenWrapper';
import AppText from '../../../component/common/AppText';
import AppButton from '../../../component/common/AppButton';
import colors from '../../../utils/colors';
import Header from '../../../component/Header';
import { useGetProfile, useUpdateProfile, useChangePassword } from '../../../hooks/useProfile';
import { logout } from '../../../store/slice/auth.slice';
import { OneSignal } from 'react-native-onesignal';
import PersonalInfoCard from '../../../component/Profile/PersonalInfoCard';
import ChangePasswordCard from '../../../component/Profile/ChangePasswordCard';
import { formatCNIC, cleanPhoneNumber } from '../../../helpers/auth.helper';

const UpdateProfile = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const authUser = useSelector((state: any) => state.auth.user);
  const { data: profile } = useGetProfile(authUser?.id || authUser?._id);
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const currentName = (authUser?.name || profile?.name || '').trim();
  const currentPhone = cleanPhoneNumber(authUser?.phone || authUser?.phoneNumber || profile?.phone || profile?.phoneNumber || '');
  const currentCnic = formatCNIC(authUser?.cnic || profile?.cnic || '');

  const [name, setName] = useState(currentName);
  const [phone, setPhone] = useState(currentPhone);
  const [cnic, setCnic] = useState(currentCnic);

  const [initialValues, setInitialValues] = useState({
    name: currentName,
    phone: currentPhone,
    cnic: currentCnic,
  });

  const email = authUser?.email || profile?.email || '';

  useEffect(() => {
    const loadedName = (authUser?.name || profile?.name || '').trim();
    const loadedPhone = cleanPhoneNumber(authUser?.phone || authUser?.phoneNumber || profile?.phone || profile?.phoneNumber || '');
    const loadedCnic = formatCNIC(authUser?.cnic || profile?.cnic || '');

    setName(loadedName);
    setPhone(loadedPhone);
    setCnic(loadedCnic);
    setInitialValues({
      name: loadedName,
      phone: loadedPhone,
      cnic: loadedCnic,
    });
  }, [
    authUser?.name,
    authUser?.phone,
    authUser?.phoneNumber,
    authUser?.cnic,
    profile?.name,
    profile?.phone,
    profile?.phoneNumber,
    profile?.cnic,
  ]);

  // Check if any personal info field has changed compared to saved values
  const isProfileChanged =
    name.trim() !== initialValues.name.trim() ||
    cleanPhoneNumber(phone) !== cleanPhoneNumber(initialValues.phone) ||
    cnic.trim() !== initialValues.cnic.trim();

  // Validate fields for enabling / disabling save button
  const isProfileValid = name.trim().length >= 3;
  const isSaveDisabled = !isProfileChanged || !isProfileValid;

  const handleSaveProfile = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert(t('error') || 'Error', t('enter_name_error') || 'Please enter your name');
      return;
    }
    if (trimmedName.length < 3) {
      Alert.alert(t('error') || 'Error', t('val_name_min') || 'Name must be at least 3 characters');
      return;
    }

    const cleanPhone = cleanPhoneNumber(phone);
    if (phone && cleanPhone.length !== 10) {
      Alert.alert(t('error') || 'Error', t('val_phone_digits') || 'Phone number must be 10 digits (e.g. 3001234567)');
      return;
    }

    if (cnic && !/^\d{5}-\d{7}-\d$/.test(cnic)) {
      Alert.alert(t('error') || 'Error', t('auth_signup_cnicInvalid') || 'CNIC must be in format 00000-0000000-0');
      return;
    }

    updateProfileMutation.mutate(
      {
        id: authUser?.id || authUser?._id,
        data: { name: trimmedName, phoneNumber: cleanPhone, cnic },
      },
      {
        onSuccess: () => {
          setInitialValues({
            name: trimmedName,
            phone: cleanPhone,
            cnic,
          });
        },
      },
    );
  };

  const handlePasswordChange = (
    { currentPass, newPass, confirmPass }: { currentPass: string; newPass: string; confirmPass: string },
    onSuccess: () => void,
  ) => {
    if (!currentPass || !newPass || !confirmPass) {
      Alert.alert(t('error') || 'Error', t('fill_all_password_fields') || 'Please fill all password fields');
      return;
    }
    if (newPass.length < 6) {
      Alert.alert(t('error') || 'Error', t('auth_signup_passwordMin') || 'Password must be at least 6 characters');
      return;
    }
    if (newPass !== confirmPass) {
      Alert.alert(t('error') || 'Error', t('passwords_do_not_match') || 'New passwords do not match');
      return;
    }

    changePasswordMutation.mutate(
      {
        id: authUser?.id || authUser?._id,
        data: { currentPassword: currentPass, newPassword: newPass },
      },
      {
        onSuccess: () => {
          onSuccess();
        },
      },
    );
  };

  const handleLogout = () => {
    Alert.alert(
      t('profile_logoutConfirmTitle') || 'Logout',
      t('profile_logoutConfirmDesc') || 'Are you sure you want to logout?',
      [
        { text: t('cancel') || 'Cancel', style: 'cancel' },
        {
          text: t('profile_logout') || 'Logout',
          style: 'destructive',
          onPress: () => {
            OneSignal.logout();
            dispatch(logout());
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <ScreenWrapper
      backgroundColor={colors.SLATE_LIGHT}
      gradient="upper"
      header={
        <Header
          title={t('profile_settings_title') || 'Profile & Settings'}
          showBack={true}
        />
      }
    >
      <View style={styles.container}>
        <PersonalInfoCard
          name={name}
          setName={setName}
          email={email}
          phone={phone}
          setPhone={setPhone}
          cnic={cnic}
          setCnic={setCnic}
          isVerified={true}
          onSavePress={handleSaveProfile}
          isSaveDisabled={isSaveDisabled}
          isLoading={updateProfileMutation.isPending}
        />

        <ChangePasswordCard
          onSavePress={handlePasswordChange}
          isLoading={changePasswordMutation.isPending}
        />

        <TouchableOpacity
          style={styles.logoutOutlineButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <AppText size={15} weight="700" color="#EF4444">
            {t('profile_logout') || 'Logout'}
          </AppText>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default UpdateProfile;

const styles = StyleSheet.create({
  container: {
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(40),
  },
  helpIconButton: {
    width: scale(38),
    height: scale(38),
    borderRadius: scale(19),
    backgroundColor: colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  profileHeaderCard: {
    alignItems: 'center',
    marginVertical: verticalScale(16),
  },
  avatarCircle: {
    width: scale(72),
    height: scale(72),
    borderRadius: scale(36),
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(10),
    borderWidth: 3,
    borderColor: colors.WHITE,
    shadowColor: colors.BLUE_PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  displayName: {
    marginBottom: verticalScale(2),
  },
  logoutOutlineButton: {
    height: verticalScale(48),
    borderRadius: scale(24),
    borderWidth: 1.5,
    borderColor: '#EF4444',
    backgroundColor: colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(6),
    marginBottom: verticalScale(30),
  },
});
