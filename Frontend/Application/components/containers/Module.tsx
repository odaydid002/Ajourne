import { Checkbox } from 'expo-checkbox';
import { useColorScheme } from "nativewind";
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import uuid from 'react-native-uuid';
import { ThemedText } from '../text/ThemedText';

interface moduleStruct{
  id: string,
  name: string,
  hasTd: boolean,
  hasTp: boolean,
  coeff: number,
  semester?: 's1' | 's2'
}

interface moduleProps{
  module?: moduleStruct
  onChange?: (module: moduleStruct)=>void
  onDelete?: (module: moduleStruct)=>void
}

const Module = ({ module: initialModule, onChange, onDelete }: moduleProps) => {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();

  const [module, setModule] = useState<moduleStruct>(() => (
    initialModule ?? {
      id: uuid.v4().toString(),
      name: "",
      hasTd: false,
      hasTp: false,
      coeff: 0,
    }
  ));
  
  const [coeffText, setCoeffText] = useState(module.coeff === 0 ? '' : module.coeff.toString());

  const handleCoeffChange = (text: string) => {
    setCoeffText(text);
    const normalized = text.replace(',', '.');
    if (normalized === '' || normalized === '.' || normalized.endsWith('.')) return;
    const parsed = parseFloat(normalized);
    if (!isNaN(parsed)) {
      updateModule({ coeff: parsed });
    }
  };

  const handleCoeffBlur = () => {
    if (coeffText === '') {
      updateModule({ coeff: 0 });
      setCoeffText('');
      return;
    }
    const parsed = parseFloat(coeffText.replace(',', '.'));
    if (!isNaN(parsed)) {
      updateModule({ coeff: parsed });
      setCoeffText(parsed.toString());
    } else {
      setCoeffText('');
    }
  };

  const updateModule = (updates: Partial<moduleStruct>) => {
    const updated = { ...module, ...updates };
    setModule(updated);
    onChange?.(updated);
  };

  return (
    <View
      className="flex-col my-2 p-4 bg-container dark:bg-container-dark rounded-xl"
    >
      <View className="flex-row items-center justify-between gap-4">
        <View className="flex-col flex-1">
          <ThemedText className="text-sm opacity-60">
            {t("apps.moduleName")}
          </ThemedText>

          <TextInput
            value={module.name}
            onChangeText={(text) => updateModule({ name: text })}
            placeholder={t("apps.exemple")}
            className="text-foreground dark:text-foreground-dark border-inp"
            style={{ borderBottomWidth: 1 }}
            placeholderTextColor={colorScheme==="dark"?"rgba(255,255,255,0.4)":"rgba(51,51,51,0.4)"}
          />
        </View>

        <View className="flex-col w-[14%]">
          <ThemedText className="text-sm opacity-60 text-center">
            {t("apps.coeff")}
          </ThemedText>

          <TextInput
            value={coeffText}
            keyboardType="numeric"
            onChangeText={handleCoeffChange}
            onBlur={handleCoeffBlur}
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
            onValueChange={(value) => updateModule({ hasTd: value })}
            color={module.hasTd ? '#A3D289' : undefined}
          />
          <ThemedText className="text-sm">
            {t("apps.hasTd")}
          </ThemedText>
        </View>

        <View className="flex-row items-center gap-2">
          <Checkbox
            value={module.hasTp}
            onValueChange={(value) => updateModule({ hasTp: value })}
            color={module.hasTp ? '#A3D289' : undefined}
          />
          <ThemedText className="text-sm">
            {t("apps.hasTp")}
          </ThemedText>
        </View>
      </View>
      <TouchableOpacity activeOpacity={0.6} onPress={() => onDelete?.(module)}><Text className='text-red-500 text-sm text-center mt-4'>{t('apps.removeModule')}</Text></TouchableOpacity>
    </View>
  );
};


export default Module