import ButtonPrimary from "@/components/buttons/ButtonPrimary";
import ManSit from "@/components/svgs/ManSit";
import { Text, View, I18nManager, NativeModules, Button } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemedText } from "@/components/text/ThemedText";
import { router } from 'expo-router'

const GetStarted = () => {

  const { t, i18n } = useTranslation();

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 justify-center items-center p-[32px] bg-background dark:bg-background-dark">
        <View className="w-[100%] justify-center items-center">
          <ManSit />
        </View>
        <View className="flex-col gap-4 mt-8 mb-4">
          <ThemedText className="text-4xl">{i18n.t('getStarted.title')}</ThemedText>
          <ThemedText style={{ fontSize: 18, }}>
            {t('getStarted.features.allSpecialities')}.
            <Text className="text-lg text-secondary-100"> {t('getStarted.features.oneApp')}</Text>
          </ThemedText>
        </View>

        <ButtonPrimary
          text={t('control.getStarted')}
          h="h-12"
          className="mt-auto"
          onPress={() => router.push('/StartStepper')}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default GetStarted