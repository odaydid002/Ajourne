import { View, Pressable, Text, Image } from 'react-native'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { useTranslation } from "react-i18next";

import Icons from '@/constants/icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const {t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-row h-20 bg-black w-[95%] absolute rounded-[24px] overflow-hidden bottom-4 self-center px-4 items-center justify-between z-10"
    style={{
        marginBottom: insets.bottom,
      }}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index
        return (
          <Pressable
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            className={`flex-row items-center justify-center`}
            style={{
              flex: isFocused ? 2 : 1,
            }}
          >
            <View 
              className={`flex-row items-center justify-center`}
              style={{
                paddingHorizontal: isFocused ? 16 : 0,
                paddingVertical: isFocused ? 6 : 2,
                backgroundColor: isFocused ? '#5E5E5E' : 'transparent', 
                borderRadius: isFocused ? 9999 : 0,
            }}>

              {route.name.split('/')[0] === "home" && (isFocused?(<Icons.HomeFillIcon width={24} height={24} />):(<Icons.HomeIcon width={24} height={24} />))}
              {route.name.split('/')[0] === "apps" && (isFocused?(<Icons.AppsFillIcon width={24} height={24} />):(<Icons.AppsIcon width={24} height={24} />))}
              {route.name.split('/')[0] === "create" && (isFocused?(<Icons.CreateFillIcon width={24} height={24} />):(<Icons.CreateIcon width={24} height={24} />))}
              {route.name.split('/')[0] === "saved" && (isFocused?(<Icons.BookmarkFillIcon width={24} height={24} />):(<Icons.BookmarkIcon width={24} height={24} />))}
              {route.name.split('/')[0] === "settings" && (isFocused?(<Icons.SettingsFillIcon width={24} height={24} />):(<Icons.SettingsIcon width={24} height={24} />))}
              {isFocused && (
                <Text className="text-white text-sm font-bold font-Poppins-Bold mx-2">
                  {t(`control.${route.name.split('/')[0]}`)}
                </Text>
              )}
            </View>
          </Pressable>
        )
      })}
    </View>
  )
}
