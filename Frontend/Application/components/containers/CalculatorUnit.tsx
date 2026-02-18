import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemedText } from '../text/ThemedText'
import { useTranslation } from 'react-i18next'
import { useColorScheme } from 'nativewind'
import { TextInput } from 'react-native-paper'
import CalculatorModule from './CalculatorModule'

type moduleStruct = {
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
    },
    notes: {
        exam: number,
        td: number,
        tp: number
    }
    avg?: number
    semester?: 's1' | 's2'
}

const weightPct = (m: moduleStruct | undefined, key: 'exam'|'td'|'tp') => {
    const w = m?.weights && (m.weights as any)[key]
    if (typeof w === 'number') return Math.round(w * 100)
    // if no weights provided and no td/tp then exam is full 100%
    if (!m?.hasTd && !m?.hasTp) return key === 'exam' ? 100 : 0
    return 0
}

interface unitProps {
  unit: {
    modules?: moduleStruct[],
    title?: string,
    semester?: 's1' | 's2',
  }
  onChange?: (unitModules: moduleStruct[])=>void
  onDelete?: (unitModules: moduleStruct[])=>void
  onRemove?: ()=>void
}

const CalculatorUnit = ({unit, onChange}: unitProps) => {
    const { t } = useTranslation();
    const { colorScheme } = useColorScheme();
        const [unitAvg, setUnitAvg] = useState<number>(0);
        const [credit, setCredit] = useState<number>(0);
        const [unitModules, setUnitModules] = useState<moduleStruct[]>(unit?.modules ?? [])

        useEffect(() => {
            setUnitModules(unit?.modules ?? [])
        }, [unit?.modules])

        const getModuleAvg = (m: moduleStruct) => {
            if (typeof m.avg === 'number') return m.avg
            // fallback compute from notes & weights
            if (m.weights) {
                const exam = m.notes?.exam ?? 0
                const td = m.notes?.td ?? 0
                const tp = m.notes?.tp ?? 0
                return parseFloat((exam * (m.weights.exam ?? 0) + td * (m.weights.td ?? 0) + tp * (m.weights.tp ?? 0)).toFixed(2))
            }
            return 0
        }

        const computeUnitStats = (mods: moduleStruct[]) => {
            const totalWeight = mods.reduce((s, m) => s + (m.credit ?? m.coeff ?? 0), 0)
            const weighted = mods.reduce((s, m) => s + (getModuleAvg(m) * (m.credit ?? m.coeff ?? 0)), 0)
            const avg = totalWeight > 0 ? parseFloat((weighted / totalWeight).toFixed(2)) : 0
            const cred = mods.reduce((s, m) => s + (m.credit ?? m.coeff ?? 0), 0)
            setUnitAvg(avg)
            setCredit(cred)
            onChange?.(mods)
        }

        const handleModuleChange = (updated: moduleStruct) => {
            const next = unitModules.map(m => m.id === updated.id ? { ...m, ...updated } : m)
            setUnitModules(next)
            computeUnitStats(next)
        }

    return (
        <View
            className="flex-col gap-4 my-2 p-4 bg-container dark:bg-container-dark rounded-xl"
        >
            <ThemedText className='text-lg font-bold font-Poppins-Bold'>{unit?.title??t('apps.unit')}</ThemedText>
            <View className='flex-col gap-4'>
                {unitModules?.map(module => (
                    <View className="rounded-xl mx-[5px]" style={{borderWidth: 1, borderColor: 'rgba(50,50,50,0.15)'}} key={module.id}>
                        <CalculatorModule module={module} onChange={(m)=>handleModuleChange(m as moduleStruct)} />
                    </View>
                ))}
            </View>
            <View className='flex-row items-center gap-8'>
                <View className='flex-row items-center justify-between w-full'>
                    <ThemedText className='text-sm opacity-50'>{`${t('apps.unitAvg')} ${unitAvg}/20`}</ThemedText>
                    <ThemedText className='text-sm opacity-50'>{`${t('apps.credit')} ${credit}`}</ThemedText>
                </View>
            </View>
        </View>
    )
}

export default CalculatorUnit

const Module = (module?: moduleStruct) => {
    const { t } = useTranslation();
    const { colorScheme } = useColorScheme();

    const [avg, setAvg] = useState(0);

    return (
        <View className='flex-col p-3 rounded-xl' style={{borderWidth: 1, borderColor: 'rgba(50,50,50,0.15)'}}>
            <View className='flex-row items-center justify-between'>
                <ThemedText className='text-sm font-bold font-Poppins-Bold opacity-70'>{module?.name??t('apps.unknown')}</ThemedText>
                <View className='flex-row items-center gap-4'>
                    <View className='py-2 px-4 rounded-full bg-inp'>
                        <ThemedText className='text-sm'>{`${t('apps.coeff')} ${module?.coeff??0}`}</ThemedText>
                    </View>
                    <View className='py-2 px-4 rounded-full bg-inp'>
                        <ThemedText className='text-sm'>{`${t('apps.credit')} ${module?.credit??0}`}</ThemedText>
                    </View>
                </View>
            </View>
            <View className='flex-row px-2 gap-4 items-center w-full'>
                <View className='flex-col'>
                    <ThemedText className='text-sm font-Poppins-Regular'>{`${t('apps.exam')} (${weightPct(module,'exam')}%)`}</ThemedText>
                    <TextInput
                    activeUnderlineColor='#A3D289'
                    placeholder='0.00'
                    className="text-foreground dark:text-foreground-dark"
                    style={{ borderBottomWidth: 1, backgroundColor: "transparent", borderColor: "rgba(15,15,15,0.15)" }}
                    placeholderTextColor={colorScheme==="dark"?"rgba(255,255,255,0.4)":"rgba(51,51,51,0.4)"}
                    />
                </View>
                {module?.hasTd && <View className='flex-col'>
                    <ThemedText className='text-sm font-Poppins-Regular'>{`${t('apps.td')} (${weightPct(module,'td')}%)`}</ThemedText>
                    <TextInput
                    activeUnderlineColor='#A3D289'
                    placeholder='0.00'
                    className="text-foreground dark:text-foreground-dark"
                    style={{ borderBottomWidth: 1, backgroundColor: "transparent", borderColor: "rgba(15,15,15,0.15)" }}
                    placeholderTextColor={colorScheme==="dark"?"rgba(255,255,255,0.4)":"rgba(51,51,51,0.4)"}
                    />
                </View>}
                {module?.hasTp && <View className='flex-col'>
                    <ThemedText className='text-sm font-Poppins-Regular'>{`${t('apps.tp')} (${weightPct(module,'tp')}%)`}</ThemedText>
                    <TextInput
                    activeUnderlineColor='#A3D289'
                    placeholder='0.00'
                    className="text-foreground dark:text-foreground-dark"
                    style={{ borderBottomWidth: 1, backgroundColor: "transparent", borderColor: "rgba(15,15,15,0.15)" }}
                    placeholderTextColor={colorScheme==="dark"?"rgba(255,255,255,0.4)":"rgba(51,51,51,0.4)"}
                    />
                </View>}
                </View>
        
                <View className="flex-row items-center justify-between gap-4">
                <ThemedText className="text-sm opacity-50">{t('apps.total')}</ThemedText>
                <Text className='text-sm' style={{color:avg>=10?"#95bb72":"#f01e2c"}}> {`${avg.toFixed(2)}/20`}</Text>
                </View>
        </View>
    );
}