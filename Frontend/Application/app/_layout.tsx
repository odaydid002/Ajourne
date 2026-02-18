import { SplashScreen, Slot } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';

import './global.css';
import '@/i18n';
import { bootstrapLanguage } from '@/i18n/languageBootstrap';
import { Provider, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initDatabase } from '@/database';
// import { debugDatabase } from '@/database/debugDatabase'; // Uncomment to use debug functions

import uuid from 'react-native-uuid'

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { setColorScheme } = useColorScheme();
  const [ready, setReady] = useState(false);

  const [fontsLoaded] = useFonts({
    'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-Black': require('../assets/fonts/Poppins-Black.ttf'),
  });

  useEffect(() => {
    const init = async () => {
      if (!fontsLoaded) return;

      // 1. Bootstrap language
      const ok = await bootstrapLanguage();
      if (!ok) return;

      // 2. Initialize color scheme
      const storedMode = await AsyncStorage.getItem('mode');
      if (storedMode === 'dark' || storedMode === 'light' || storedMode === 'system') {
        setColorScheme(storedMode);
      } else {
        setColorScheme('system');
      }

      // 3. Initialize SQLite database
      try {
        await initDatabase();
        console.log('Database initialized ✅');
      } catch (err) {
        console.error('Database initialization failed:', err);
      }

      // await debugDatabase.logAllTables();
      // await debugDatabase.logTable('calculators', 50);
      // await debugDatabase.logTable('semesters');
      // await debugDatabase.logTable('modules');
      // await debugDatabase.logStats();
      // await debugDatabase.healthCheck();

      await AsyncStorage.setItem('device-id', "4ec853d7-ed0f-434f-9f26-058b6bd412a0");
      await AsyncStorage.setItem('publisher-id', "1afa5ce2-e3a8-4924-9b38-0c6a61d10477");

      /* 4. Initialize device ID
      let deviceID = await AsyncStorage.getItem('device-id');
      if (!deviceID) {
        deviceID = uuid.v4().toString();
        await AsyncStorage.setItem('device-id', deviceID);
        console.log('Device ID created:', deviceID);
      }*/

      // 5. Hide splash screen and mark ready
      await SplashScreen.hideAsync();
      setReady(true);
    };

    init();
  }, [fontsLoaded]);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <Provider>
          <Slot/>
        </Provider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
