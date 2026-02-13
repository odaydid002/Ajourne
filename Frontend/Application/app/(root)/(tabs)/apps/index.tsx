import CalculatorApp from '@/components/containers/CalculatorApp'
import data from '@/constants/data'
import Icons from '@/constants/icons'
import { useLocalSearchParams } from 'expo-router'
import { useColorScheme } from 'nativewind'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { Portal, Dialog, Button, Provider } from 'react-native-paper';
import ButtonPrimary from '@/components/buttons/ButtonPrimary'
import { ThemedText } from '@/components/text/ThemedText'

const SearchInput = ({ onClickFilter, selectedFilter, onFilterChange, ...props }: { selectedFilter: string; onFilterChange: (v: string) => void } & any) => {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();

  return (
    <View 
      className='flex-col w-full h-fit pb-4' 
      style={{ boxShadow: "0px 5px 4px rgba(0, 0, 0, 0.1)" }}
    >
      <View className='flex-row items-center gap-4 p-8 py-0'>
        <View className='flex-row items-center bg-input dark:bg-input-dark flex-1 rounded-xl' 
          style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}>
          <View className='mx-4'>
            {colorScheme === "dark" ? <Icons.SearchIcon/> : <Icons.SearchDarkIcon/>}
          </View>
          <TextInput 
            {...props}
            className='py-4 bg-transparent text-foreground dark:text-foreground-dark flex-1'
            placeholder={t('home.search')}
            placeholderTextColor={ colorScheme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.5)" }
          />
        </View>
        <TouchableOpacity activeOpacity={0.8} className='p-3 bg-input dark:bg-input-dark rounded-xl items-center justify-center' 
          style={{ boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)" }}
          onPress={() => onClickFilter()}
          >
            {colorScheme === "dark" ? <Icons.ConfigIcon/> : <Icons.ConfigDarkIcon/>}
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className='w-full mt-4' contentContainerClassName='flex-row gap-4 px-4 mt-2'>
        {data.filterOptions.map((option) => (
          <TouchableOpacity 
            key={option.value}
            activeOpacity={0.6}
            className={`rounded-full ${selectedFilter === option.value ? 'bg-secondary-100' : colorScheme === "dark" ? 'bg-input-dark' : 'bg-input'} items-center justify-center px-4`}
            onPress={() => onFilterChange(option.value)}
            style={{
              borderWidth: 1,
              borderColor: selectedFilter === option.value ? 'transparent' : colorScheme === "dark" ? '#333333' : '#e0e0e0',
              height: 28,
            }}
          >
            <Text className={`text-lg ${selectedFilter !== option.value ? 'text-foreground dark:text-foreground-dark' : 'text-white'}`}>{t(option.name)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const Home = () => {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const filter = useLocalSearchParams().filter;
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const [filterLevels, setFilterLevels] = useState<string[]>([])
  const [filterModeAnnual, setFilterModeAnnual] = useState<string[]>([])
  const [filterModes, setFilterModes] = useState<string[]>([])

  const sampleData = useMemo(() => {
    const specs = data.specialities;
    const lvls = data.levels;
    return data.univs.map((u, idx) => {
      const spec = specs[idx % specs.length].value;
      const lvl = lvls[idx % lvls.length].value;
      const uses = 100 + idx * 37;
      const rate = parseFloat((3.0 + (idx % 20) * 0.1).toFixed(1));
      return {
        id: idx + 1,
        name: spec,
        university: u.shortName,
        level: lvl,
        rate,
        type: idx % 2 === 0 ? 'simple' : 'advanced',
        mode: idx % 4 === 0 ? 'dual' : 'single',
        uses,
      };
    });
  }, []);

  useEffect(() => {
    if (filter) setSelectedFilter(filter as string);
  }, [filter]);

  const filteredData = sampleData.filter((app) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'popular') return app.uses > 700;
    if (selectedFilter === 'newest') return app.id > 6;
    if (selectedFilter === 'rate') return app.rate >= 4.0;
    if (selectedFilter === 'advanced') return app.mode === "advanced";
    if (selectedFilter === 'simple') return app.mode === "simple";
    return true;
  });

  return (
    <>
      <SafeAreaView className='flex-1 justify-start items-center pt-8 bg-background dark:bg-background-dark'>
        <SearchInput selectedFilter={selectedFilter} onFilterChange={setSelectedFilter} onClickFilter={() => setFilterModalOpen(true)}/>
        <View className='flex-1 w-full px-4 pb-24'>
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity className='z-0' activeOpacity={0.8} onPress={() => { /* navigate or open */ }} style={{ marginBottom: 12 }}>
                <CalculatorApp {...item} />
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingBottom: 32, paddingTop: 16 }}
          />
        </View>
      </SafeAreaView>
      <Portal>
        <Pressable 
          className={`${filterModalOpen?'flex': "hidden"}`}
          style={styles.fullScreenOverlay} 
          onPress={(e)=>{
            if(e.target === e.currentTarget) setFilterModalOpen(false);
          }}
        >
          <View 
            className='flex-col bg-container dark:bg-container-dark w-[95%] rounded-[25px] p-6 mt-auto z-50'
            style={{
              marginBottom: insets.bottom + 10,
            }}
          >
            <View className='flex-row items-center justify-between mb-4 border-inp pb-4' style={{ borderBottomWidth: 1 }}>
              <ThemedText className='text-xl font-Poppins-Bold font-bold'>{t('control.filters')}</ThemedText>
              <Pressable onPress={()=> setFilterModalOpen(false)}>
                {colorScheme === "dark"?(<Icons.XmarkIcon width={20} height={20} opacity={0.5}/>):(<Icons.XmarkDarkIcon width={20} height={20} opacity={0.5}/>)}
              </Pressable>
            </View>
            <ScrollView className='max-h-[50vh] my-4' showsVerticalScrollIndicator={false}>
              <ThemedText className='text-lg opacity-60'>{t('control.levels')}</ThemedText>
              <View className='flex-row justify-center flex-wrap p-2 gap-4 my-2'>
                  {data.levels.map((option) => (
                    <TouchableOpacity 
                      activeOpacity={0.8}
                      key={option.value}
                      className={`${filterLevels.includes(option.value)?"border-primary-100": "border-inp"} py-1 px-4 rounded-xl`}
                      style={{
                        borderWidth: 1,
                        backgroundColor: filterLevels.includes(option.value)?"rgba(241,87,88,0.3)":"transparent"
                      }}
                      onPressOut={()=>{
                        setFilterLevels(prev =>
                          prev.includes(option.value)
                            ? prev.filter(level => level !== option.value)
                            : [...prev, option.value]
                        );
                      }}
                    >
                      <Text 
                        className={`text-lg ${filterLevels.includes(option.value)?"text-primary-100":colorScheme!=="dark"?"text-foreground":"text-foreground-dark"}`}
                      >
                        {t(option.name)}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
              <ThemedText className='text-lg opacity-60 my-2'>{t('control.mode')}</ThemedText>
              <View className='flex-row p-2 gap-4 mb-4'>
                  <TouchableOpacity
                    onPressOut={()=>{
                      setFilterModes(prev =>
                          prev.includes("single")
                            ? prev.filter(mode => mode !== "single")
                            : [...prev, "single"]
                        );
                    }}
                    activeOpacity={0.8}
                    className={`max-w-[48%] flex-col rounded-xl p-4 ${filterModes.includes("single")?"border-secondary-100":"border-inp"}`}
                    style={{
                      borderWidth: 1
                    }}
                  >
                    <View className={`w-[35px] h-[35px] items-center justify-center p-2 rounded-xl ${filterModes.includes("single")?"bg-secondary-100":"bg-inp"}`}>
                      {filterModes.includes("single")?<Icons.PercentIcon width={15} height={15} />:colorScheme==="dark"?<Icons.PercentIcon width={15} height={15} />:<Icons.PercentDarkIcon width={15} height={15} />}
                    </View>
                    <ThemedText className='text-lg font-Poppins-Bold font-bold mt-2'>{t('control.single')}</ThemedText>
                    <ThemedText className='text-sm opacity-50'>{t("mode.single")}</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPressOut={()=>{
                      setFilterModes(prev =>
                          prev.includes("dual")
                            ? prev.filter(mode => mode !== "dual")
                            : [...prev, "dual"]
                        );
                    }}
                    activeOpacity={0.8}
                    className={`max-w-[48%] flex-col rounded-xl p-4 ${filterModes.includes("dual")?"border-secondary-100":"border-inp"}`}
                    style={{
                      borderWidth: 1
                    }}
                  >
                    <View className={`w-[35px] h-[35px] items-center justify-center p-2 rounded-xl ${filterModes.includes("dual")?"bg-secondary-100":"bg-inp"}`}>
                      {filterModes.includes("dual")?<Icons.PercentIcon width={15} height={15} />:colorScheme==="dark"?<Icons.PercentIcon width={15} height={15} />:<Icons.PercentDarkIcon width={15} height={15} />}
                    </View>
                    <ThemedText className='text-lg font-Poppins-Bold font-bold mt-2'>{t('control.dual')}</ThemedText>
                    <ThemedText className='text-sm opacity-50'>{t("mode.dual")}</ThemedText>
                  </TouchableOpacity>
              </View>
            </ScrollView>
            <View className='flex-col gap-4'>
                <TouchableOpacity 
                  activeOpacity={0.8} 
                  className='w-full items-center justify-center'
                  onPress={()=>{
                    setFilterLevels([]);
                    setFilterModes([]);
                    setTimeout(()=>setFilterModalOpen(false), 200)
                  }}
                >
                  <ThemedText className='text-lg font-Poppins-Bold font-bold'>{t('control.clearAll')}</ThemedText>
                </TouchableOpacity>
                <ButtonPrimary text={t("control.apply")} h="h-14" onPress={()=>setFilterModalOpen(false)}/>
            </View> 
          </View>
        </Pressable>
      </Portal>

    </>
  )
}

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


export default Home