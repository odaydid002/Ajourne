import { Pressable, View, Text } from 'react-native';

interface RadioItemProps {
  label: string;
  value: string;
  selected: boolean;
  onPress: () => void;
}

export function RadioItem({
  label,
  selected,
  onPress,
}: RadioItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center mb-3"
    >
      <View
        className={`w-5 h-5 rounded-full border-2 mr-3
          ${selected ? 'border-primary' : 'border-gray-400'}
        `}
      >
        {selected && (
          <View className="w-3 h-3 rounded-full bg-primary m-auto" />
        )}
      </View>

      <Text>{label}</Text>
    </Pressable>
  );
}
