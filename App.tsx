import './src/i18n/i18n';
import React, { useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import SplashScreen from 'react-native-splash-screen';
import i18n from './src/i18n/i18n';
import Radio from './src/assets/svg/radio_selected_circle.svg';

const App = () => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 2000);
  }, []);

  const { t } = useTranslation();

  const changelanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

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
    </View>
  );
};

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

export default App;
