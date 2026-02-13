import { Stack } from "expo-router";
import { StackScreen } from "react-native-screens";
import { useTranslation } from 'react-i18next'

export default function SettingsLayout() {

  const { t } = useTranslation();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: t("control.settings"), headerShown: false, }}
      />
      <Stack.Screen
        name="Lang"
        options={{ title: t("settings.lang"), headerShown: false, }}
      />
      <Stack.Screen
        name="Profile"
        options={{ title: t('settings.academicProfile'), headerShown: false, }}
      />
      <Stack.Screen
        name="Contact"
        options={{ title: t('settings.contactUs'), headerShown: false, }}
      />
    </Stack>
  );
}
