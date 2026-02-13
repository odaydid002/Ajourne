import ButtonPrimary from '@/components/buttons/ButtonPrimary'
import SelectInput from '@/components/inputs/SelectInput'
import GirlSit from '@/components/svgs/GirlSit'
import { ThemedText } from '@/components/text/ThemedText'
import data from '@/constants/data'
import icons from '@/constants/icons'
import i18n from '@/i18n'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'
import { Dimensions, I18nManager, Image, NativeModules, Pressable, TextInput, TouchableOpacity, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { ScrollView } from 'react-native'

import { router } from 'expo-router'
import { useColorScheme } from "nativewind"
import Icons from '@/constants/icons'
import { useTranslation } from 'react-i18next'

const { width } = Dimensions.get('window')

interface stepCount{
    step: number,
    total: number
}

const StepDots = ({ step, total }: stepCount) => (
  <View style={{flexDirection: "row", justifyContent: 'center', marginVertical: 32 }}>
    {Array.from({ length: total }).map((_, i) => (
      <View
        key={i}
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          marginHorizontal: 4,
        }}
        className={i == step ? 'bg-background-dark dark:bg-background' : 'bg-gray-300 dark:bg-gray-700'}
      />
    ))}
  </View>
)

const Step1 = ({ setUsername, setUserAge }: any) => {
  const { colorScheme } = useColorScheme();
  return(
    <>
      <View className='flex-col gap-1 mb-8 mt-8'>
        <ThemedText className='text-3xl'>{i18n.t("getStarted.step2.title")}</ThemedText>
        <ThemedText className='text-lg opacity-30'>{i18n.t("getStarted.step2.help")}</ThemedText>
      </View>
      <View className='flex-col gap-1' style={{marginBottom: 16}}>
        <ThemedText className='opacity-80 text-lg'>{i18n.t('getStarted.step2.fullname')}</ThemedText>
        <TextInput
          onChange={(e) => setUsername(e.nativeEvent.text)}
          className='bg-input dark:bg-input-dark text-foreground dark:text-foreground-dark'
          placeholder={i18n.t('getStarted.step2.example1')} style={{
          borderWidth: 1,
          padding: 10,
          paddingLeft: 15,
          paddingRight: 15,
          borderRadius: 8,
          borderColor: "rgba(0,0,0,0.2)",
          fontSize: 16,
        }}
        placeholderTextColor={ colorScheme === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.5)" }
        />
      </View>
      <View className='flex-col gap-1' style={{marginBottom: 16}}>
        <ThemedText className='opacity-80 text-lg'>{i18n.t('getStarted.step2.age')}</ThemedText>
        <TextInput
          onChange={(e) => setUserAge(parseInt(e.nativeEvent.text))}
          className='bg-input dark:bg-input-dark text-foreground dark:text-foreground-dark'
          keyboardType='number-pad'
          placeholder={i18n.t('getStarted.step2.example2')} style={{
          borderWidth: 1,
          padding: 10,
          paddingLeft: 15,
          paddingRight: 15,
          borderRadius: 8,
          borderColor: "rgba(0,0,0,0.2)",
          fontSize: 16,
        }}
        placeholderTextColor={ colorScheme === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.5)" }
        />
      </View>
      <View className='self-center mt-auto'>
        <GirlSit />
      </View>
    </>
  );
}
const Step2 = ({ setUserUniversity, setUserSpeciality, setUserLevel }: any) => {
  const {t, i18n } = useTranslation();
  const { colorScheme } = useColorScheme();
  const univs = data.univs.map((univ) => t(`${univ.shortName === "other"?'control':'universities'}.${univ.shortName.replace(/\s+/g, '')}`))
  const [selected, setSelected] = useState('')
  const [selectedUniversity, setSelectedUniversity] = useState(i18n.t("getStarted.step3.selectUniversity"))
  const [selectedSpeciality, setSelectedSpeciality] = useState(i18n.t("getStarted.step3.selectSpecialty"))
  const [selectedLevel, setSelectedLevel] = useState(i18n.t("levels.l1"))
  return(
    <View className='flex-1 pt-8'>
      <View className='flex-col gap-1'>
        <View className='flex-row items-center justify-between'>
          <ThemedText className='text-3xl'>{i18n.t("getStarted.step3.title")}</ThemedText>
          {colorScheme === "dark" ? <Icons.GraduateIcon width={30} height={30} opacity={0.8}/> : <Icons.GraduateDarkIcon width={30} height={30} opacity={0.8}/>}
        </View>
        <ThemedText className='text-lg opacity-30'>{i18n.t("getStarted.step3.help")}</ThemedText>
      </View>
      <View className='flex-col mt-8'>
        <SelectInput 
          translated = {false}
          translator='universities'
          label={i18n.t("getStarted.step3.university")} 
          options={univs} 
          placeholder={i18n.t("getStarted.step3.selectUniversity")} 
          onChange={(value) => {setSelectedUniversity(t(value.split("common.")[1])); setUserUniversity(value.split('.')[2])}}
          value={selectedUniversity}
        />
        <ThemedText className="mb-2 text-lg opacity-80">{i18n.t("getStarted.step3.currentLevel")}</ThemedText>
        <View className="flex-row gap-4 max-w-[100%] flex-wrap mb-4">
          {data.levels.map((item) => (
            <Pressable
              key={item.value}
              onPress={() => {setSelectedLevel(item.value); setUserLevel(item.value)}}
              className={`px-4 py-2 rounded-xl ${selected !== item.value && "border"} border-inp
                ${selectedLevel === item.value ? 'bg-secondary-100' : 'bg-input dark:bg-input-dark'}
              `}
              style={{
                boxShadow: '0 4px 0.5px rgba(0, 0, 0, 0.1)',
              }}
            >
              <ThemedText className={selected === item.value ? 'text-white' : ''}>
                {t(item.name)}
              </ThemedText>
            </Pressable>
          ))}
        </View>
        <SelectInput 
          translated = {false}
          translator='specialities'
          label={i18n.t("getStarted.step3.specialty")} 
          options={data.specialities.map((s) => t(`specialities.${s.value}`))} 
          placeholder={i18n.t("getStarted.step3.selectSpecialty")} 
          onChange={(value) => { setSelectedSpeciality(t(value.split("common.")[1])); setUserSpeciality(value.split('.')[2])}}
          value={selectedSpeciality}
        />
        {selectedSpeciality === i18n.t("control.other") && (
          <TextInput
            onChange={(e) => setUserSpeciality(e.nativeEvent.text)}
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
    </View>
  );
}

export default function StartStepper() {

  const [step, setStep] = useState(0)
  const translateX = useSharedValue(0)

  const isRTL = I18nManager.isRTL;

  const [username, setUsername] = useState("Guest");
  const [userAge, setUserAge] = useState(-1);
  const [userUniversity, setUserUniversity] = useState("OTHER");
  const [userSpeciality, setUserSpeciality] = useState("OTHER");
  const [userLevel, setUserLevel] = useState("OTHER");

  const steps = [
    <Step1 setUsername={setUsername} setUserAge={setUserAge} />,
    <Step2 setUserUniversity={setUserUniversity} setUserSpeciality={setUserSpeciality} setUserLevel={setUserLevel} />,
  ]

  const goToStep = (nextStep: number) => {
    setStep(nextStep)
    translateX.value = withTiming(isRTL ? (width * nextStep) : -(width * nextStep), { duration: 300 })
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  return (
    <View className='flex-1 py-8 bg-background dark:bg-background-dark'>
      <Animated.View
        className="flex-row flex-1"
        style={[
          {
            width: width * steps.length,
          },
          animatedStyle,
        ]}
      >
        {steps.map((Step, index) => (
          <ScrollView key={index} style={{ width}} className='px-8 max-h-[100%]'>
            {Step}
          </ScrollView>
        ))}
      </Animated.View>


      <View className='flex-col items-center justify-center gap-4 px-8'>
        {step < steps.length - 1 ? (
            <ButtonPrimary 
              text={i18n.t('control.continue')} 
              h='h-12' 
              onPress={() => goToStep(step + 1)}
            />
        ) : (
          <ButtonPrimary 
              text={i18n.t('control.finish')} 
              h='h-12' 
              onPress={() => {
                AsyncStorage.setItem('username', username || 'Guest');
                AsyncStorage.setItem('user-age', userAge.toString() || '-1');
                AsyncStorage.setItem('user-university', userUniversity || 'OTHER');
                AsyncStorage.setItem('user-speciality', userSpeciality || 'OTHER');
                AsyncStorage.setItem('user-level', userLevel || 'OTHER');
                router.dismissAll();
                router.replace('/home');
              }}
            />
        )}
        {step > 0 && (
          <TouchableOpacity onPress={() => goToStep(step - 1)}>
            <ThemedText className='font-Poppins-Bold'>{i18n.t("control.back")}</ThemedText>
          </TouchableOpacity>
        )}
      </View>
        <StepDots step={isRTL ? (steps.length - 1 - step) : step} total={steps.length} />
    </View>
  )
}
