import { View, Text, useColorScheme, Image } from 'react-native'
import React from 'react'
import { useTranslation } from 'react-i18next';
import { ThemedText } from '../text/ThemedText';
import images from '@/constants/images';
import { colorScheme } from 'nativewind';
import Icons from '@/components/text/icons';

interface CalculatorAppProps {
  name: string;
  university: string;
  level: string;
  rate: number;
  mode?: string;
  annual?: boolean;
}

const CalculatorApp = ({name, university, level, rate, mode, annual}: CalculatorAppProps) => {
    const {t, i18n } = useTranslation();
    return (
    <View className='flex-row justify-between items-center bg-container dark:bg-container-dark rounded-xl p-4 w-full h-20'
        style={{boxShadow: '2px 4px 2px rgba(0, 0, 0, 0.1)'}}
    >
        <View className='flex-row gap-4 flex-1 items-center'>
            <View className='justify-center items-center flex-col rounded overflow-hidden' style={{width: 40, height: 40}}>
                <Image source={images[university.replace(/\s+/g, '') as keyof typeof images] || images.defaultUniv} className='w-full h-full' resizeMode='cover'/>
            </View>
            <View className='flex-col flex-1'>
                <ThemedText className='text-sm font-Poppins-Bold'>{i18n.exists(`specialities.${name}`) ? t(`specialities.${name}`) : name} - {i18n.exists(`levels.${level}`) ? t(`levels.${level}`) : level}</ThemedText>
                <ThemedText className='text-sm font-Poppins-Regular opacity-50'>{i18n.exists(`universities.${university}`) ? t(`universities.${university}`) : university}</ThemedText>
            </View>
        </View>
        <View className='flex-row items-center'>
            <ThemedText className='text-xs ml-1'>{rate}</ThemedText>
            <Icons.StarIcon width={20} height={20} opacity={0.8}/>
        </View>
    </View>
    )
}

export default CalculatorApp