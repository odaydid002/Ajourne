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
    // Attempt to reload the app so the RTL change takes effect. On native
    // platforms we can use DevSettings.reload, but on web that object is
    // undefined. In that case fall back to a full page reload or simply continue
    // and hope the UI updates without a hard reload.
    if (DevSettings && typeof DevSettings.reload === 'function') {
      DevSettings.reload();
      return false; // let native reload before continuing
    } else if (typeof window !== 'undefined' && window.location) {
      // a normal browser; reload and exit
      window.location.reload();
      return false;
    }
    // if we can't reload, just fall through so initialization continues
  }

  await i18n.changeLanguage(lang);

  if (!storedLang) {
    await AsyncStorage.setItem('user-language', lang);
  }

  return true;
};
