import { View, Text, I18nManager, NativeModules, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native'
import { Linking } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from 'nativewind';
import { ThemedText } from '@/components/text/ThemedText';
import Icons from '@/constants/icons';
import { router } from 'expo-router';
import { ReactNode, useState } from 'react';
import SettingOption from '@/components/containers/SettingOption';
import { Snackbar } from 'react-native-paper';

import * as Clipboard from 'expo-clipboard';

const copyToClipboard = async (text: string) => {
  await Clipboard.setStringAsync(text);
};

const Contact = () => {

  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  const openEmail = () => {
    const email = 'oulhadjoday@gmail.com';
    const subject = t('settings.mailSubject') as string;
    const body = t('settings.mailBody') as string;

    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.canOpenURL(url).then((supported) => {
        if (supported) {
        Linking.openURL(url);
        } else {
        alert(t("settings.mailNotFound"));
        }
    });
};

  const [fvisible, setFVisible] = useState(false);
  const [ivisible, setIVisible] = useState(false);
  const [lvisible, setLVisible] = useState(false);

  return (
    <SafeAreaView className='flex-1 p-6 bg-background dark:bg-background-dark'>
      <View className='flex-row items-center justify-between w-full pb-8 mb-8'>
        <View className='flex-row gap-4 items-center'>
            <ThemedText className='text-2xl font-Poppins-Medium font-bold'>{t("settings.contactUs")}</ThemedText>
            {colorScheme==="dark"?<Icons.ContactIcon />:<Icons.ContactDarkIcon />}
        </View>
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

    <ScrollView className='flex-1 flex-col'>
        <ThemedText className='opacity-50 text-base mb-6'>{t('settings.contactPara')}</ThemedText>
        <SettingOption touchable onPress={openEmail} className='my-4 px-6 py-4'>
            <View className='flex-row flex-1 items-center justify-between'>
                <View className='flex-row gap-4 flex-1 items-center'>
                    <View className='p-2 rounded-xl bg-inp'>{colorScheme==="dark"?<Icons.MailIcon />:<Icons.MailDarkIcon />}</View>
                    <View className='flex-col flex-1'>
                        <ThemedText className='text-sm opacity-30'>{t('settings.email')}</ThemedText>
                        <Text className={`text-lg font-Poppins-Medium ${colorScheme==="dark"?"text-white":"text-black"}`}>oulhadjoday@gmail.com</Text>
                    </View>
                </View>
                <View style={{ transform: I18nManager.isRTL?"rotateY(180deg)":"none"}}>
                    {colorScheme==="dark"?<Icons.SendFillIcon />:<Icons.SendFillDarkIcon />}
                </View>
            </View>
        </SettingOption>
        <SettingOption className='my-6 px-6 py-4'>
            <View className='flex-col gap-8 justify-center flex-1'>
                <TouchableOpacity activeOpacity={0.8} 
                    onPress={()=> {
                        copyToClipboard('https://web.facebook.com/oulhadjoday/');
                        setFVisible(true);
                    }} 
                    className='flex-row flex-1 items-center justify-between'
                    >
                    <View className='flex-row gap-4'>
                        <Icons.Facebook />
                        <View className='flex-col'>
                            <ThemedText className='text-sm opacity-30'>{t('settings.facebook')}</ThemedText>
                            <ThemedText className='text-sm'>@oulhadjoday</ThemedText>
                        </View>
                    </View>
                    <View style={{ transform: !I18nManager.isRTL?"rotateY(180deg)":"none"}}>
                        {colorScheme==="dark"?<Icons.CopyIcon />:<Icons.CopyDarkIcon />}
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} onPress={()=> {copyToClipboard('https://www.instagram.com/oudai_oulhadj/');setIVisible(true);}} className='flex-row flex-1 items-center justify-between'>
                    <View className='flex-row gap-4'>
                        <Icons.Instagram />
                        <View className='flex-col'>
                            <ThemedText className='text-sm opacity-30'>{t('settings.instagram')}</ThemedText>
                            <ThemedText className='text-sm'>@oudai_oulhadj</ThemedText>
                        </View>
                    </View>
                    <View style={{ transform: !I18nManager.isRTL?"rotateY(180deg)":"none"}}>
                        {colorScheme==="dark"?<Icons.CopyIcon />:<Icons.CopyDarkIcon />}
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} onPress={()=> {copyToClipboard('https://www.linkedin.com/in/oudai-oulhadj/');setLVisible(true);}} className='flex-row flex-1 items-center justify-between'>
                    <View className='flex-row gap-4'>
                        <Icons.LinkedIn />
                        <View className='flex-col'>
                            <ThemedText className='text-sm opacity-30'>{t('settings.linkedin')}</ThemedText>
                            <ThemedText className='text-sm'>in/oudai-oulhadj</ThemedText>
                        </View>
                    </View>
                    <View style={{ transform: !I18nManager.isRTL?"rotateY(180deg)":"none"}}>
                        {colorScheme==="dark"?<Icons.CopyIcon />:<Icons.CopyDarkIcon />}
                    </View>
                </TouchableOpacity>
            </View>
        </SettingOption>
    </ScrollView>
    <Snackbar
        visible={fvisible}
        onDismiss={() => setFVisible(false)}
        duration={3000}
        style={{marginBottom: height - 100}}
        className='self-center'
      >
        Facebook Link copied to clipboard
      </Snackbar>
    <Snackbar
        visible={ivisible}
        onDismiss={() => setIVisible(false)}
        style={{marginBottom: height - 100}}
        className='self-center'
        duration={3000}
      >
        Instagram Link copied to clipboard
      </Snackbar>
    <Snackbar
        visible={lvisible}
        onDismiss={() => setLVisible(false)}
        style={{marginBottom: height - 100}}
        className='self-center'
        duration={3000}
      >
        LinkedIn Link copied to clipboard
      </Snackbar>
      
    </SafeAreaView>
  )
}

export default Contact