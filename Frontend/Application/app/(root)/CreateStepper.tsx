import ButtonPrimary from '@/components/buttons/ButtonPrimary'
import SelectInput from '@/components/inputs/SelectInput'
import { ThemedText } from '@/components/text/ThemedText'
import data from '@/constants/data'
import i18n from '@/i18n'
import { useEffect, useState } from 'react'
import { Dimensions, I18nManager, Pressable, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

import { ScrollView } from 'react-native'

import SettingOption from '@/components/containers/SettingOption'
import Icons from '@/constants/icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useColorScheme } from "nativewind"
import { useTranslation } from 'react-i18next'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import Module from '@/components/containers/Module'
import Unit from '@/components/containers/Unit'
import Images from '@/constants/images'
import uuid from 'react-native-uuid'

const { width } = Dimensions.get('window')

interface stepCount{
    step: number,
    total: number
}

const StepDots = ({ step, total }: stepCount) => (
  <View style={{flexDirection: "row", justifyContent: 'center', marginVertical: 32 }}>
    {Array.from({ length: total }).map((_, i) => (
      <View
        key={i}
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          marginHorizontal: 4,
        }}
        className={i == step ? 'bg-background-dark dark:bg-background' : 'bg-gray-300 dark:bg-gray-700'}
      />
    ))}
  </View>
)

const Step1 = ({setSpec, setUniv, setLvl}: any) => {
    const { colorScheme } = useColorScheme();
    const { t, i18n } = useTranslation();
    const [selectedSpec, setSelectedSpec] = useState(i18n.t("getStarted.step3.selectSpecialty"))
    const [selectedUniv, setSelectedUniv] = useState(i18n.t("getStarted.step3.selectUniversity"))
    const [selectedLvl, setSelectedLvl] = useState("l1")

    const univs = data.univs.map((univ) => t(`${univ.shortName === "other"?'control':'universities'}.${univ.shortName.replace(/\s+/g, '')}`))

    return(
        <>
          <ThemedText className='text-xl font-semibold font-Poppins-Medium'>{t("create.step2.title")}</ThemedText>
          <ThemedText className='text-sm opacity-40 my-2'>{t("create.step2.subtitle")}</ThemedText>
          <View className='flex-col mt-8'>
                  <SelectInput 
                    translated = {false}
                    translator='universities'
                    label={i18n.t("getStarted.step3.university")} 
                    options={univs} 
                    placeholder={i18n.t("getStarted.step3.selectUniversity")}
                    onChange={(value) => {setSelectedUniv(t(value.split("common.")[1])); setUniv(value.split('.')[2])}}
                    value={selectedUniv}
                  />
                  {selectedUniv === i18n.t('control.other') && (
                    <TextInput
                      onChange={(e) => setUniv(e.nativeEvent.text)}
                      className='bg-input dark:bg-input-dark text-foreground dark:text-foreground-dark mb-4'
                      placeholder={i18n.t("getStarted.step3.enterUniversity")}
                      style={{
                        borderWidth: 1,
                        padding: 10,
                        paddingLeft: 15,
                        paddingRight: 15,
                        borderRadius: 8,
                        borderColor: "rgba(0,0,0,0.2)",
                        fontSize: 12
                      }}
                      placeholderTextColor={ colorScheme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.5)" }
                    />
                  )}
                  <ThemedText className="mb-2 text-lg opacity-80">{i18n.t("control.level")}</ThemedText>
                  <View className="flex-row gap-4 max-w-[100%] flex-wrap mb-4">
                    {data.levels.map((item) => (
                      <Pressable
                        key={item.value}
                        onPress={() => {setSelectedLvl(item.value); setLvl(item.value)}}
                        className={`px-4 py-2 rounded-xl ${selectedLvl} border-inp
                          ${selectedLvl === item.value ? 'bg-secondary-100' : 'bg-input dark:bg-input-dark'}
                        `}
                        style={{
                          boxShadow: '0 4px 0.5px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <ThemedText className={selectedLvl === item.value ? 'text-white' : ''}>
                          {t(item.name)}
                        </ThemedText>
                      </Pressable>
                    ))}
                  </View>
                  <SelectInput 
                    translated = {false}
                    translator='specialities'
                    label={i18n.t("getStarted.step3.specialty")} 
                    options={data.specialities.map((s) => t(`specialities.${s.value}`))} 
                    placeholder={i18n.t("getStarted.step3.selectSpecialty")} 
                    onChange={(value) => { setSelectedSpec(t(value.split("common.")[1])); setSpec(value.split('.')[2])}}
                    value={selectedSpec}
                  />
                  {selectedSpec === 'other' && (
                    <TextInput
                      onChange={(e) => setSpec(e.nativeEvent.text)}
                      className='bg-input dark:bg-input-dark text-foreground dark:text-foreground-dark'
                      placeholder={i18n.t("getStarted.step3.enterSpecialty")}
                      style={{
                        borderWidth: 1,
                        padding: 10,
                        paddingLeft: 15,
                        paddingRight: 15,
                        borderRadius: 8,
                        borderColor: "rgba(0,0,0,0.2)",
                        fontSize: 12
                      }}
                      placeholderTextColor={ colorScheme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.5)" }
                    />
                  )}
                </View>
        </>
    );
}
const Step2 = ({setMode}:any) => {
  const { t, i18n } = useTranslation();
  const [selectedMode, setSelectedMode] = useState('');
  const { colorScheme } = useColorScheme();

  return(
      <>
        <ThemedText className='text-xl font-bold font-Poppins-Bold'>{t("create.step3.title")}</ThemedText>
        <SettingOption bg className={`mt-8 p-4 ${selectedMode==="single"?"bg-secondary-100":"bg-container dark:bg-container-dark"}`}  touchable onPress={()=> {setMode('single'); setSelectedMode('single')}}>
          <View className='flex-1 flex-row items-center justify-between'>
            <Text className={`text-lg ${selectedMode==="single"?"text-white":"text-foreground dark:text-foreground-dark"}`}>{t('create.step3.oneSemester')}</Text>
            <View className='items-center justify-center' style={{width: 25, transform: I18nManager.isRTL ? [] : [{ rotateY: "180deg" }] }}>
              {selectedMode==="single"?<Icons.ArrowIcon />:colorScheme === "dark" ?<Icons.ArrowIcon />: <Icons.ArrowDarkIcon />}
            </View>
          </View>
        </SettingOption>
        <SettingOption bg className={`mt-4 p-4 ${selectedMode==="dual"?"bg-secondary-100":"bg-container dark:bg-container-dark"}`}  touchable onPress={()=> {setMode('dual'); setSelectedMode('dual')}}>
          <View className='flex-1 flex-row items-center justify-between'>
            <Text className={`text-lg ${selectedMode==="dual"?"text-white":"text-foreground dark:text-foreground-dark"}`}>{t('create.step3.twoSemester')}</Text>
            <View className='items-center justify-center' style={{width: 25, transform: I18nManager.isRTL ? [] : [{ rotateY: "180deg" }] }}>
              {selectedMode==="dual"?<Icons.ArrowIcon />:colorScheme === "dark" ?<Icons.ArrowIcon />: <Icons.ArrowDarkIcon />}
            </View>
          </View>
        </SettingOption>
        <View className='self-center mt-24'>
          <Images.questionSvg />
        </View>
      </>
  )
}

interface step3Props {
  mode: string,
  type: string
}

interface moduleStruct {
    id: string,
    name: string,
    hasTd: boolean,
    hasTp: boolean,
    coeff: number,
  semester?: 's1' | 's2'
}

interface advancedModuleStruct {
    id: string,
    name: string,
    hasTd: boolean,
    hasTp: boolean,
    coeff: number,
    credit: number,
    weights: {
      exam: number,
      td: number,
      tp: number,
    }
    semester?: 's1' | 's2'
}

type unit = {
  title: string,
  modules: advancedModuleStruct[]
  semester?: 's1' | 's2'
  id?: string
}

const Step3 = ({mode, type}: step3Props) => {
  const { t, i18n } = useTranslation();
  const [selectedSem, setSelectedSem] = useState('s1');
  const { colorScheme } = useColorScheme();
  const [modules, setModules] = useState<moduleStruct[]>([]);
  const [units, setUnits] = useState<unit[]>([]);

  useEffect(() => {
    setUnits(prev => prev.map(u => u && u.id ? u : { ...(u || {}), id: uuid.v4().toString() }));
  }, []);

  const addModule = () => {
    const m: moduleStruct = {
      id: uuid.v4().toString(),
      name: '',
      hasTd: false,
      hasTp: false,
      coeff: 0,
      semester: selectedSem as 's1' | 's2'
    }
    setModules(prev => [...prev, m])
  }

  const updateModule = (updated: moduleStruct) => {
    setModules(prev => prev.map(m => m.id === updated.id ? updated : m))
  }

  const deleteModule = (deleted: moduleStruct) => {
    setModules(prev => prev.filter(m => m.id !== deleted.id))
  }

  const addUnit = () => {
    const u: unit = { id: uuid.v4().toString(), title: `Unit ${units.length + 1}`, modules: [], semester: selectedSem as 's1' | 's2' }
    setUnits(prev => [...prev, u])
  }

  const updateUnitModules = (id: string, mods: advancedModuleStruct[]) => {
    setUnits(prev => prev.map((u) => u.id === id ? { ...u, modules: mods } : u))
  }

  const deleteUnit = (id: string) => {
    setUnits(prev => prev.filter((u) => u.id !== id))
  }

  return(
      <>
        <View className='w-full mb-4 z-50'>
          {mode==="dual" && <SemesterSlider setSem = {(s:string) => {setSelectedSem(s)}} />}
        </View>
        {(mode==="single" || selectedSem === "s1") &&
          <ScrollView className='flex-1 flex-col' showsVerticalScrollIndicator={false}>
            {type==="simple" && modules.filter(m => m.semester === selectedSem).map(module => (
              <Module
                key={module.id}
                module={module}
                onChange={(m) => updateModule(m)}
                onDelete={(m) => deleteModule(m)}
              />
            ))}
            {type==="advanced" && units.filter(u => u && u.semester === selectedSem).map((unit, idx) => {
              const safeModules = Array.isArray(unit?.modules) ? unit.modules : [];
              const key = unit?.id ?? `unit-${idx}`;
              return (
                <Unit
                  key={key}
                  title={unit?.title}
                  initialModules={safeModules as any}
                  semester={unit?.semester}
                  onChange={(mods) => unit?.id && updateUnitModules(unit.id, mods as any)}
                  onDelete={(mods) => unit?.id && updateUnitModules(unit.id, mods as any)}
                  onRemove={() => unit?.id && deleteUnit(unit.id)}
                />
              )
            })}
            <View className='mt-4'>
              {type==="advanced"? <AddUnitButton onPress={addUnit} />: <AddModuleButton onPress={addModule} />}
            </View>
          </ScrollView>}
        {(mode==="dual" && selectedSem === "s2") &&
          <ScrollView className='flex-1 flex-col' showsVerticalScrollIndicator={false}>
            {type==="simple" && modules.filter(m => m.semester === selectedSem).map(module => (
              <Module
                key={module.id}
                module={module}
                onChange={(m) => updateModule(m)}
                onDelete={(m) => deleteModule(m)}
              />
            ))}
            {type==="advanced" && units.filter(u => u && u.semester === selectedSem).map((unit, idx) => {
              const safeModules = Array.isArray(unit?.modules) ? unit.modules : [];
              const key = unit?.id ?? `unit-${idx}`;
              return (
                <Unit
                  key={key}
                  title={unit?.title}
                  initialModules={safeModules as any}
                  semester={unit?.semester}
                  onChange={(mods) => unit?.id && updateUnitModules(unit.id, mods as any)}
                  onDelete={(mods) => unit?.id && updateUnitModules(unit.id, mods as any)}
                  onRemove={() => unit?.id && deleteUnit(unit.id)}
                />
              )
            })}
            <View className='mt-4'>
              {type==="advanced"? <AddUnitButton onPress={addUnit} />: <AddModuleButton onPress={addModule} />}
            </View>
          </ScrollView>}
      </>
  )
}
const Step4 = () => {
  const { t, i18n } = useTranslation();
  const [selectedMode, setSelectedMode] = useState('');
  const { colorScheme, setColorScheme  } = useColorScheme();

  return(
      <>
      </>
  )
}

export default function CreateStepper() {

  const [step, setStep] = useState(0)
  const translateX = useSharedValue(0)

  const isRTL = I18nManager.isRTL;

  const type = useLocalSearchParams().type;
  const [mode, setMode] = useState("");
  const [univ, setUniv] = useState("");
  const [lvl, setLvl] = useState("");
  const [spec, setSpec] = useState("");

  const steps = [
    <Step1 setLvl={setLvl} setSpec={setSpec} setUniv={setUniv} />,
    <Step2 setMode={setMode}/>,
    <Step3 mode={mode as string} type={type as string}/>,
    <Step4 />,
  ]

  const goToStep = (nextStep: number) => {
    setStep(nextStep)
    translateX.value = withTiming(isRTL ? (width * nextStep) : -(width * nextStep), { duration: 300 })
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  return (
    <SafeAreaView className='flex-1 py-8 bg-background dark:bg-background-dark'>
      <TouchableOpacity 
        className={`justify-center items-center p-2 rounded-full bg-black absolute ${I18nManager.isRTL?"right-4":"left-4"}`}
        activeOpacity={0.8}
        style={{
          bottom: insets.bottom + 32,
        }}
        onPress={()=> router.back()}
      >
        <View style={{ transform: !I18nManager.isRTL?"rotateY(180deg)":"none"}}>
          <Icons.BackIcon />
        </View>
      </TouchableOpacity>
      <Animated.View
        className="flex-row flex-1"
        style={[
          {
            width: width * steps.length,
          },
          animatedStyle,
        ]}
      >
        {steps.map((Step, index) => (
          <View key={index} style={{ width}} className='px-8 py-4 max-h-[100%]'>
            {Step}
          </View>
        ))}
      </Animated.View>

      <View className='flex-col items-center justify-center gap-4 px-8'>
        {step < steps.length - 1 ? (
            <ButtonPrimary 
              text={i18n.t('control.continue')} 
              h='h-12' 
              onPress={() => goToStep(step + 1)}
            />
        ) : (
          <ButtonPrimary 
              text={i18n.t('control.finish')} 
              h='h-12' 
              onPress={() => {
              }}
            />
        )}
        {step > 0 && (
          <TouchableOpacity onPress={() => goToStep(step - 1)}>
            <ThemedText className='font-Poppins-Bold'>{i18n.t("control.back")}</ThemedText>
          </TouchableOpacity>
        )}
      </View>
        <StepDots step={isRTL ? (steps.length - 1 - step) : step} total={steps.length} />
    </SafeAreaView>
  )
}

interface buttonProps{
  onPress?: ()=>void
}

const AddModuleButton = ({onPress}: buttonProps) => {
  const { t, i18n } = useTranslation();
  const { colorScheme } = useColorScheme();

  return(
    <TouchableOpacity onPress={onPress} activeOpacity={0.6} className='flex-row items-center justify-center p-3 border-dashed border-inp border-2 rounded-xl'>
      {colorScheme === "dark"?<Icons.AddRoundIcon />:<Icons.AddRoundDarkIcon/>}
      <ThemedText className='px-4 opacity-60 text-sm font-medium font-Poppins-Medium'>{t('apps.addModule')}</ThemedText>
    </TouchableOpacity>
  )
}

const AddUnitButton = ({onPress}: buttonProps) => {
  const { t, i18n } = useTranslation();

  return(
    <TouchableOpacity onPress={onPress} activeOpacity={0.6} className='flex-row items-center justify-center p-3 rounded-xl' style={{backgroundColor: 'rgba(241, 87, 88, 0.15)'}}>
      <Icons.AddUnitPrimary />
      <Text className='px-4 text-primary-100 text-sm font-medium font-Poppins-Medium'>{t('apps.addUnit')}</Text>
    </TouchableOpacity>
  )
}

const SemesterSlider = ({setSem}:any) => {
  const { t } = useTranslation();
  const [selectedSem, setSelectedSem] = useState<'s1' | 's2'>('s1');
  const translateX = useSharedValue(0);
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const H_PADDING = 6;
  const V_PADDING = 4;

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const segmentWidth =
    layout.width > 0
      ? (layout.width - H_PADDING * 2) / 2
      : 0;

      const isRTL = I18nManager.isRTL;

 const moveTo = (val: 's1' | 's2', animated = true) => {
  if (!segmentWidth) return;

  const logicalIndex = val === 's1' ? 0 : 1;
  const visualIndex = logicalIndex;

  let target = visualIndex * segmentWidth;

  if (isRTL) {
    target = -target;
  }

  if (animated) {
    translateX.value = withTiming(target, { duration: 250 });
  } else {
    translateX.value = target;
  }
};



  const handleSelectSem = (val: 's1' | 's2') => {
    setSelectedSem(val);
    moveTo(val);
  };

  useEffect(() => {
    moveTo(selectedSem, false);
  }, [segmentWidth]);

  return (
    <View
      className="w-full rounded-xl bg-inp"
      style={{ minHeight: 44 }}
      onLayout={(e) => setLayout(e.nativeEvent.layout)}
    >
      <View
        className='flex-1'
        style={{
          flexDirection: 'row',
          paddingHorizontal: H_PADDING,
          paddingVertical: V_PADDING,
        }}
      >
        {segmentWidth > 0 && (
          <Animated.View
            className="absolute bg-container dark:bg-container-dark rounded-xl"
            style={[
              {
                top: V_PADDING,
                left: H_PADDING,
                width: segmentWidth,
                height: layout.height - V_PADDING * 2,
              },
              sliderStyle,
            ]}
          />
        )}

        <TouchableOpacity
          className="flex-1 items-center justify-center py-3 z-10"
          onPress={() => {handleSelectSem('s1'); setSem("s1")}}
        >
          <ThemedText className="text-sm">
            {t('control.semester1')}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 items-center justify-center py-3 z-10"
          onPress={() => {handleSelectSem('s2'); setSem("s2")}}
        >
          <ThemedText className="text-sm">
            {t('control.semester2')}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};