import { View, Text, TouchableOpacity, I18nManager, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import Icons from '@/components/text/icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { getCalculatorDetail } from '@/services/calculatorTransactions'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

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

const Calculator = () => {
  const { id } = useLocalSearchParams()
  const { t } = useTranslation()
  
  const [calculator, setCalculator] = useState<CalculatorData | null>(null)
  const [semesters, setSemesters] = useState<Semester[]>([])
  const [isOnline, setIsOnline] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const [currentSemesterIndex, setCurrentSemesterIndex] = useState(0)
  const [semesterAverages, setSemesterAverages] = useState<number[]>([])
  const [overallAverage, setOverallAverage] = useState(0)
  
  const sliderPosition = useSharedValue(0)

  // Fetch calculator data on mount
  useEffect(() => {
    const fetchCalculator = async () => {
      try {
        if (!id) {
          setError('Invalid calculator ID')
          return
        }

        // Get device ID
        const savedDeviceId = await AsyncStorage.getItem('device-id')
        if (savedDeviceId) {
          setDeviceId(savedDeviceId)
        }

        // Fetch calculator with fallback logic
        const result = await getCalculatorDetail(id as string, savedDeviceId || '')
        
        if (!result) {
          setError(t('create.errors.notFound') || 'Calculator not found')
          return
        }

        setCalculator(result.calculator)
        setSemesters(result.semesters)
        setIsOnline(result.isOnline)

        // Calculate averages
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

  /**
   * Calculate average for each semester and overall average
   * Formula: sum(module_grade * coeff) / sum(coeff)
   */
  const calculateAverages = (semesterData: Semester[]) => {
    const averages = semesterData.map((semester) => {
      let totalWeightedGrade = 0
      let totalCoeff = 0

      // Get all modules for this semester (from units or directly)
      const modules = semester.units && semester.units.length > 0
        ? semester.units.flatMap((unit) => unit.modules || [])
        : semester.modules || []

      modules.forEach((module: Module) => {
        // In a real app, you'd fetch grades from user input
        // For now, we'll use a placeholder
        const grade = 0 // User would input this
        const coeff = module.coeff || 1
        totalWeightedGrade += grade * coeff
        totalCoeff += coeff
      })

      return totalCoeff > 0 ? totalWeightedGrade / totalCoeff : 0
    })

    setSemesterAverages(averages)

    // Calculate overall average (if 2 semesters, average them; else use single)
    if (averages.length === 2) {
      setOverallAverage((averages[0] + averages[1]) / 2)
    } else if (averages.length === 1) {
      setOverallAverage(averages[0])
    }
  }

  const handleBackPress = () => {
    router.back()
  }

  // Show loading state
  if (loading) {
    return (
      <View className='flex-1 flex-col items-center justify-center bg-background dark:bg-background-dark'>
        <ActivityIndicator size='large' color='#A3D289' />
        <Text className='mt-4 text-foreground dark:text-foreground-dark'>{t('control.loading')}</Text>
      </View>
    )
  }

  // Show error state
  if (error || !calculator) {
    return (
      <SafeAreaView className='flex-1 flex-col bg-background dark:bg-background-dark'>
        <View className='flex-1 flex-col items-center justify-center px-6'>
          <Icons.ErrorIcon width={80} height={80} color='#E74C3C' />
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

  const currentSemester = semesters[currentSemesterIndex]
  const hasTwoSemesters = semesters.length === 2
  const currentAverage = semesterAverages[currentSemesterIndex] || 0

  // Get modules for current view
  const displayModules = currentSemester.units && currentSemester.units.length > 0
    ? currentSemester.units.flatMap((unit) => unit.modules || [])
    : currentSemester.modules || []

  return (
    <View className='flex-1 flex-col relative bg-background dark:bg-background-dark'>
      {/* Header */}
      <View className='absolute w-full h-[280px] overflow-hidden rounded-b-[60px] z-10'>
        <LinearGradient
          className='flex-1 pt-6 px-6 flex-col'
          colors={["#A3D289", "#93B77F"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Back button */}
          <TouchableOpacity
            onPress={handleBackPress}
            style={{
              transform: I18nManager.isRTL ? [{ rotate: '180deg' }] : [],
            }}
          >
            <Icons.BackIcon width={30} height={30} color='white' />
          </TouchableOpacity>

          {/* Title section */}
          <View className='flex-col items-center mt-4'>
            <Text className='text-2xl font-semibold text-white text-center'>{calculator.title}</Text>
            <Text className='text-sm text-white opacity-90 mt-2'>{calculator.university_name}</Text>
            <Text className='text-sm text-white opacity-90'>{calculator.level} - {calculator.speciality}</Text>
          </View>

          {/* Average display */}
          <View className='flex-row items-center justify-center gap-4 mt-6'>
            <View className='flex-col items-center'>
              <Text className='text-xs opacity-80 text-white'>{currentSemester.name.toUpperCase()}</Text>
              <View className='px-6 py-2 rounded-xl mt-2' style={{ backgroundColor: "rgba(250, 250, 250, 0.3)" }}>
                <Text className='text-3xl font-bold text-white text-center'>
                  {currentAverage.toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Overall average if 2 semesters */}
            {hasTwoSemesters && (
              <View className='flex-col items-center'>
                <Text className='text-xs opacity-80 text-white'>Overall</Text>
                <View className='px-6 py-2 rounded-xl mt-2' style={{ backgroundColor: "rgba(250, 250, 250, 0.3)" }}>
                  <Text className='text-3xl font-bold text-white text-center'>
                    {overallAverage.toFixed(2)}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {isOnline && (
            <View className='flex-row items-center justify-center mt-4'>
              <View className='w-2 h-2 rounded-full bg-green-300 mr-2' />
              <Text className='text-xs text-white opacity-80'>{t('control.online')}</Text>
            </View>
          )}
        </LinearGradient>
      </View>

      <SafeAreaView className='flex-1'>
        <ScrollView
          style={{ paddingTop: 280 }}
          className='flex-1 px-4'
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {/* Semester selector (slider) if 2 semesters */}
          {hasTwoSemesters && (
            <View className='flex-col mb-6'>
              <Text className='text-lg font-semibold mb-3 text-foreground dark:text-foreground-dark'>
                {t('create.step3.selectSemester') || 'Select Semester'}
              </Text>
              <View className='flex-row gap-3'>
                {semesters.map((sem, idx) => (
                  <TouchableOpacity
                    key={sem.id}
                    onPress={() => {
                      setCurrentSemesterIndex(idx)
                      sliderPosition.value = withSpring(idx)
                    }}
                    className={`flex-1 py-3 rounded-lg border-2 ${
                      currentSemesterIndex === idx
                        ? 'border-primary dark:border-primary-dark bg-primary bg-opacity-10 dark:bg-opacity-10'
                        : 'border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    <Text
                      className={`text-center font-semibold ${
                        currentSemesterIndex === idx
                          ? 'text-primary dark:text-primary-dark'
                          : 'text-foreground dark:text-foreground-dark'
                      }`}
                    >
                      {sem.name === 's1' ? 'Semester 1' : 'Semester 2'}
                    </Text>
                    <Text
                      className={`text-center text-sm ${
                        currentSemesterIndex === idx
                          ? 'text-primary dark:text-primary-dark'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      Avg: {semesterAverages[idx]?.toFixed(2) || '0.00'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Modules/Units section */}
          <View className='flex-col mb-8'>
            <Text className='text-lg font-semibold mb-4 text-foreground dark:text-foreground-dark'>
              {currentSemester.units && currentSemester.units.length > 0 ? 'Units' : 'Modules'}
            </Text>

            {displayModules.length === 0 ? (
              <View className='py-8 px-4 bg-gray-100 dark:bg-gray-800 rounded-lg items-center'>
                <Text className='text-gray-600 dark:text-gray-400'>{t('control.noData')}</Text>
              </View>
            ) : (
              <View className='flex-col gap-3'>
                {displayModules.map((module: Module) => (
                  <View
                    key={module.id}
                    className='flex-col bg-input dark:bg-input-dark rounded-lg p-4 border border-gray-200 dark:border-gray-700'
                  >
                    <View className='flex-row justify-between items-start'>
                      <View className='flex-1'>
                        <Text className='text-base font-semibold text-foreground dark:text-foreground-dark'>
                          {module.name}
                        </Text>
                        <View className='flex-row gap-2 mt-2'>
                          {module.coeff > 0 && (
                            <View className='px-2 py-1 rounded bg-blue-100 dark:bg-blue-900'>
                              <Text className='text-xs text-blue-700 dark:text-blue-300'>
                                Coeff: {module.coeff}
                              </Text>
                            </View>
                          )}
                          {module.credit > 0 && (
                            <View className='px-2 py-1 rounded bg-green-100 dark:bg-green-900'>
                              <Text className='text-xs text-green-700 dark:text-green-300'>
                                Credit: {module.credit}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                      <View className='ml-3'>
                        {module.has_td && (
                          <View className='px-2 py-1 rounded bg-purple-100 dark:bg-purple-900 mb-1'>
                            <Text className='text-xs text-purple-700 dark:text-purple-300'>TD</Text>
                          </View>
                        )}
                        {module.has_tp && (
                          <View className='px-2 py-1 rounded bg-orange-100 dark:bg-orange-900'>
                            <Text className='text-xs text-orange-700 dark:text-orange-300'>TP</Text>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Grade input placeholder */}
                    <View className='mt-4 flex-row items-center gap-2'>
                      <Text className='text-sm text-gray-600 dark:text-gray-400'>Grade:</Text>
                      <View className='flex-1 h-10 bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-600 items-center justify-center'>
                        <Text className='text-gray-400'>Input grade</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Info section */}
          <View className='flex-col bg-input dark:bg-input-dark rounded-lg p-4 mb-8 border border-gray-200 dark:border-gray-700'>
            <Text className='text-sm font-semibold text-foreground dark:text-foreground-dark mb-3'>
              {t('control.info')}
            </Text>
            {calculator.description && (
              <Text className='text-sm text-gray-700 dark:text-gray-300 mb-2'>{calculator.description}</Text>
            )}
            <View className='flex-row gap-4 mt-3'>
              {calculator.ratings_count > 0 && (
                <View className='flex-col'>
                  <Text className='text-xs text-gray-600 dark:text-gray-400'>Rating</Text>
                  <Text className='text-lg font-semibold text-foreground dark:text-foreground-dark'>
                    {calculator.ratings_avg.toFixed(1)} ⭐
                  </Text>
                </View>
              )}
              {calculator.usage_count > 0 && (
                <View className='flex-col'>
                  <Text className='text-xs text-gray-600 dark:text-gray-400'>Used</Text>
                  <Text className='text-lg font-semibold text-foreground dark:text-foreground-dark'>
                    {calculator.usage_count}x
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default Calculator