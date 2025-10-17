import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from './en.json';
import ar from './ur.json';
import fr from './fr.json';

const locales = RNLocalize.getLocales();
const deviceLanguage = locales[0]?.languageCode || 'en';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    lng: deviceLanguage,
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      ur: { translation: ar },
      fr: { translation: fr },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
