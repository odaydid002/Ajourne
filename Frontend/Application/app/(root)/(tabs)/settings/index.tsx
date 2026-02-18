import CustomModal from '@/components/containers/CustomModal'
import SettingOption from '@/components/containers/SettingOption'
import { ThemedText } from '@/components/text/ThemedText'
import Icons from '@/components/text/icons'
import i18n from '@/i18n'
import getUserData from '@/services/getUserData'
import { resetAppData } from '@/services/resetAppData'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { router } from 'expo-router'
import { useColorScheme } from 'nativewind'
import React, { ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { I18nManager, NativeModules, ScrollView, Text, TouchableOpacity, View, Switch } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

const Settings = () => {
  const { t } = useTranslation();
  const { colorScheme, setColorScheme  } = useColorScheme();
  const insets = useSafeAreaInsets();

  const [aboutOpen, setAboutOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [userAge, setUserAge] = useState('');
  const [userUniv, setUserUniv] = useState('');
  const [userSpec, setUserSpec] = useState('');
  const [userLang, setUserLang] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      const [name, age, univ, spec, lang] = await Promise.all([
        getUserData.getUsername(),
        getUserData.getAge(),
        getUserData.getUniv(),
        getUserData.getSpec(),
        getUserData.getLang(),
      ]);
      setUsername(name??"Guest");
      setUserAge(age??"-");
      setUserUniv(univ??"OTHER");
      setUserSpec(spec??"OTHER");
      setUserLang(lang??"en");
      //console.log(name, age, univ, spec, lang);
    };
    loadUserData();
  }, []);

  return (
    <SafeAreaView className='flex-1 p-4 bg-background dark:bg-background-dark'>
      <View className='flex-row justify-between w-full pb-4 mt-4'>
        <ThemedText className='text-2xl font-Poppins-Medium font-bold'>{t("control.settings")}</ThemedText>
        {colorScheme === "dark" ? <Icons.SettingsIcon /> : (<Icons.SettingsDarkIcon />)}
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        className="flex-1 flex-col overflow-visible"
      >
        <SettingOption className='my-4 px-6 py-4'>
          <View className='flex-cox flex-1 gap-4'>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={()=> router.push('/settings/Profile')}
              className='flex-row items-center justify-between '
            >
              <View className='flex-col flex-1 gap-1'>
                <ThemedText className='text-lg font-Poppins-Bold font-bold'>{t("settings.academicProfile")}</ThemedText>
                <ThemedText className='text-sm opacity-60'>{t(`universities.${userUniv}`)} - {i18n.exists(`specialities.${userSpec}`)?t(`specialities.${userSpec}`):userSpec}</ThemedText>
              </View>
              <View 
                style={{
                  transform: I18nManager.isRTL ? [] : [{ rotateY: "180deg" }],
                  width: 25
                }}
              >
                {colorScheme==="dark"?<Icons.ChevronIcon />:(<Icons.ChevronDarkIcon />)}
              </View>
            </TouchableOpacity>
            <View style={{height: 2}} className='bg-inp rounded-full opacity-60 w-[90%] self-center my-1' />
            <TouchableOpacity
              onPress={() => router.push("/settings/Lang")}
              activeOpacity={0.6}
              className='flex-row items-center justify-between'
            >
              <View className='flex-col gap-1'>
                <ThemedText className='text-lg font-Poppins-Bold font-bold'>{t("settings.lang")}</ThemedText>
                <ThemedText className='text-sm opacity-60'>{t(`settings.${userLang}`)}</ThemedText>
              </View>
              {userLang === 'en'?<Icons.en />:userLang === 'fr'?<Icons.fr />: <Icons.ar />}
            </TouchableOpacity>
          </View>
        </SettingOption>
        <SettingOption
          touchable
          className='my-4 px-6 py-2'
          onPress={async () => {
            const nextMode = colorScheme === 'dark' ? 'light' : 'dark'
            setColorScheme(nextMode)
            await AsyncStorage.setItem('mode', nextMode)
          }}
        >
          <View className='flex-1 flex-row items-center gap-2'>
              <ThemedText className='text-lg font-Poppins-Bold font-bold'>{t("settings.darkMode")}</ThemedText>
              <View 
                style={{
                  transform: !I18nManager.isRTL ? [] : [{ rotateY: "180deg" }]
                }}
              >
                {colorScheme==="dark"?<Icons.MoonIcon />:<Icons.SunIcon />}
              </View>
          </View>
          <Switch
            trackColor={{false: '#767577', true: '#F15758'}}
            thumbColor='#f4f3f4'
            ios_backgroundColor="#3e3e3e"
            value={colorScheme==="dark"}
          />
        </SettingOption>
        <SettingOption className='my-4 px-6 py-4'>
          <View className='flex-cox flex-1 gap-4'>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={()=> setAboutOpen(true)}
              className='flex-row items-center justify-between py-1'
            >
                <ThemedText className='text-lg font-Poppins-Bold font-bold mt-1'>{t("settings.about")}</ThemedText>
              <View 
                style={{
                  transform: I18nManager.isRTL ? [] : [{ rotateY: "180deg" }],
                  width: 20
                }}
              >
                {colorScheme==="dark"?<Icons.ChevronIcon />:(<Icons.ChevronDarkIcon />)}
              </View>
            </TouchableOpacity>
            <View style={{height: 2}} className='bg-inp rounded-full opacity-60 w-[90%] self-center my-1' />
            <TouchableOpacity
              onPress={()=> router.push('/settings/Contact')}
              activeOpacity={0.6}
              className='flex-row items-center justify-between py-1'
            >
                <ThemedText className='text-lg font-Poppins-Bold font-bold'>{t("settings.contactUs")}</ThemedText>
              <View 
                style={{
                  transform: I18nManager.isRTL ? [] : [{ rotateY: "180deg" }],
                  width: 20
                }}
              >
                {colorScheme==="dark"?<Icons.ChevronIcon />:(<Icons.ChevronDarkIcon />)}
              </View>
            </TouchableOpacity>
          </View>
        </SettingOption>
        <SettingOption
          className='my-4 px-6 py-4'
          touchable
          onPress={async () => {await resetAppData()}}
        >
          <Text className='text-lg text-red-500 py-2'>{t('settings.clearData')}</Text>
          <Icons.TrashRedIcon />
        </SettingOption>

      </ScrollView>

      <CustomModal title={t("settings.about")} visible={aboutOpen} toggle={() => setAboutOpen(false)}>
        <View className='flex-1 flex-col p-4 justify-center items-center'>
          <Icons.Logo />
          <Text className='text-lg font-Poppins-Black text-primary-100 mt-2'>
            Ajourne
          </Text>
          <ThemedText className='text-sm'>Version: 1.0.0</ThemedText>
          <ThemedText className='my-4'>{t('settings.aboutPara')}</ThemedText>
          <View className='flex-col justify-center items-center opacity-20 mt-4'>
            <ThemedText className='text-sm'>Ajoutne Corparation</ThemedText>
            <ThemedText className='text-sm'>Copy &copy; 2026</ThemedText>
          </View>
        </View>
      </CustomModal>

    </SafeAreaView>
  )
}

export default Settings