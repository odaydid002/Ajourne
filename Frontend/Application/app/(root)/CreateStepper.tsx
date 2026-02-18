import ButtonPrimary from '@/components/buttons/ButtonPrimary'
import SelectInput from '@/components/inputs/SelectInput'
import { ThemedText } from '@/components/text/ThemedText'
import data from '@/constants/data'
import i18n from '@/i18n'
import { useEffect, useState } from 'react'
import { Dimensions, I18nManager, Pressable, Text, TextInput, TouchableOpacity, useWindowDimensions, View, Alert, ActivityIndicator } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { ScrollView } from 'react-native'

import SettingOption from '@/components/containers/SettingOption'
import Icons from '@/components/text/icons'
import { router, useLocalSearchParams } from 'expo-router'
import { useColorScheme } from "nativewind"
import { useTranslation } from 'react-i18next'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import CustomModal from '@/components/containers/CustomModal'
import Module from '@/components/containers/Module'
import Unit from '@/components/containers/Unit'
import Images from '@/constants/images'
import uuid from 'react-native-uuid'
import CalculatorModule from '@/components/containers/CalculatorModule'
import CalculatorUnit from '@/components/containers/CalculatorUnit'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { calculatorService } from '@/services/calculatorService'
import { saveCalculatorLocally, publishCalculator } from '@/services/calculatorTransactions'

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

const Step1 = ({setSpec, setUniv, setLvl, error, initialLvl}: any) => {
    const { colorScheme } = useColorScheme();
    const { t, i18n } = useTranslation();
    const [selectedSpec, setSelectedSpec] = useState(i18n.t("getStarted.step3.selectSpecialty"))
    const [selectedUniv, setSelectedUniv] = useState(i18n.t("getStarted.step3.selectUniversity"))
    const [selectedLvl, setSelectedLvl] = useState("")

    useEffect(() => {
      if (initialLvl) {
        setSelectedLvl(initialLvl)
        setLvl(initialLvl)
      }
    }, [initialLvl])

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
                  {error && <ThemedText className='text-xs mt-2' style={{color: '#f01e2c'}}>{error}</ThemedText>}
                </View>
        </>
    );
}
const Step2 = ({setMode, error}:any) => {
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
        <View className='self-center bottom-0 absolute '>
          <Images.questionSvg />
        </View>
        {error && <View className='mt-4'><ThemedText className='text-xs' style={{color: '#f01e2c'}}>{error}</ThemedText></View>}
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

const Step3 = ({mode, type, modules, setModules, units, setUnits, error}: any) => {
  const { t, i18n } = useTranslation();
  const [selectedSem, setSelectedSem] = useState('s1');
  const { colorScheme } = useColorScheme();

  useEffect(() => {
    // ensure units have ids
    setUnits((prev: any[]) => prev.map(u => u && u.id ? u : { ...(u || {}), id: uuid.v4().toString() }))
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
    setModules((prev: any[]) => [...prev, m])
  }

  const updateModule = (updated: moduleStruct) => {
    setModules((prev: any[]) => prev.map(m => m.id === updated.id ? updated : m))
  }

  const deleteModule = (deleted: moduleStruct) => {
    setModules((prev: any[]) => prev.filter(m => m.id !== deleted.id))
  }

  const addUnit = () => {
    const u: unit = { id: uuid.v4().toString(), title: `${t('apps.unit')}  ${units.length + 1}`, modules: [], semester: selectedSem as 's1' | 's2' }
    setUnits((prev: any[]) => [...prev, u])
  }

  const updateUnitModules = (id: string, mods: advancedModuleStruct[]) => {
    setUnits((prev: any[]) => prev.map((u: any) => u.id === id ? { ...u, modules: mods } : u))
  }

  const deleteUnit = (id: string) => {
    setUnits((prev: any[]) => prev.filter((u: any) => u.id !== id))
  }

  return(
      <>
        <View className='w-full mb-4 z-50'>
          {mode==="dual" && <SemesterSlider setSem = {(s:string) => {setSelectedSem(s)}} />}
        </View>
        {(mode==="single" || selectedSem === "s1") &&
          <ScrollView className='flex-1 flex-col' showsVerticalScrollIndicator={false}>
            {type==="simple" && modules.filter((m: any) => m.semester === selectedSem).map((module: any) => (
              <Module
                key={module.id}
                module={module}
                onChange={(m: any) => updateModule(m)}
                onDelete={(m: any) => deleteModule(m)}
              />
            ))}
            {type==="advanced" && units.filter((u: any) => u && u.semester === selectedSem).map((unit: any, idx: number) => {
              const safeModules = Array.isArray(unit?.modules) ? unit.modules : [];
              const key = unit?.id ?? `unit-${idx}`;
              return (
                <Unit
                  key={key}
                  title={unit?.title}
                  initialModules={safeModules as any}
                  semester={unit?.semester}
                  onChange={(mods: any) => unit?.id && updateUnitModules(unit.id, mods as any)}
                  onDelete={(mods: any) => unit?.id && updateUnitModules(unit.id, mods as any)}
                  onRemove={() => unit?.id && deleteUnit(unit.id)}
                />
              )
            })}
            <View className='mt-4'>
                {type==="advanced"? <AddUnitButton onPress={addUnit} />: <AddModuleButton onPress={addModule} />}
                {error && <ThemedText className='text-xs mt-2' style={{color: '#f01e2c'}}>{error}</ThemedText>}
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
const Step4 = ({modules, units, mode, type, setModules, setUnits, finishModal, setFinishModal, univ, lvl, spec}: any) => {
  const { t, i18n } = useTranslation();
  const { colorScheme, setColorScheme  } = useColorScheme();
  const [selectedSem, setSelectedSem] = useState<'s1' | 's2'>('s1')
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingLocal, setIsSavingLocal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [successType, setSuccessType] = useState<'save' | 'publish' | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const localParams = useLocalSearchParams() as any;

  useEffect(() => {
    // Reset success state when modal closes
    if (!finishModal) {
      setShowSuccess(false);
      setSuccessMessage('');
      setSuccessType(null);
    }
  }, [finishModal]);

  const computeModuleAvg = (m: any) => {
    if (typeof m.avg === 'number') return m.avg
    if (m.notes && m.weights) {
      const exam = m.notes.exam ?? 0
      const td = m.notes.td ?? 0
      const tp = m.notes.tp ?? 0
      return parseFloat((exam * (m.weights.exam ?? 0) + td * (m.weights.td ?? 0) + tp * (m.weights.tp ?? 0)).toFixed(2))
    }
    return 0
  }

  const computeSemesterAvgAdvanced = () => {
    const semUnits = units.filter((u: any) => (u.semester ?? 's1') === selectedSem)
    let totalWeight = 0
    let weightedSum = 0
    semUnits.forEach((u: any) => {
      const mods = Array.isArray(u.modules) ? u.modules : []
      const unitWeight = mods.reduce((s: number, m: any) => s + (m.credit ?? m.coeff ?? 0), 0)
      const unitAvg = unitWeight > 0 ? (mods.reduce((s: number, m: any) => s + computeModuleAvg(m) * (m.credit ?? m.coeff ?? 0), 0) / unitWeight) : 0
      totalWeight += unitWeight
      weightedSum += unitAvg * unitWeight
    })
    return totalWeight > 0 ? parseFloat((weightedSum / totalWeight).toFixed(2)) : 0
  }

  const computeSemesterAvgSimple = () => {
    const semMods = modules.filter((m: any) => (m.semester ?? 's1') === selectedSem)
    const totalCoeff = semMods.reduce((s: number, m: any) => s + (m.coeff ?? 0), 0)
    const weighted = semMods.reduce((s: number, m: any) => s + (computeModuleAvg(m) * (m.coeff ?? 0)), 0)
    return totalCoeff > 0 ? parseFloat((weighted / totalCoeff).toFixed(2)) : 0
  }

  const semesterAvg = type === 'advanced' ? computeSemesterAvgAdvanced() : computeSemesterAvgSimple()

  const handleModuleChange = (updated: any) => {
    setModules?.((prev: any[]) => prev.map(m => m.id === updated.id ? updated : m))
  }

  const handleUnitChange = (unitId: string, mods: any[]) => {
    setUnits?.((prev: any[]) => prev.map(u => u.id === unitId ? { ...u, modules: mods } : u))
  }

  const handlePublish = async () => {
    setIsPublishing(true);
    setShowSuccess(false);
    try {
      if (!title.trim()) {
        Alert.alert(i18n.t('control.error'), 'Please enter a title');
        setIsPublishing(false);
        return;
      }

      const deviceId = await AsyncStorage.getItem('device-id');
      if (!deviceId) {
        Alert.alert(i18n.t('control.error'), i18n.t('create.errors.noDevice') || 'Device ID not found');
        setIsPublishing(false);
        return;
      }

      const calculatorData = {
        id: uuid.v4().toString(),
        type,
        mode,
        title,
        description,
        univ,
        lvl,
        spec,
        modules,
        units,
      ];

      const result = await publishCalculator(calculatorData, deviceId);

      if (result.success) {
        setSuccessMessage(result.message);
        setSuccessType('publish');
        setShowSuccess(true);
        setTimeout(() => {
          setFinishModal(false);
          router.replace('/(root)/(tabs)/create');
        }, 2000);
      } else {
        Alert.alert(i18n.t('control.error'), result.message);
      }
    } catch (error) {
      Alert.alert(i18n.t('control.error'), i18n.t('create.errors.publishError') || 'An error occurred');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveLocal = async () => {
    setIsSavingLocal(true);
    setShowSuccess(false);
    try {
      const deviceId = await AsyncStorage.getItem('device-id');
      if (!deviceId) {
        Alert.alert(i18n.t('control.error'), i18n.t('create.errors.noDevice') || 'Device ID not found');
        setIsSavingLocal(false);
        return;
      }

      const calculatorData = {
        id: uuid.v4().toString(),
        type,
        mode,
        title,
        description,
        univ,
        lvl,
        spec,
        modules,
        units,
      };

      const success = await saveCalculatorLocally(calculatorData, deviceId);

      if (success) {
        setSuccessMessage(i18n.t('create.success.savedLocal') || 'Calculator saved to local database!');
        setSuccessType('save');
        setShowSuccess(true);
        setTimeout(() => {
          setFinishModal(false);
          router.replace('/(root)/(tabs)/create');
        }, 2000);
      } else {
        Alert.alert(i18n.t('control.error'), i18n.t('create.errors.saveFailed') || 'Failed to save calculator');
      }
    } catch (error) {
      Alert.alert(i18n.t('control.error'), i18n.t('create.errors.saveError') || 'An error occurred while saving');
    } finally {
      setIsSavingLocal(false);
    }
  };

  return(
      <>
        <View className='mb-4'>
          <SemesterSlider setSem={(s:string)=> setSelectedSem(s as 's1'|'s2')} />
          <View className='flex-row items-center justify-between mt-4 px-2'>
            <ThemedText className='text-sm opacity-60'>{t('apps.average')}</ThemedText>
            <ThemedText className='text-lg font-Poppins-Bold'>{`${semesterAvg}/20`}</ThemedText>
          </View>
        </View>

        {type === 'simple' && (
          <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
            {modules.filter((m:any)=> (m.semester ?? 's1') === selectedSem).map((m: any) => (
              <CalculatorModule key={m.id} module={m} onChange={handleModuleChange} />
            ))}
          </ScrollView>
        )}

        {type === 'advanced' && (
          <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
            {units.filter((u:any)=> (u.semester ?? 's1') === selectedSem).map((u: any) => (
              <CalculatorUnit key={u.id} unit={u} onChange={(mods:any)=> handleUnitChange(u.id, mods)} />
            ))}
          </ScrollView>
        )}
        <CustomModal title={t("control.finish")} visible={finishModal} toggle={() => !isPublishing && !isSavingLocal && setFinishModal(false)}>
        <View className='flex-1 flex-col p-4'>
          {!showSuccess ? (
            <>
              <Images.finish />
              
              <ThemedText className='text-sm font-Poppins-Medium mt-4 mb-2'>{t('apps.title')}</ThemedText>
              <TextInput
                placeholder={t('apps.calculatorTitle') || 'Enter calculator title'}
                value={title}
                onChangeText={setTitle}
                className='bg-input dark:bg-input-dark text-foreground dark:text-foreground-dark mb-4'
                style={{
                  borderWidth: 1,
                  padding: 12,
                  borderRadius: 8,
                  borderColor: "rgba(0,0,0,0.2)",
                  fontSize: 14
                }}
                placeholderTextColor={colorScheme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.5)"}
              />

              <ThemedText className='text-sm font-Poppins-Medium mb-2'>{t('apps.description')} ({t('control.optional')})</ThemedText>
              <TextInput
                placeholder={t('apps.calculatorDescription') || 'Enter calculator description (optional)'}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                className='bg-input dark:bg-input-dark text-foreground dark:text-foreground-dark mb-4'
                style={{
                  borderWidth: 1,
                  padding: 12,
                  borderRadius: 8,
                  borderColor: "rgba(0,0,0,0.2)",
                  fontSize: 14,
                  textAlignVertical: 'top',
                }}
                placeholderTextColor={colorScheme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.5)"}
              />
              
              <ButtonPrimary 
                text={isPublishing ? i18n.t('control.publishing') || 'Publishing...' : i18n.t('control.publish')} 
                h='h-14' 
                onPress={handlePublish}
                disabled={isPublishing || isSavingLocal}
              />
              {isPublishing && (
                <View className='flex-row items-center justify-center mt-3'>
                  <ActivityIndicator size="small" color="#f15758" />
                  <ThemedText className='ml-2 text-sm'>{i18n.t('control.publishing') || 'Publishing...'}</ThemedText>
                </View>
              )}
              <TouchableOpacity 
                disabled={isSavingLocal || isPublishing}
                className="flex-row items-center mt-4 justify-center gap-4 py-2 rounded-xl h-14" 
                style={{backgroundColor: "rgba(255,85,85,0.15)", opacity: isSavingLocal || isPublishing ? 0.5 : 1}}>
                <Icons.SavePrimary />
                <Text 
                  onPress={handleSaveLocal}
                  className={`text-lg font-Poppins-Medium`}
                  style={{color: '#f15758'}}
                >
                  {isSavingLocal ? i18n.t('control.saving') || 'Saving...' : t('control.saveToLocal')}
                </Text>
              </TouchableOpacity>
              {isSavingLocal && (
                <View className='flex-row items-center justify-center mt-3'>
                  <ActivityIndicator size="small" color="#f15758" />
                  <ThemedText className='ml-2 text-sm'>{i18n.t('control.saving') || 'Saving...'}</ThemedText>
                </View>
              )}
            </>
          ) : (
            <View className='flex-1 flex-col items-center justify-center py-8'>
              <View className='mb-6'>
                <Text style={{fontSize: 48}}>✓</Text>
              </View>
              <ThemedText className='text-xl font-Poppins-Bold text-center mb-3'>
                {i18n.t('control.success')}
              </ThemedText>
              <ThemedText className='text-sm text-center opacity-70 px-4'>
                {successMessage}
              </ThemedText>
            </View>
          )}
        </View>
      </CustomModal>
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
  const [units, setCalculatorUnits] = useState([]);
  const [modules, setCalculatorModules] = useState([]);
  const [stepErrors, setStepErrors] = useState<{[k:number]: string}>({});
  const [deviceId, setDeviceId] = useState('');
  const [publisherId, setPublisherId] = useState(null);
  const [finishModalOpen, setFinishModalOpen] = useState(false);

  const steps = [
    <Step1 setLvl={setLvl} setSpec={setSpec} setUniv={setUniv} error={stepErrors[0]} />,
    <Step2 setMode={setMode} error={stepErrors[1]}/> ,
    <Step3 mode={mode as string} type={type as string} modules={modules} setModules={setCalculatorModules} units={units} setUnits={setCalculatorUnits} error={stepErrors[2]} /> ,
    <Step4 modules={modules} units={units} mode={mode} type={type} setModules={setCalculatorModules} setUnits={setCalculatorUnits} finishModal = {finishModalOpen} setFinishModal = {setFinishModalOpen} univ={univ} lvl={lvl} spec={spec}/>,
  ]

  const goToStep = (nextStep: number) => {
    setStep(nextStep)
    translateX.value = withTiming(isRTL ? (width * nextStep) : -(width * nextStep), { duration: 300 })
  }

  const validateCurrentStep = (current: number) => {
    const errors: {[k:number]: string} = {}
    if (current === 0) {
      if (!univ || !lvl || !spec) errors[0] = i18n.t('create.errors.step1')
    }
    if (current === 1) {
      if (!mode) errors[1] = i18n.t('create.errors.step2')
    }
    if (current === 2) {
      if (type === 'simple') {
        if (!modules || modules.filter((m:any)=>m).length === 0) errors[2] = i18n.t('create.errors.step3_simple') || 'Add at least one module'
        else if (modules.some((m:any)=>!(m.name && (m.coeff>0)))) errors[2] = i18n.t('create.errors.step3_module') || 'Modules must have a name and a positive coeff'
      } else {
        if (!units || units.length === 0) errors[2] = i18n.t('create.errors.step3_advanced')
        else if (units.some((u:any)=>!u.modules || u.modules.length===0)) errors[2] = i18n.t('create.errors.step3_unit')
      }
    }
    setStepErrors(errors)
    return !errors[current]
  }

  const handleContinue = () => {
    if (validateCurrentStep(step)) {
      goToStep(step + 1)
    }
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();

  return (
    <SafeAreaView className='flex-1 py-4 bg-background dark:bg-background-dark'>
      <TouchableOpacity 
        className={`justify-center items-center p-2 rounded-full bg-black absolute ${I18nManager.isRTL?"right-4":"left-4"}`}
        activeOpacity={0.8}
        style={{
          bottom: insets.bottom + 32,
        }}
        onPress={()=> router.replace('/(root)/(tabs)/create')}
      >
        <View style={{ transform: I18nManager.isRTL?"rotateY(180deg)":"none"}}>
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
          <View key={index} style={{ width}} className='px-4 py-4 max-h-[100%] relative flex-1'>
            {Step}
          </View>
        ))}
      </Animated.View>

      <View className='flex-col items-center justify-center gap-4 px-4'>
        {step < steps.length - 1 ? (
            <ButtonPrimary 
              text={i18n.t('control.continue')} 
              h='h-14' 
              onPress={handleContinue}
            />
        ) : (
          <ButtonPrimary 
              text={i18n.t('control.finish')} 
              h='h-12' 
              onPress={() => {
                setFinishModalOpen(true)
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