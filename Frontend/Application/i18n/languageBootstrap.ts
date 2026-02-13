import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager, DevSettings } from 'react-native';
import i18n from '@/i18n';
import * as Localization from 'expo-localization';

export const bootstrapLanguage = async () => {
  const storedLang = await AsyncStorage.getItem('user-language');

  const deviceLang = Localization.getLocales()[0]?.languageTag || 'en';

  const lang = storedLang || deviceLang.split('-')[0];
  const shouldRTL = lang.startsWith('ar'); 

  if (I18nManager.isRTL !== shouldRTL) {
    I18nManager.allowRTL(shouldRTL);
    I18nManager.forceRTL(shouldRTL);
    DevSettings.reload();
    return false;
  }

  await i18n.changeLanguage(lang);

  if (!storedLang) {
    await AsyncStorage.setItem('user-language', lang);
  }

  return true;
};
