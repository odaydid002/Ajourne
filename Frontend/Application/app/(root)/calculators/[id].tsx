import { View, Text, TouchableOpacity, I18nManager, ScrollView, ActivityIndicator, Touchable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import Icons from '@/components/text/icons'
import { SafeAreaView } from 'react-native'
import { useTranslation } from 'react-i18next'
import { getCalculatorDetail } from '@/services/calculatorTransactions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated'
import CalculatorModule from '@/components/containers/CalculatorModule'
import CalculatorUnit from '@/components/containers/CalculatorUnit'
import { ThemedText } from '@/components/text/ThemedText'
import { useColorScheme } from 'nativewind'

interface Module {
  id: string;
  name: string;
  coeff: number;
  credit: number;
  has_td: boolean;
  has_tp: boolean;
  weight_exam?: number;
  weight_td?: number;
  weight_tp?: number;
}

interface Unit {
  id: string;
  title: string;
  modules: Module[];
}

interface Semester {
  id: string;
  name: string;
  units: Unit[];
  modules: Module[];
}

interface CalculatorData {
  id: string;
  title: string;
  description: string;
  type: string;
  speciality: string;
  level: string;
  university_name: string;
  ratings_count: number;
  ratings_avg: number;
}

const SemesterSlider = ({ setSem }: any) => {
  const { t } = useTranslation();
  const [selectedSem, setSelectedSem] = useState<'s1' | 's2'>('s1');
  const translateX = useSharedValue(0);
  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const { colorScheme } = useColorScheme();

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
          onPress={() => {
            handleSelectSem('s1');
            setSem('s1');
          }}
        >
          <ThemedText className="text-sm">
            {t('control.semester1')}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 items-center justify-center py-3 z-10"
          onPress={() => {
            handleSelectSem('s2');
            setSem('s2');
          }}
        >
          <ThemedText className="text-sm">
            {t('control.semester2')}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Calculator = () => {
  const { id } = useLocalSearchParams()
  const { t } = useTranslation()
  
  const [calculator, setCalculator] = useState<CalculatorData | null>(null)
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [isOnline, setIsOnline] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const [selectedSem, setSelectedSem] = useState<'s1' | 's2'>('s1')
  const [semesterAverages, setSemesterAverages] = useState<number[]>([])
  const [overallAverage, setOverallAverage] = useState(0)

  useEffect(() => {
    const fetchCalculator = async () => {
      try {
        if (!id) {
          setError('Invalid calculator ID')
          return
        }

        const savedDeviceId = await AsyncStorage.getItem('device-id')
        if (savedDeviceId) {
          setDeviceId(savedDeviceId)
        }

        const result = await getCalculatorDetail(id as string, savedDeviceId || '')
        
        if (!result) {
          setError(t('create.errors.notFound') || 'Calculator not found')
          return
        }

        setCalculator(result.calculator)
        setSemesters(result.semesters)
        setIsOnline(result.isOnline)

        calculateAverages(result.semesters)
      } catch (err) {
        console.error('Error fetching calculator:', err)
        setError(t('create.errors.loadFailed') || 'Failed to load calculator')
      } finally {
        setLoading(false)
      }
    }

    fetchCalculator()
  }, [id])

  const calculateAverages = (semesterData: Semester[]) => {
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

    const averages = semesterData.map((semester) => {
      const modules = semester.units && semester.units.length > 0
        ? semester.units.flatMap((unit) => unit.modules || [])
        : semester.modules || []

      if (semester.units && semester.units.length > 0) {
        let totalWeight = 0
        let weightedSum = 0
        semester.units.forEach((unit: any) => {
          const mods = Array.isArray(unit.modules) ? unit.modules : []
          const unitWeight = mods.reduce((s: number, m: any) => s + (m.credit ?? m.coeff ?? 0), 0)
          const unitAvg = unitWeight > 0 ? (mods.reduce((s: number, m: any) => s + computeModuleAvg(m) * (m.credit ?? m.coeff ?? 0), 0) / unitWeight) : 0
          totalWeight += unitWeight
          weightedSum += unitAvg * unitWeight
        })
        return totalWeight > 0 ? weightedSum / totalWeight : 0
      }

      const totalCoeff = modules.reduce((s: number, m: any) => s + (m.coeff ?? 0), 0)
      const weighted = modules.reduce((s: number, m: any) => s + (computeModuleAvg(m) * (m.coeff ?? 0)), 0)
      return totalCoeff > 0 ? weighted / totalCoeff : 0
    })

    setSemesterAverages(averages)

    if (averages.length === 2) {
      setOverallAverage((averages[0] + averages[1]) / 2)
    } else if (averages.length === 1) {
      setOverallAverage(averages[0])
    }
  }

  const handleBackPress = () => {
    router.back()
  }

  /**
   * Handle module changes from CalculatorModule/CalculatorUnit
   * Updates the selected semester and recalculates averages
   */
  const handleModuleChange = (unitIdx: number | null, updatedModules: Module[], targetSemName?: string) => {
    const semNameToUpdate = targetSemName ?? selectedSem
    const newSemesters = semesters.map((sem) => {
      // Only update the semester matching the provided semester name
      if (sem.name !== semNameToUpdate) return sem

      if (unitIdx !== null && sem.units) {
        return {
          ...sem,
          units: sem.units.map((unit, uIdx) =>
            uIdx === unitIdx
              ? { ...unit, modules: updatedModules }
              : unit
          )
        }
      } else {
        return { ...sem, modules: updatedModules }
      }
    })

    setSemesters(newSemesters)
    calculateAverages(newSemesters)
  }

  if (loading) {
    return (
      <View className='flex-1 flex-col items-center justify-center bg-background dark:bg-background-dark'>
        <ActivityIndicator size='large' color='#A3D289' />
        <Text className='mt-4 text-foreground dark:text-foreground-dark'>{t('control.loading')}</Text>
      </View>
    )
  }

  if (error || !calculator) {
    return (
      <SafeAreaView className='flex-1 flex-col bg-background dark:bg-background-dark'>
        <View className='flex-1 flex-col items-center justify-center px-6'>
          <Icons.XmarkIcon width={80} height={80} color='#E74C3C' />
          <Text className='mt-6 text-center text-xl font-semibold text-foreground dark:text-foreground-dark'>
            {t('create.errors.notFound') || 'Calculator Not Found'}
          </Text>
          <Text className='mt-2 text-center text-sm opacity-60 text-foreground dark:text-foreground-dark'>
            {error || 'The calculator you\'re looking for doesn\'t exist.'}
          </Text>
          <TouchableOpacity
            onPress={handleBackPress}
            className='mt-8 rounded-lg bg-button dark:bg-button-dark px-6 py-3'
          >
            <Text className='font-semibold text-white'>{t('control.back')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  const hasTwoSemesters = semesters.length === 2
  const currentSemesterIndex = semesters.findIndex(sem => sem.name === selectedSem)
  const currentAverage = semesterAverages[currentSemesterIndex] || 0

  const currentSemester = semesters[currentSemesterIndex]
  const semesterModules = (currentSemester?.modules || [])
  const semesterUnits = (currentSemester?.units || [])

  // Calculate earned credits based on grades
  // If semester average > 10, earn full 30 credits
  // Otherwise, sum credits from modules/units with grade > 10
  const getEarnedCredits = () => {
    if (currentAverage > 10) {
      return 30
    }
    
    // Sum credits from modules/units with grade > 10
    if (semesterUnits.length > 0) {
      return semesterUnits.reduce((sum: number, unit: any) => {
        const unitCredits = (unit.modules || []).reduce((s: number, m: any) => {
          const moduleAvg = typeof m.avg === 'number' ? m.avg : 0
          return s + (moduleAvg > 10 ? (m.credit ?? 0) : 0)
        }, 0)
        return sum + unitCredits
      }, 0)
    } else {
      return semesterModules.reduce((sum: number, m: any) => {
        const moduleAvg = typeof m.avg === 'number' ? m.avg : 0
        return sum + (moduleAvg > 10 ? (m.credit ?? 0) : 0)
      }, 0)
    }
  }

  const totalCredits = getEarnedCredits()

  // Determine status based on average (Success if >= 10, Fail otherwise)
  // For dual semester, decision is based on overall average
  const effectiveAverage = hasTwoSemesters ? overallAverage : currentAverage
  const status = effectiveAverage < 10 ? t('apps.failed') : t('apps.success')
  const statusColor = effectiveAverage >= 10 ? '#95bb72' : '#f01e2c'

  if (semesterModules && semesterModules.length > 0) {
  } else if (semesterUnits && semesterUnits.length > 0 && Array.isArray(semesterUnits[0].modules) && semesterUnits[0].modules.length > 0) {
  }

  return (
    <View className='flex-1 flex-col relative bg-background dark:bg-background-dark'>
      <View className='absolute w-full h-[250px] overflow-hidden rounded-b-[60px] z-10'>
        <LinearGradient
          className='flex-1 pt-12 px-6 flex-col'
          colors={["#A3D289", "#93B77F"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={handleBackPress}
              style={{
                transform: I18nManager.isRTL ? [{ rotate: '180deg' }] : [],
              }}
            >
              <Icons.BackIcon width={30} height={30} color='white' />
            </TouchableOpacity>
            <View className='flex-row items-center gap-4'>
              <TouchableOpacity>
                <Icons.StarSimpleIcon width={30} height={30} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Icons.BookmarkIcon width={30} height={30} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Icons.ShareIcon width={30} height={30} />
              </TouchableOpacity>
            </View>
          </View>

          <View className='flex-col items-center mt-6'>
            <Text className='text-2xl font-semibold text-white text-center'>{t(`levels.${calculator.level}`)}</Text>
            <Text className='text-xl text-white opacity-90'>{t(`specialities.${calculator.speciality}`)}</Text>
          </View>

          <View className='flex-row items-center justify-center gap-4 mt-4'>
            {!hasTwoSemesters && (
              <View className='flex-col items-center'>
                <View className='px-6 py-2 rounded-xl mt-2' style={{ backgroundColor: "rgba(250, 250, 250, 0.3)" }}>
                  <Text className='text-3xl font-bold text-white text-center'>
                    {currentAverage.toFixed(2)}
                  </Text>
                </View>
                <View className='flex-row items-center gap-3 mt-3'>
                  <View className='px-3 py-1 rounded-full opacity-70' style={{ backgroundColor: statusColor }}>
                    <Text className='text-xs font-semibold text-white'>{status}</Text>
                  </View>
                  <View className='px-3 py-1 rounded-full opacity-70' style={{ backgroundColor: "rgba(250, 250, 250, 0.2)" }}>
                    <Text className='text-xs font-semibold text-white'>{t('apps.credit')}: {totalCredits}</Text>
                  </View>
                </View>
              </View>
            )}

            {hasTwoSemesters && (
              <View className='flex-col items-center'>
                <Text className='text-xs opacity-80 text-white'>{t('apps.overall')}</Text>
                <View className='px-6 py-2 rounded-xl mt-2' style={{ backgroundColor: "rgba(250, 250, 250, 0.3)" }}>
                  <Text className='text-3xl font-bold text-white text-center'>
                    {overallAverage.toFixed(2)}
                  </Text>
                </View>
                <View className='flex-row items-center gap-3 mt-3'>
                  <View className='px-3 py-1 rounded-full opacity-70' style={{ backgroundColor: statusColor }}>
                    <Text className='text-xs font-semibold text-white'>{status}</Text>
                  </View>
                  <View className='px-3 py-1 rounded-full opacity-70' style={{ backgroundColor: "rgba(250, 250, 250, 0.2)" }}>
                    <Text className='text-xs font-semibold text-white'>Credit: {totalCredits}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </LinearGradient>
      </View>

      <SafeAreaView className='flex-1' style={{paddingTop: hasTwoSemesters?250:0}}>
        {hasTwoSemesters && (
          <View className='flex-col px-4 py-4 bg-background dark:bg-background-dark border-b border-gray-200 dark:border-gray-700'>
            <SemesterSlider setSem={(s: string) => setSelectedSem(s as 's1' | 's2')} />
            <View className='flex-row items-center justify-between mt-4 px-2'>
              <ThemedText className='text-sm opacity-60'>{t('apps.average')}</ThemedText>
              <ThemedText className='text-lg font-Poppins-Bold'>{`${currentAverage.toFixed(2)}/20`}</ThemedText>
            </View>
          </View>
        )}
        
        <ScrollView
          style={{ paddingTop: hasTwoSemesters?10:260 }}
          className='flex-1 px-4'
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View className='flex-col mb-[300px]'>

            {((calculator.type === 'advanced' && semesterUnits.length === 0) || (calculator.type !== 'advanced' && semesterModules.length === 0)) ? (
              <View className='py-8 px-4 bg-gray-100 dark:bg-gray-800 rounded-lg items-center'>
                <Text className='text-gray-600 dark:text-gray-400'>{t('control.noData')}</Text>
              </View>
            ) : (
              <View className='flex-col gap-3'>
                {calculator.type === 'advanced' ? (
                  semesterUnits.map((unit: any, unitIdx: number) => {
                    const safeModules = Array.isArray(unit?.modules) ? unit.modules : [];
                    const key = unit?.id ?? `unit-${unitIdx}`;
                    return (
                      <CalculatorUnit 
                        key={key} 
                        unit={unit} 
                        onChange={(updatedModules) => handleModuleChange(unitIdx, updatedModules, currentSemester?.name)} 
                      />
                    )
                  })
                ) : (
                  semesterModules.map((m: any) => (
                    <CalculatorModule 
                      key={m.id} 
                      module={m} 
                      onChange={(updatedModule) => {
                        const updated = semesterModules.map(mod => mod.id === updatedModule.id ? updatedModule : mod)
                        handleModuleChange(null, updated, currentSemester?.name)
                      }} 
                    />
                  ))
                )}
              </View>
            )}
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default Calculator