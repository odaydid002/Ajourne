import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager, NativeModules } from 'react-native';
import i18n from '@/i18n';
import * as Localization from 'expo-localization';

export const resetAppData = async () => {
  try {
    // 1️⃣ Clear AsyncStorage
    await AsyncStorage.clear();
    console.log("All AsyncStorage cleared");

    // 2️⃣ Reset i18n to device language
    const deviceLang = Localization.getLocales()[0]?.languageTag.split('-')[0] || 'en';
    await i18n.changeLanguage(deviceLang);

    // 3️⃣ Reset RTL if needed
    const shouldRTL = deviceLang.startsWith('ar');
    if (I18nManager.isRTL !== shouldRTL) {
      I18nManager.allowRTL(shouldRTL);
      I18nManager.forceRTL(shouldRTL);
    }

    // 4️⃣ Reload the app (works in Expo Go / dev)
    if (NativeModules.DevSettings?.reload) {
      NativeModules.DevSettings.reload();
    } else {
      console.warn("DevSettings.reload() not available. Restart the app manually.");
    }
  } catch (err) {
    console.error("Failed to reset app:", err);
  }
};
