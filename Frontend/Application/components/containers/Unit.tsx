import Icons from '@/components/text/icons';
import { Checkbox } from 'expo-checkbox';
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import uuid from 'react-native-uuid';
import { ThemedText } from '../text/ThemedText';

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
    }
    semester?: 's1' | 's2'
}

interface unitProps {
  initialModules?: moduleStruct[]
  onChange?: (unitModules: moduleStruct[])=>void
  onDelete?: (unitModules: moduleStruct[])=>void
  onRemove?: ()=>void
  semester?: 's1' | 's2'
  title?: string
}

const Unit = ({ initialModules, onChange, onDelete, onRemove, semester, title }: unitProps) => {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();

  const [modules, setModules] = useState<moduleStruct[]>(() => initialModules ?? [])

  useEffect(() => {
    onChange?.(modules);
  }, [modules]);

  const handleAddModule = () => {
    const newModule: moduleStruct = {
      id: uuid.v4().toString(),
      name: "",
      hasTd: false,
      hasTp: false,
      coeff: 0,
      credit: 0,
      weights: {
        exam: 0,
        td: 0,
        tp: 0
      }
      ,semester: semester ?? 's1'
    };
    setModules([...modules, newModule]);
  };

  const handleUpdateModule = (id: string, updates: Partial<moduleStruct>) => {
    setModules(modules.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const handleDeleteModule = (id: string) => {
    const updated = modules.filter(m => m.id !== id);
    setModules(updated);
    onDelete?.(updated);
  };

  return (
    <View
      className="flex-col gap-4 my-2 p-4 bg-container dark:bg-container-dark rounded-xl"
    >
      <View className='flex-row items-center justify-between w-full'>
        <ThemedText className='text-sm'>{title}</ThemedText>
        {onRemove && (
          <TouchableOpacity onPress={onRemove} activeOpacity={0.7}>
            <Icons.TrashRedIcon />
          </TouchableOpacity>
        )}
      </View>
      {modules.map((module) => (
        <AdvancedModule 
          key={module.id} 
          module={module}
          onUpdate={(updates) => handleUpdateModule(module.id, updates)}
          onDelete={() => handleDeleteModule(module.id)}
        />
      ))}
      <AddModuleButton onPress={handleAddModule} />
    </View>
  )
}

export default Unit

interface buttonProps{
  onPress?: ()=>void
}

const AddModuleButton = ({onPress}: buttonProps) => {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();

  return(
    <TouchableOpacity onPress={onPress} activeOpacity={0.6} className='flex-row items-center justify-center p-3 border-dashed border-inp border-2 rounded-xl'>
      {colorScheme === "dark"?<Icons.AddRoundIcon />:<Icons.AddRoundDarkIcon/>}
      <ThemedText className='px-4 opacity-60 text-sm font-medium font-Poppins-Medium'>{t('apps.addModule')}</ThemedText>
    </TouchableOpacity>
  )
}

interface AdvancedModuleProps {
  module: moduleStruct;
  onUpdate: (updates: Partial<moduleStruct>) => void;
  onDelete: () => void;
}

const AdvancedModule = ({ module, onUpdate, onDelete }: AdvancedModuleProps) => {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();

  const [coeffText, setCoeffText] = useState(module.coeff === 0 ? '' : module.coeff.toString());
  const [creditText, setCreditText] = useState(module.credit === 0 ? '' : module.credit.toString());
  const [examText, setExamText] = useState(module.weights.exam === 0 ? '' : module.weights.exam.toString());
  const [tdText, setTdText] = useState(module.weights.td === 0 ? '' : module.weights.td.toString());
  const [tpText, setTpText] = useState(module.weights.tp === 0 ? '' : module.weights.tp.toString());

  const handleBlurNumber = (text: string, setter: (v: string) => void, callback: (v: number) => void, min = 0, max = Number.POSITIVE_INFINITY) => {
    if (text === '') {
      callback(0);
      setter('');
      return;
    }
    // Accept locale decimal separators
    const normalized = text.replace(',', '.');
    const parsed = parseFloat(normalized);
    if (!isNaN(parsed)) {
      const clamped = Math.max(min, Math.min(max, parsed));
      callback(clamped);
      setter(clamped.toString());
    } else {
      // keep what user typed but don't update model
      setter(text);
    }
  };

  return(
    <View className='flex-col p-4 rounded-xl' style={{borderWidth: 1, borderColor: "rgba(0,0,0,0.1)", backgroundColor: "rgba(100,100,100,0.1)"}}>
      <View className="flex-row items-center justify-between gap-4">
        <View className="flex-col flex-1">
          <ThemedText className="text-sm opacity-80">
            {t("apps.moduleName")}
          </ThemedText>

          <TextInput
            value={module.name}
            onChangeText={(text) => onUpdate({ name: text })}
            placeholder={t("apps.exemple")}
            className="text-foreground dark:text-foreground-dark border-inp"
            style={{ borderBottomWidth: 1 }}
            placeholderTextColor={colorScheme==="dark"?"rgba(255,255,255,0.4)":"rgba(51,51,51,0.4)"}
          />
        </View>

        <View className="flex-col w-[14%]">
          <ThemedText className="text-sm opacity-80 text-center">
            {t("apps.coeff")}
          </ThemedText>

          <TextInput
            value={coeffText}
            onChangeText={(text) => {
              setCoeffText(text);
              const normalized = text.replace(',', '.');
              if (normalized === '' || normalized === '.' || normalized.endsWith('.')) return;
              const parsed = parseFloat(normalized);
              if (!isNaN(parsed)) onUpdate({ coeff: parsed });
            }}
            onBlur={() => handleBlurNumber(coeffText, setCoeffText, (v) => onUpdate({ coeff: v }), 0)}
            keyboardType="numeric"
            placeholder="0"
            className="text-foreground dark:text-foreground-dark text-center border-inp"
            style={{ borderBottomWidth: 1 }}
            placeholderTextColor={colorScheme==="dark"?"rgba(255,255,255,0.4)":"rgba(51,51,51,0.4)"}
          />
        </View>
        <View className="flex-col w-[14%]">
          <ThemedText className="text-sm opacity-80 text-center">
            {t("apps.credit")}
          </ThemedText>

          <TextInput
            value={creditText}
            onChangeText={(text) => {
              setCreditText(text);
              const normalized = text.replace(',', '.');
              if (normalized === '' || normalized === '.' || normalized.endsWith('.')) return;
              const parsed = parseFloat(normalized);
              if (!isNaN(parsed)) onUpdate({ credit: parsed });
            }}
            onBlur={() => handleBlurNumber(creditText, setCreditText, (v) => onUpdate({ credit: v }), 0)}
            keyboardType="numeric"
            placeholder="0"
            className="text-foreground dark:text-foreground-dark text-center border-inp"
            style={{ borderBottomWidth: 1 }}
            placeholderTextColor={colorScheme==="dark"?"rgba(255,255,255,0.4)":"rgba(51,51,51,0.4)"}
          />
        </View>
      </View>
      <View className="flex-row gap-10 mt-4 items-center w-full">
        <View className="flex-row items-center gap-2">
          <Checkbox
            value={module.hasTd}
            onValueChange={(val) => onUpdate({ hasTd: val })}
            color={module.hasTd ? '#A3D289' : undefined}
          />
          <ThemedText className="text-sm">
            {t("apps.hasTd")}
          </ThemedText>
        </View>

        <View className="flex-row items-center gap-2">
          <Checkbox
            value={module.hasTp}
            onValueChange={(val) => onUpdate({ hasTp: val })}
            color={module.hasTp ? '#A3D289' : undefined}
          />
          <ThemedText className="text-sm">
            {t("apps.hasTp")}
          </ThemedText>
        </View>
      </View>
      <View className='flex-col mt-4 gap-4 w-full'>
        <ThemedText className='text-sm opacity-80'>{t('apps.evaluation')}</ThemedText>
        <View className='flex-row gap-8 items-center w-full'>
          <View className='flex-col w-[20%]'>
            <ThemedText className='text-sm text-center'>{t('apps.exam')}</ThemedText>
            <TextInput
              value={examText}
              onChangeText={(text) => {
                setExamText(text);
                const normalized = text.replace(',', '.');
                if (normalized === '' || normalized === '.' || normalized.endsWith('.')) return;
                const parsed = parseFloat(normalized);
                if (!isNaN(parsed)) onUpdate({ weights: { ...module.weights, exam: Math.max(0, Math.min(1, parsed)) } });
              }}
              onBlur={() => handleBlurNumber(examText, setExamText, (v) => onUpdate({ weights: { ...module.weights, exam: v } }), 0, 1)}
              keyboardType="numeric"
              placeholder="0"
              className="text-foreground dark:text-foreground-dark text-center border-inp"
              style={{ borderBottomWidth: 1 }}
              placeholderTextColor={colorScheme==="dark"?"rgba(255,255,255,0.4)":"rgba(51,51,51,0.4)"}
            />
          </View>
          {module.hasTd && <View className='flex-col w-[20%]'>
            <ThemedText className='text-sm text-center'>{t('apps.td')}</ThemedText>
            <TextInput
              value={tdText}
              onChangeText={(text) => {
                setTdText(text);
                const normalized = text.replace(',', '.');
                if (normalized === '' || normalized === '.' || normalized.endsWith('.')) return;
                const parsed = parseFloat(normalized);
                if (!isNaN(parsed)) onUpdate({ weights: { ...module.weights, td: Math.max(0, Math.min(1, parsed)) } });
              }}
              onBlur={() => handleBlurNumber(tdText, setTdText, (v) => onUpdate({ weights: { ...module.weights, td: v } }), 0, 1)}
              keyboardType="numeric"
              placeholder="0"
              className="text-foreground dark:text-foreground-dark text-center border-inp"
              style={{ borderBottomWidth: 1 }}
              placeholderTextColor={colorScheme==="dark"?"rgba(255,255,255,0.4)":"rgba(51,51,51,0.4)"}
            />
          </View>}
          {module.hasTp && <View className='flex-col w-[20%]'>
            <ThemedText className='text-sm text-center'>{t('apps.tp')}</ThemedText>
            <TextInput
              value={tpText}
              onChangeText={(text) => {
                setTpText(text);
                const normalized = text.replace(',', '.');
                if (normalized === '' || normalized === '.' || normalized.endsWith('.')) return;
                const parsed = parseFloat(normalized);
                if (!isNaN(parsed)) onUpdate({ weights: { ...module.weights, tp: Math.max(0, Math.min(1, parsed)) } });
              }}
              onBlur={() => handleBlurNumber(tpText, setTpText, (v) => onUpdate({ weights: { ...module.weights, tp: v } }), 0, 1)}
              keyboardType="numeric"
              placeholder="0"
              className="text-foreground dark:text-foreground-dark text-center border-inp"
              style={{ borderBottomWidth: 1 }}
              placeholderTextColor={colorScheme==="dark"?"rgba(255,255,255,0.4)":"rgba(51,51,51,0.4)"}
            />
          </View>}
        </View>
        <TouchableOpacity onPress={onDelete}>
          <Text className='text-sm text-center text-red-500'>{t('apps.removeModule')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}