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
import { useGetProfile, useUpdateProfile } from '../../../hooks/useProfile';
import { logout } from '../../../store/slice/auth.slice';
import { OneSignal } from 'react-native-onesignal';
import { User, Headset } from '../../../assets/svg';
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

  // Name splitting into First Name and Last Name
  const fullName = authUser?.name || profile?.name || 'Haider Iftikhar';
  const nameParts = fullName.trim().split(' ');
  const initialFirstName = nameParts[0] || 'Haider';
  const initialLastName = nameParts.slice(1).join(' ') || 'Iftikhar';

  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [phone, setPhone] = useState(
    authUser?.phone || authUser?.phoneNumber || profile?.phone || profile?.phoneNumber || '+92 312 3456789',
  );
  const [cnic, setCnic] = useState(formatCNIC(authUser?.cnic || profile?.cnic || '35202-1234567-1'));
  const [dob, setDob] = useState(authUser?.dateOfBirth || profile?.dateOfBirth || '07/15/1998');
  const [gender, setGender] = useState(authUser?.gender || profile?.gender || 'Male');

  const email = authUser?.email || profile?.email || 'haider@example.com';

  useEffect(() => {
    if (authUser?.name || profile?.name) {
      const parts = (authUser?.name || profile?.name || '').trim().split(' ');
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
    }
    if (authUser?.phone || authUser?.phoneNumber || profile?.phone || profile?.phoneNumber) {
      setPhone(authUser?.phone || authUser?.phoneNumber || profile?.phone || profile?.phoneNumber);
    }
    if (authUser?.cnic || profile?.cnic) {
      setCnic(formatCNIC(authUser?.cnic || profile?.cnic));
    }
  }, [authUser, profile]);

  const handleSaveProfile = () => {
    const combinedName = `${firstName} ${lastName}`.trim();
    if (!combinedName) {
      Alert.alert(t('error') || 'Error', t('enter_name_error') || 'Please enter your name');
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
        data: { name: combinedName, phoneNumber: cleanPhone, cnic, dateOfBirth: dob, gender },
      },
      {
        onSuccess: () => {
          Alert.alert(t('success') || 'Success', t('profile_updated_successfully') || 'Profile updated successfully');
        },
      },
    );
  };

  const handlePasswordChange = ({ currentPass, newPass, confirmPass }: { currentPass: string; newPass: string; confirmPass: string }) => {
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

    // Call update profile / password mutation
    handleSaveProfile();
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
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          email={email}
          phone={phone}
          setPhone={setPhone}
          cnic={cnic}
          setCnic={setCnic}
          dob={dob}
          setDob={setDob}
          gender={gender}
          setGender={setGender}
          isVerified={true}
        />

        <ChangePasswordCard
          onSavePress={handlePasswordChange}
          isLoading={updateProfileMutation.isPending}
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
