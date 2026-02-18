import { View, Text, useWindowDimensions, ScrollView, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';
import { ThemedText } from '@/components/text/ThemedText';
import Icons from '@/components/text/icons';
import images from '@/constants/images';
import i18n from '@/i18n';

const Saved = () => {

  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [mostUsed, setMostUsed] = useState([
    { id: 1, name: 'CS', university: 'UABT',  level: "m1", rate: 4.5, mode: "dual", type: "simple"},
    { id: 2, name: 'DS', university: 'USTHB',  level: "l3", rate: 3.8, mode: "single", type: "simple"},
    { id: 3, name: 'SE', university: 'GHARDAIA',  level: "l2", rate: 4.2, mode: "single", type: "advanced"},
    { id: 4, name: 'CS', university: 'UABT',  level: "m1", rate: 4.5, mode: "dual", type: "simple"},
    { id: 5, name: 'DS', university: 'USTHB',  level: "l3", rate: 3.8, mode: "single", type: "simple"},
    { id: 6, name: 'SE', university: 'GHARDAIA',  level: "l2", rate: 4.2, mode: "single", type: "advanced"},
    { id: 7, name: 'CS', university: 'UABT',  level: "m1", rate: 4.5, mode: "dual", type: "simple"},
    { id: 8, name: 'DS', university: 'USTHB',  level: "l3", rate: 3.8, mode: "single", type: "simple"},
    { id: 9, name: 'SE', university: 'GHARDAIA',  level: "l2", rate: 4.2, mode: "single", type: "advanced"},
    { id: 10, name: 'CS', university: 'UABT',  level: "m1", rate: 4.5, mode: "dual", type: "simple"},
    { id: 11, name: 'DS', university: 'USTHB',  level: "l3", rate: 3.8, mode: "single", type: "simple"},
    { id: 12, name: 'SE', university: 'GHARDAIA',  level: "l2", rate: 4.2, mode: "single", type: "advanced"},
  ]);

  return (
    <>
      <SafeAreaView className='bg-background dark:bg-background-dark p-4'>
        <View className='flex-row justify-between w-full pb-4 mt-4'>
          <ThemedText className='text-2xl font-Poppins-Medium font-bold'>{t("control.saved")}</ThemedText>
          {colorScheme === "dark" ? <Icons.BookmarkIcon /> : (<Icons.BookmarkDarkIcon />)}
        </View>
        <ScrollView className='flex-col relative pb-8 px-2'
          style={{
            maxHeight: height - insets.bottom - insets.top - 100,
            borderWidth: 1,
            borderColor: 'transparent',
          }}
        >
            <View className="flex-col gap-4 mt-4 pb-20">
              {mostUsed.map((item, index) => (
                <TouchableOpacity
                  key={item.id}>
                    <View className='flex-row justify-between items-center bg-container dark:bg-container-dark rounded-xl p-4 w-full'
                        style={{boxShadow: '2px 4px 2px rgba(0, 0, 0, 0.1)'}}
                    >
                        <View className='flex-row gap-4 flex-1 items-center'>
                            <View className='justify-center items-center flex-col rounded overflow-hidden' style={{width: 40, height: 40}}>
                                <Image source={images[item.university.replace(/\s+/g, '') as keyof typeof images] || images.defaultUniv} className='w-full h-full' resizeMode='cover'/>
                            </View>
                            <View className='flex-col flex-1'>
                                <ThemedText className='text-sm font-Poppins-Bold'>{i18n.exists(`specialities.${item.name}`) ? t(`specialities.${item.name}`) : item.name} - {i18n.exists(`levels.${item.level}`) ? t(`levels.${item.level}`) : item.level}</ThemedText>
                                <ThemedText className='text-sm font-Poppins-Regular opacity-50'>{i18n.exists(`universities.${item.university}`) ? t(`universities.${item.university}`) : item.university}</ThemedText>
                            </View>
                        </View>
                        <TouchableOpacity className='flex-row items-center' style={{width: 30}}>
                          {colorScheme==="dark"? <Icons.TrashLightIcon />:<Icons.TrashLightDarkIcon />}
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
              ))}
            </View>
        </ScrollView>
      </SafeAreaView>
      <View className='bg-background dark:bg-background-dark flex-1 z-0' />
    </>
  )
}

export default Saved