import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native'
import React, { ReactNode, useState } from 'react'
import { Portal } from 'react-native-paper';
import { ThemedText } from '../text/ThemedText';
import Icons from '@/constants/icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';

interface props{
    toggle: () => void;
    visible: boolean;
    children?: ReactNode;
    title?: string;
}

const CustomModal = ({children, toggle, visible, title=""}:props) => {

    const { colorScheme } = useColorScheme();
    const insets = useSafeAreaInsets();
    const { t } = useTranslation();

    if (!visible) return null;

    return (
        <Portal>
            <Pressable 
                className='flex'
                style={styles.fullScreenOverlay} 
                onPress={(e)=>{
                if(e.target === e.currentTarget) {toggle()};
                }}
            >
                <View 
                    className='flex-col bg-container dark:bg-container-dark w-[95%] rounded-[25px] p-6 mt-auto z-50'
                    style={{
                        marginBottom: insets.bottom + 10,
                    }}
                >
                    <View className='flex-row items-center justify-between mb-4 border-inp pb-4' style={{ borderBottomWidth: 1 }}>
                        <ThemedText className='text-xl font-Poppins-Bold font-bold'>{title}</ThemedText>
                        <Pressable onPress={()=> toggle()}>
                            {colorScheme === "dark"?(<Icons.XmarkIcon width={20} height={20} opacity={0.5}/>):(<Icons.XmarkDarkIcon width={20} height={20} opacity={0.5}/>)}
                        </Pressable>
                    </View>
                    <ScrollView className='max-h-[50vh] my-4'>
                        {children}
                    </ScrollView>
            </View>
            </Pressable>
        </Portal>
    )
}

export default CustomModal

const styles = StyleSheet.create({
  fullScreenOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: { color: "#fff", fontSize: 24 },
});