import { I18nManager } from 'react-native';
import RNRestart from 'react-native-restart';

/**
 * Check if the language code is Urdu or another RTL language.
 */
export const isRTL = (lang: string): boolean => {
  return lang === 'ur';
};

/**
 * Handle RTL layout logic based on current language.
 * Force-reloads the React Native app if the layout changes.
 */
export const handleLanguageRTL = (lang: string) => {
  const shouldBeRTL = isRTL(lang);
  if (I18nManager.isRTL !== shouldBeRTL) {
    I18nManager.allowRTL(shouldBeRTL);
    I18nManager.forceRTL(shouldBeRTL);
    
    // Allow React Native to complete layout updates before restarting
    setTimeout(() => {
      RNRestart.Restart();
    }, 150);
  }
};
