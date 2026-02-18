import CalculatorApp from '@/components/containers/CalculatorApp';
import { ThemedText } from "@/components/text/ThemedText";
import { gradients } from "@/constants/gradient";
import Icons from '@/components/text/icons';
import images from '@/constants/images';
import { LinearGradient } from "expo-linear-gradient";
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { Image, ScrollView, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { useWindowDimensions } from 'react-native';

interface SuggestedItem {
  id: number;
  name: string;
  university: string;
  level: string;
  rate: number;
  uses: number;
  count: number;
}

const CreateApp = () =>{
  const {t, i18n } = useTranslation();
  const { colorScheme } = useColorScheme();
  return(
    <View className="flex-col w-[90%] h-fit self-center rounded-[20px] mt-8 mb-28 overflow-hidden z-10 border-2 border-transparent">
      <LinearGradient
        colors= {colorScheme === "dark" ? ["#2C2C2C", "#1A1A1A"] : ["#C1E59F", "#A3D289"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-6 gap-2"
      >
        <Text className="text-lg font-bold font-Poppins-Bold text-white">
          {t('home.cantFindSpecialty')}
        </Text>
        <Text className="text-lg opacity-60 text-white">
          {t('home.help')}
        </Text>
        <TouchableOpacity 
          className={`flex-row rounded-2xl max-w-[65%] p-4 gap-2 items-center ${colorScheme === "dark" ? "bg-input-dark" : "bg-white"}`}
          onPress={() => router.push('/create')}
        >
          <Icons.AddSecondaryIcon width={20} height={20} opacity={0.8}/>
          <Text className="text-sm font-bold font-Poppins-Bold text-secondary-100 ml-2">{t('home.createYourOwn')}</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const Suggested = ({name, university, level, rate, uses}: SuggestedItem) => {
  const {t, i18n } = useTranslation();
  const { colorScheme } = useColorScheme();

  let color = colorScheme === "dark" ? gradients.dark : gradients.green;
  
  return(
    <View 
      className='flex-col w-[260px] h-[190px] rounded-[30px] overflow-hidden'
      style={{
        boxShadow: '4px 8px 5px rgba(0, 0, 0, 0.1)'
      }}
      >
        <LinearGradient
          colors= {color}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="flex-1 p-8"
        >
          <View className='flex-row items-center justify-between'>
            <View className='bg-secondary-trans px-2 py-1 rounded-lg'>
              <Text className={`text-sm text-white dark:text-secondary-darker`}>{t(`levels.${level}`)}</Text>
            </View>
            <View className='justify-center items-center flex-col w-8 h-8 rounded overflow-hidden'>
              <Image source={images[university as keyof typeof images] || images.defaultUniv} className='w-full h-full' resizeMode='cover'/>
            </View>
          </View>
          <Text className='text-lg text-white font-Poppins-bold mt-2'>{i18n.exists(`specialities.${name}`) ? t(`specialities.${name}`) : name}</Text>
          <Text className='text-sm text-white font-Poppins-bold mt-2 opacity-50'>{i18n.exists(`universities.${university}`) ? t(`universities.${university}`) : university}</Text>
          <View className='flex-row items-center mt-auto justify-between'>
            <View className='flex-row items-center'>
              <Text className='text-xs ml-1 text-white'>{rate}</Text>
              <Icons.StarIcon width={20} height={20} opacity={0.8}/>
            </View>
            <View className='flex-row items-center'>
              <Icons.GroupIcon width={20} height={20} opacity={0.8}/>
              <Text className='text-xs ml-1 text-white'>{uses}</Text>
            </View>
          </View>
        </LinearGradient>
    </View>
  );
}

const SearchInput = ({...props}) => {
  
  const {t, i18n } = useTranslation();
  const { colorScheme } = useColorScheme();
  
  return(
    <TouchableOpacity activeOpacity={0.9} onPress={() => router.push("/apps")} {...props}>
      <View className='mx-4'>
        {colorScheme === "dark" ? <Icons.SearchIcon/> : <Icons.SearchDarkIcon/>}
      </View>
      <TextInput 
        readOnly
        className='py-4 bg-transparent text-foreground dark:text-foreground-dark flex-1'
        placeholder={t('home.search')}
        placeholderTextColor={ colorScheme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.5)" }
      />
      <View className='px-2 mr-2 border-l border-inp'>
        {colorScheme === "dark" ? <Icons.SettingsIcon width={20} height={20} opacity={0.5}/> : <Icons.SettingsDarkIcon width={20} height={20} opacity={0.5}/>}
      </View>
    </TouchableOpacity>
  );
}
const Home = () => {

  const { height, width } = useWindowDimensions();

  const {t, i18n } = useTranslation();
  const { colorScheme } = useColorScheme();

  const insets = useSafeAreaInsets();

  const [suggested, setSuggested] = useState([
    { id: 1, name: 'CS', university: 'UABT',  level: "m1", rate: 4.5, uses: 1205 },
    { id: 2, name: 'DS', university: 'USTHB',  level: "l3", rate: 3.8, uses: 500 },
    { id: 3, name: 'SE', university: 'GHARDAIA',  level: "l2", rate: 4.2, uses: 800 },
  ]);

  const [mostUsed, setMostUsed] = useState([
    { id: 1, name: 'CS', university: 'UABT',  level: "m1", rate: 4.5, mode: "dual", type: "simple"},
    { id: 2, name: 'DS', university: 'USTHB',  level: "l3", rate: 3.8, mode: "single", type: "simple"},
    { id: 3, name: 'SE', university: 'GHARDAIA',  level: "l2", rate: 4.2, mode: "single", type: "advanced"},
  ]);

  return (
    <>
      <ScrollView className='flex-col bg-background dark:bg-background-dark relative pb-8'
        style={{
          maxHeight: height - insets.bottom + insets.top,
          borderWidth: 1,
          borderColor: 'transparent',
        }}
      >
        <View className="absolute top-0 left-0 w-full h-[240px] rounded-bl-[60px] rounded-br-[60px] overflow-hidden z-0">
          <Image source={images.homeBG} className="w-full h-full" resizeMode='cover' />
        </View>
        <SafeAreaView>
          <SearchInput 
            className='flex-row items-center mt-[195px] self-center w-[82%] bg-input dark:bg-input-dark rounded-2xl'
            style={{
              boxShadow: '2px 5px 8px rgba(0, 0, 0, 0.1)',
            }}  
          />
            <View className='flex-row items-center px-8 mt-5'>
              <ThemedText className='text-lg font-Poppins-Bold font-bold mr-2'>{t('home.suggested')}</ThemedText>
              {colorScheme === "dark" ? <Icons.ThumbIcon width={25} height={25}/> : <Icons.ThumbDarkIcon width={25} height={25} opacity={0.5}/>}
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerClassName='px-4 gap-4 items-center'
              className='mt-4 flex-row w-full max-w-[100%] overflow-visible'>
              {suggested.map((item, index) => (
                <TouchableOpacity key={item.id} activeOpacity={0.8} onPress={() => {}}>
                  <Suggested {...item} count={index}/>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View className='flex-row items-center justify-between px-4 mt-5'>
              <View className='flex-row items-center'>
                <ThemedText className='text-lg font-Poppins-Bold font-bold mr-2'>{t('home.mostUsed')}</ThemedText>
                {colorScheme === "dark" ? <Icons.FireIcon width={25} height={25}/> : <Icons.FireDarkIcon width={25} height={25} opacity={0.5}/>}
              </View>
              <TouchableOpacity 
                onPress={() => {router.push({pathname: '/apps', params: { filter: 'popular' }})}}
              >
                <Text className='text-secondary-darker text-sm font-bold font-Poppins-Bold'>{t('control.viewAll')}</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-col gap-4 px-4 mt-4">
              {mostUsed.map((item, index) => (
                <TouchableHighlight 
                  key={item.id}>
                  <CalculatorApp {...item}/>
                </TouchableHighlight>
              ))}
            </View>
            <CreateApp />
        </SafeAreaView>
      </ScrollView>
      <View className='bg-background dark:bg-background-dark flex-1 z-0' />
    </>
  )
}

export default Home