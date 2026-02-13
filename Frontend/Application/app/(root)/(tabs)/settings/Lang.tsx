import { View, Text, I18nManager, NativeModules, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/i18n';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';
import { ThemedText } from '@/components/text/ThemedText';
import Icons from '@/constants/icons';
import { router } from 'expo-router';

const changeLanguage = async (lang: string) => {
  await AsyncStorage.setItem('user-language', lang);
  await i18n.changeLanguage(lang);
  I18nManager.allowRTL(lang === 'ar');
  I18nManager.forceRTL(lang === 'ar');
  NativeModules.DevSettings.reload();
}

type LangOptionProps = {
  lang: "en" | "ar" | "fr";
};

const LangOption = ({lang}: LangOptionProps) => {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      className='flex-row w-full p-6 bg-container dark:bg-container-dark items-center justify-between rounded-xl'
      onPress={() => changeLanguage(lang)}
      style={{boxShadow: '2px 6px 3px rgba(0, 0, 0, 0.05)'}}
    >
      <View className='flex-row gap-4 items-center'>
        <View className='items-center justify-center'>
          {lang as string === "ar"?<Icons.ar />:lang==="fr"?<Icons.fr />:<Icons.en />}
        </View>
        <ThemedText className='text-lg font-Poppins-Medium font-medium'>{t(`settings.${lang}`)}</ThemedText>
      </View>
      <View 
        style={{
          transform: I18nManager.isRTL ? [] : [{ rotateY: "180deg" }]
        }}
      >
        {colorScheme==="dark"?<Icons.ChevronIcon />:(<Icons.ChevronDarkIcon />)}
      </View>
    </TouchableOpacity>
  )
}

const Lang = () => {

  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView className='flex-1 p-6 bg-background dark:bg-background-dark'>
      <View className='flex-row items-center justify-between w-full pb-8 mb-8'>
        <View className='flex-row gap-2 items-center'>
          <ThemedText className='text-2xl font-Poppins-Medium font-bold'>{t("settings.chooseLang")}</ThemedText>
          {colorScheme==="dark"?<Icons.GlobeIcon />:<Icons.GlobeDarkIcon />}
        </View>
        <TouchableOpacity 
          className='justify-center items-center p-2 rounded-full bg-black'
          activeOpacity={0.8}
          onPressOut={()=> router.back()}
        >
          <View style={{ transform: I18nManager.isRTL?"rotateY(180deg)":"none"}}>
            <Icons.BackIcon />
          </View>
        </TouchableOpacity>
      </View>

      <View className='flex-1 flex-col gap-4'>
        <LangOption lang="en" />
        <LangOption lang="ar" />
        <LangOption lang="fr" />
      </View>
    </SafeAreaView>
  )
}

export default Lang