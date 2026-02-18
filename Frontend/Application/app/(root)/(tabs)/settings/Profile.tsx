import { View, Text, I18nManager, NativeModules, TouchableOpacity, ScrollView, TextInput, Pressable, useWindowDimensions } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/i18n';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';
import { ThemedText } from '@/components/text/ThemedText';
import Icons from '@/components/text/icons';
import { router } from 'expo-router';
import SettingOption from '@/components/containers/SettingOption';
import ButtonPrimary from '@/components/buttons/ButtonPrimary';
import { useEffect, useState } from 'react';
import getUserData from '@/services/getUserData';
import SelectInput from '@/components/inputs/SelectInput';
import data from '@/constants/data';
import { Snackbar } from 'react-native-paper';


const Profile = () => {

  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const {height} = useWindowDimensions();

  const [username, setUsername] = useState('');
  const [userAge, setUserAge] = useState('');
  const [userUniv, setUserUniv] = useState('');
  const [userSpec, setUserSpec] = useState('');
  const [userLvl, setUserLvl] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('');
  const [selectedUniv, setSelectedUniv] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [userLang, setUserLang] = useState('');
  const [visible, setVisible] = useState(false);

  interface data{
    name: string,
    age: string,
    spec: string,
    lvl: string,
    univ: string,
  }

  const saveData = async ({ name, age, spec, lvl, univ }: data) => {
  try {
    await AsyncStorage.multiSet([
      ['username', name],
      ['user-age', age],
      ['user-university', univ],
      ['user-speciality', spec],
      ['user-level', lvl],
    ]);
    setVisible(true);
  } catch (e) {
    console.error('Save failed', e);
  }
};

  useEffect(() => {
    const loadUserData = async () => {
      const [name, age, univ, spec, lang, lvl] = await Promise.all([
        getUserData.getUsername(),
        getUserData.getAge(),
        getUserData.getUniv(),
        getUserData.getSpec(),
        getUserData.getLang(),
        getUserData.getLvl(),
      ]);
      setUsername(name??"Guest");
      setUserAge(age??"-");
      setUserUniv(univ??"OTHER");
      setUserSpec(spec??"OTHER");
      setUserLang(lang??"en");
      setUserLvl(lvl??"OTHER");
      console.log(name, age, univ, spec, lang, lvl);
    };
    loadUserData();
  }, []);

  return (
    <SafeAreaView className='flex-1 p-6 bg-background dark:bg-background-dark'>
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={3000}
        style={{marginBottom: height - 100}}
        className='self-center'
      >
        {t('control.infoSaved')}
      </Snackbar>
      <View className='flex-row items-center justify-between w-full pb-4 mb-4'>
        <View className='flex-row gap-4 items-center'>
          <ThemedText className='text-2xl font-Poppins-Medium font-bold'>{t("settings.academicProfile")}</ThemedText>
          {colorScheme==="dark"?<Icons.GraduateIcon />:<Icons.GraduateDarkIcon />}
        </View>
        <View className='flex-row gap-4'>
          <TouchableOpacity 
            className='justify-center items-center p-2 rounded-full bg-black'
            activeOpacity={0.8}
            onPress={()=> saveData({ name: username, age: userAge, univ: userUniv, spec: userSpec, lvl: userLvl })}
          >
            <View style={{ transform: I18nManager.isRTL?"rotateY(180deg)":"none"}}>
              <Icons.SaveIcon />
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            className='justify-center items-center p-2 rounded-full bg-black'
            activeOpacity={0.8}
            onPress={()=> router.back()}
          >
            <View style={{ transform: I18nManager.isRTL?"rotateY(180deg)":"none"}}>
              <Icons.BackIcon />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    <ScrollView className='flex-col flex-1 gap-4'>
      <ThemedText>{t('settings.personalInfo')}</ThemedText>
      <SettingOption className='p-6 my-6'>
        <View className='flex-1 flex-col'>
          <ThemedText className='opacity-50'>{t("getStarted.step2.fullname")}</ThemedText>
          <TextInput 
            value={username}
            onChangeText={setUsername} 
            className='text-foreground dark:text-foreground-dark border-b-inp p-2 pb-4 mb-6' 
            style={{borderBottomWidth: 1}}
          />
          <ThemedText className='opacity-50'>{t("getStarted.step2.age")}</ThemedText>
          <TextInput 
            value={userAge}
            onChangeText={setUserAge}
            keyboardType="numeric" 
            className='text-foreground dark:text-foreground-dark border-b-inp p-2 pb-4' 
            style={{borderBottomWidth: 1}}
          />
        </View>
      </SettingOption>
      <ThemedText>{t('settings.academicInfo')}</ThemedText>
      <SettingOption className='p-4 my-6'>
        <View className='flex-1 flex-col'>
        <SelectInput 
          translated = {false}
          translator='universities'
          label={i18n.t("getStarted.step3.university")} 
          options={data.univs.map((univ) => t(`${univ.shortName === "other"?'control':'universities'}.${univ.shortName.replace(/\s+/g, '')}`))} 
          placeholder={i18n.t("getStarted.step3.selectUniversity")} 
          onChange={(value) => {setSelectedUniv(t(value.split("common.")[1])); setUserUniv(value.split('.')[2])}}
          value={t(`universities.${userUniv}`)}
        />
        <SelectInput 
          translated = {false}
          translator='levels'
          label={i18n.t("getStarted.step3.currentLevel")} 
          options={data.levels.map((lvl) => t(`levels.${lvl.value}`))} 
          placeholder={i18n.t("getStarted.step3.currentLevel")} 
          onChange={(value) => {setSelectedLevel(t(value.split("common.")[1])); setUserLvl(value.split('.')[2])}}
          value={t(`levels.${userLvl}`)}
        />
          <SelectInput 
            translated = {false}
            translator='specialities'
            label={i18n.t("getStarted.step3.specialty")} 
            options={data.specialities.map((s) => t(`specialities.${s.value}`))} 
            placeholder={i18n.t("getStarted.step3.selectSpecialty")} 
            onChange={(value) => {setSelectedSpec(t(value.split("common.")[1])); setUserSpec(value.split('.')[2])}}
            value={t(`specialities.${userSpec}`)}
          />
          {selectedSpec === i18n.t("specialities.other") && (
            <TextInput
              onChange={(e) => setUserSpec(e.nativeEvent.text)}
              className='bg-input dark:bg-input-dark text-foreground dark:text-foreground-dark my-4'
              placeholder={i18n.t("getStarted.step3.enterSpecialty")}
              style={{
                borderWidth: 1,
                padding: 10,
                paddingLeft: 15,
                paddingRight: 15,
                borderRadius: 8,
                borderColor: "rgba(0,0,0,0.2)",
                fontSize: 16
              }}
              placeholderTextColor={ colorScheme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.5)" }
            />
          )}
        </View>
      </SettingOption>
    </ScrollView>
      
    </SafeAreaView>
  )
}

export default Profile