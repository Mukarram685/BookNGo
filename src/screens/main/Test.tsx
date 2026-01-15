import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/i18n';
import Radio from '../../assets/svg/radio_selected_circle.svg';
import Toast from 'react-native-toast-message';
import DatePicker from './DatePicker';
import NetworkStatus from './NetworkStatus';
import ScreenWrapper from '../../component/common/ScreenWrapper';
import AppInput from '../../component/TextInput/TextInput';
import AppText from '../../component/common/AppText';

const Test = () => {
  console.log('Test Screen Rendered');

  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');

  const user = useSelector((state: any) => state.auth.user);
  console.log('Current User:', user);

  const { t } = useTranslation();

  const changelanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Hello',
      text2: 'This is a toast message 👋'
    });
  };

  // 🔥 Simulate API Loading
  const testLoading = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 seconds fake API delay
  };

  return (
    <ScreenWrapper
      isLoading={loading}     // ✅ THIS is the key line
      contentStyle={styles.container}
    >
      <Radio />
      


      <Text style={styles.title}>{t('welcome')}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => changelanguage('fr')}
      >
        <Text style={styles.buttonText}>{t('french')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => changelanguage('en')}
      >
        <Text style={styles.buttonText}>{t('english')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={showToast}
      >
        <Text style={styles.buttonText}>Toast Show</Text>
      </TouchableOpacity>

      {/* 🔥 TEST LOADING BUTTON */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#ff9500' }]}
        onPress={testLoading}
      >
        <Text style={styles.buttonText}>Test Loading Screen</Text>
      </TouchableOpacity>

      <NetworkStatus />
      <AppInput
        label="Email"
        placeholder="Enter your email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <AppInput
        label="Password"
        placeholder="Enter password"
        secureTextEntry
        error="Password is required"
        isPassword
      />
      <AppText>hy this is my app text component</AppText>
      <DatePicker />
    </ScreenWrapper>
  );
};

export default Test;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 40,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

