import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/i18n';
import Radio from '../../assets/svg/radio_selected_circle.svg';
import Toast from 'react-native-toast-message';

const Test = () => {
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
    }

    return (
         <View style={styles.container}>
      <Radio />
      <Text style={styles.title}>{t('welcome')}</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => changelanguage('fr')}
        accessibilityLabel="Switch to French"
      >
        <Text style={styles.buttonText}>{t('french')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => changelanguage('en')}
        accessibilityLabel="Switch to English"
      >
        <Text style={styles.buttonText}>{t('english')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={showToast}
      >
        <Text style={styles.buttonText}>Toast Show</Text>
      </TouchableOpacity>
    </View>
    )
}

export default Test

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

