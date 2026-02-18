import { View, Text, useWindowDimensions, Image } from 'react-native'
import React from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';
import { ThemedText } from '@/components/text/ThemedText';
import Icons from '@/components/text/icons';
import SettingOption from '@/components/containers/SettingOption';
import { router } from 'expo-router';
import images from '@/constants/images';
import Images from '@/constants/images';

const Create = () => {

  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return (
    <>
      <SafeAreaView className='bg-background dark:bg-background-dark px-4 py-8 flex-1'>
        <ThemedText className='text-2xl font-Poppins-Medium font-bold'>{t("create.selectType")}</ThemedText>
        <SettingOption className='border-2 border-inp mt-8 mb-2 p-6' touchable onPress={()=>{router.push({pathname: '/CreateStepper', params: { type: 'simple' }})}}>
          <View className='flex-1 flex-col gap-2 py-2'>
            <Icons.CreateSimpleIcon />
            <ThemedText className='font-lg font-Poppins-Bold font-bold'>{t('create.simple.title')}</ThemedText>
            <ThemedText className='font-lg opacity-50'>{t('create.simple.features')}</ThemedText>
          </View>
        </SettingOption>
        <SettingOption className='border-2 border-inp mt-2 p-6' touchable onPress={()=>{router.push({pathname: '/CreateStepper', params: { type: 'advanced' }})}}>
          <View className='flex-1 flex-col gap-2 py-2'>
            <Icons.CreateAdvancedIcon />
            <ThemedText className='font-lg font-Poppins-Bold font-bold'>{t('create.advanced.title')}</ThemedText>
            <ThemedText className='font-lg opacity-50'>{t('create.advanced.features')}</ThemedText>
          </View>
        </SettingOption>
        <View className='self-center mt-12'>
          <Images.checkSvg />
        </View>
      </SafeAreaView>
    </>
  )
}

export default Create