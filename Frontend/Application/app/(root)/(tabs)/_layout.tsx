
import CustomTabBar from '@/components/CustomTabBar';
import { Tabs } from 'expo-router'
import React from 'react'
import { useTranslation } from "react-i18next";

const _layout = () => {
  const {t, i18n } = useTranslation();
  return (
      <Tabs tabBar={(props) => <CustomTabBar {...props} />}>
          <Tabs.Screen name='home/index' options={{title: t('control.home'), headerShown: false}}/>
          <Tabs.Screen name='apps/index' options={{title: t('control.apps'), headerShown: false}} />
          <Tabs.Screen name='create/index' options={{title: t('control.create'), headerShown: false}} />
          <Tabs.Screen name='saved/index' options={{title: t('control.saved'), headerShown: false}} />
          <Tabs.Screen name='settings' options={{title: t('control.settings'), headerShown: false}} />
      </Tabs>
  )
}

export default _layout