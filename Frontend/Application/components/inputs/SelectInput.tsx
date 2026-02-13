import icons from "@/constants/icons";
import { useMemo, useState } from "react";
import { FlatList, Image, Modal, Pressable, Text, TextInput, View } from "react-native";
import { ThemedText } from "../text/ThemedText";
import { useColorScheme } from "nativewind";
import Icons from "@/constants/icons";
import { useTranslation } from "react-i18next";

interface SelectInputProps {
  label: string;
  placeholder: string;
  options: string[];
  value?: string;
  translator?: string;
  translated?: boolean;
  onChange: (value: string) => void;
}

function findKeyByValue(obj: any, value: string, path = ''): string | null {
  for (const key in obj) {
    const currentPath = path ? `${path}.${key}` : key;
    if (typeof obj[key] === 'object') {
      const found = findKeyByValue(obj[key], value, currentPath);
      if (found) return found;
    } else if (obj[key] === value) {
      return currentPath;
    }
  }
  return null;
}

export default function SelectInput({
  label,
  placeholder,
  options,
  value,
  translated = true,
  translator = "",
  onChange,
}: SelectInputProps) {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [options, searchText]);


  const { colorScheme } = useColorScheme();
  const {t, i18n } = useTranslation();

  return (
    <View className="mb-4">
      <ThemedText className="mb-2 text-lg opacity-80">{label}</ThemedText>

      <Pressable
        onPress={() => setOpen(true)}
        className="flex-row items-center justify-between rounded-xl border border-inp px-4 py-4 bg-input dark:bg-input-dark"
      >
        <Text className={`text-sm  opacity-80 text-foreground dark:text-foreground-dark`}>
          {value ?? placeholder}
        </Text>

        <Icons.SelectIcon width={18} height={18} opacity={0.5} fill={colorScheme === "dark" ? "#ffffff" : "#000000"} />

      </Pressable>

      <Modal transparent animationType="fade" visible={open}>
        <Pressable
          className="flex-1 justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          onPress={() => setOpen(false)}
        >
          <View className="mx-6 rounded-2xl max-h-[60%] bg-container dark:bg-container-dark">
            <View className="p-4 border-b border-inp">
              <TextInput
                placeholder={t("control.search")}
                value={searchText}
                onChangeText={setSearchText}
                className="border border-inp rounded-lg px-3 py-2 bg-input dark:bg-input-dark text-foreground dark:text-foreground-dark"
                placeholderTextColor={ colorScheme === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.5)" }
              />
            </View>
            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onChange(translated?item:findKeyByValue(i18n.getDataByLanguage('en'), item)??findKeyByValue(i18n.getDataByLanguage('ar'), item)??findKeyByValue(i18n.getDataByLanguage('fr'), item)??"OTHER");
                    setOpen(false);
                    setSearchText("");
                  }}
                  className="px-5 py-4"
                >
                  <ThemedText className="text-sl">{translated?t(`${translator}.${item}`):item}</ThemedText>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
