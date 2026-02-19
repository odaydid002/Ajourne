import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ThemedText } from '../text/ThemedText'
import { useTranslation } from 'react-i18next'
import { useColorScheme } from 'nativewind'
import { TextInput } from 'react-native-paper'

interface moduleStruct{
  id: string,
  name: string,
  hasTd: boolean,
  hasTp: boolean,
  coeff: number,
  semester?: 's1' | 's2',
  weights?: {
    exam?: number,
    td?: number,
    tp?: number,
  },
  notes: {
    exam: number,
    td: number,
    tp: number,
  }
  avg?: number
}

interface moduleProps{
  module?: moduleStruct
  onChange?: (module: moduleStruct)=>void
}

interface notes {
  exam: number,
  td: number,
  tp: number
}

const examWeights = {
  t1: {
    exam: 1
  },
  t2: {
    exam: 0.6,
    td: 0.4,
  },
  t3: {
    exam: 0.6,
    tp: 0.4,
  },
  t4: {
    exam: 0.6,
    td: 0.2,
    tp: 0.2
  }
}

const updateAvg = (hasTd = false, hasTp= false, notes: notes, weights?: {exam?:number, td?:number, tp?:number}): number =>{
  // Prefer explicit weights when provided, otherwise fallback to defaults
  const examW = (typeof weights?.exam === 'number') ? weights!.exam : (!hasTd && !hasTp ? examWeights.t1.exam : (hasTd && !hasTp ? examWeights.t2.exam : ( !hasTd && hasTp ? examWeights.t3.exam : examWeights.t4.exam)));
  const tdW = (typeof weights?.td === 'number') ? weights!.td : (hasTd && !hasTp ? examWeights.t2.td : (hasTd && hasTp ? examWeights.t4.td : 0));
  const tpW = (typeof weights?.tp === 'number') ? weights!.tp : (!hasTd && hasTp ? examWeights.t3.tp : (hasTd && hasTp ? examWeights.t4.tp : 0));

  let total = 0;
  total += notes.exam * examW;
  if (hasTd) total += notes.td * tdW;
  if (hasTp) total += notes.tp * tpW;

  return parseFloat(total.toFixed(2));
}

const CalculatorModule = ({module, onChange}: moduleProps) => {

  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();

  const [avg, setAvg] = useState<number>(module?.avg ?? 0);
  const [notes, setNotes] = useState<notes>(module?.notes ?? { exam: 0, td: 0, tp: 0 });
  const [examError, setExamError] = useState(false)
  const [tdError, setTdError] = useState(false)
  const [tpError, setTpError] = useState(false)

  // Keep local state in sync with prop updates so switching semesters doesn't lose edits
  useEffect(() => {
    setNotes(module?.notes ?? { exam: 0, td: 0, tp: 0 });
    setAvg(module?.avg ?? 0);
  }, [module?.notes, module?.avg]);

  return (
    <View
      className="flex-col gap-8 my-2 p-4 bg-container dark:bg-container-dark rounded-xl">
        
      <View className="flex-row items-center justify-between gap-4">
        <View className="flex-col flex-1">
          <ThemedText className="font-Poppins-Bold font-bold opacity-80">
            {module?.name??t('apps.unknown')}
          </ThemedText>
        </View>
        <View className='p-2 rounded-full bg-inp'>
          <ThemedText className='text-sm'>{`${t('apps.coeff')} ${module?.coeff??0}`}</ThemedText>
        </View>
      </View>

      <View className='flex-row px-2 gap-4 items-center w-full'>
        <View className='flex-col'>
          <ThemedText className='text-sm font-Poppins-Regular'>{`${t('apps.exam')} (${Math.round(((module?.weights?.exam ?? (module?.hasTd || module?.hasTp ? 0 : 1)) * 100))}%)`}</ThemedText>
          <TextInput
            activeUnderlineColor='#A3D289'
            placeholder='0.00'
            className="text-foreground dark:text-foreground-dark"
            style={{ borderBottomWidth: 1, backgroundColor: "transparent", borderColor: "rgba(15,15,15,0.15)" }}
            placeholderTextColor={colorScheme==="dark"?"rgba(255,255,255,0.4)":"rgba(51,51,51,0.4)"}
            keyboardType='numeric'
            onChangeText={(text) => {
              let val = parseFloat(text.replace(',', '.'))
              if (Number.isNaN(val)) val = 0
              // clamp between 0 and 20
              const clamped = Math.max(0, Math.min(20, val))
              setExamError(val < 0 || val > 20)
              const newNotes = { ...notes, exam: clamped }
              setNotes(newNotes)
              const newAvg = updateAvg(!!module?.hasTd, !!module?.hasTp, newNotes, module?.weights)
              setAvg(newAvg)
              onChange?.({ ...(module as any), notes: newNotes, avg: newAvg })
            }}
          />
          {examError && <ThemedText className='text-xs' style={{color: '#f01e2c'}}>Value must be between 0 and 20</ThemedText>}
        </View>
        {module?.hasTd && <View className='flex-col'>
          <ThemedText className='text-sm font-Poppins-Regular'>{`${t('apps.td')} (${Math.round((module?.weights?.td ?? 0) * 100)}%)`}</ThemedText>
          <TextInput
            activeUnderlineColor='#A3D289'
            placeholder='0.00'
            className="text-foreground dark:text-foreground-dark"
            style={{ borderBottomWidth: 1, backgroundColor: "transparent", borderColor: "rgba(15,15,15,0.15)" }}
            placeholderTextColor={colorScheme==="dark"?"rgba(255,255,255,0.4)":"rgba(51,51,51,0.4)"}
            keyboardType='numeric'
            onChangeText={(text) => {
              let val = parseFloat(text.replace(',', '.'))
              if (Number.isNaN(val)) val = 0
              const clamped = Math.max(0, Math.min(20, val))
              setTdError(val < 0 || val > 20)
              const newNotes = { ...notes, td: clamped }
              setNotes(newNotes)
              const newAvg = updateAvg(!!module?.hasTd, !!module?.hasTp, newNotes, module?.weights)
              setAvg(newAvg)
              onChange?.({ ...(module as any), notes: newNotes, avg: newAvg })
            }}
          />
          {tdError && <ThemedText className='text-xs' style={{color: '#f01e2c'}}>Value must be between 0 and 20</ThemedText>}
        </View>}
        {module?.hasTp && <View className='flex-col'>
          <ThemedText className='text-sm font-Poppins-Regular'>{`${t('apps.tp')} (${Math.round((module?.weights?.tp ?? 0) * 100)}%)`}</ThemedText>
          <TextInput
            activeUnderlineColor='#A3D289'
            placeholder='0.00'
            className="text-foreground dark:text-foreground-dark"
            style={{ borderBottomWidth: 1, backgroundColor: "transparent", borderColor: "rgba(15,15,15,0.15)" }}
            placeholderTextColor={colorScheme==="dark"?"rgba(255,255,255,0.4)":"rgba(51,51,51,0.4)"}
            keyboardType='numeric'
            onChangeText={(text) => {
              let val = parseFloat(text.replace(',', '.'))
              if (Number.isNaN(val)) val = 0
              const clamped = Math.max(0, Math.min(20, val))
              setTpError(val < 0 || val > 20)
              const newNotes = { ...notes, tp: clamped }
              setNotes(newNotes)
              const newAvg = updateAvg(!!module?.hasTd, !!module?.hasTp, newNotes, module?.weights)
              setAvg(newAvg)
              onChange?.({ ...(module as any), notes: newNotes, avg: newAvg })
            }}
          />
          {tpError && <ThemedText className='text-xs' style={{color: '#f01e2c'}}>Value must be between 0 and 20</ThemedText>}
        </View>}
      </View>

      <View className="flex-row items-center justify-between gap-4">
        <ThemedText className="text-sm opacity-50">{t('apps.total')}</ThemedText>
        <Text className='text-sm' style={{color:avg>=10?"#95bb72":"#f01e2c"}}> {`${avg.toFixed(2)}/20`}</Text>
      </View>
    </View>
  )
}

export default CalculatorModule