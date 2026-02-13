import { Text, TextProps } from "react-native";

export function ThemedText({ className, ...props }: TextProps & { className?: string }) {
  return (
    <Text
      {...props}
      ellipsizeMode="tail"
      className={`
        text-foreground dark:text-foreground-dark text-ellipsis overflow-hidden
        ${className || ''}
      `}
    />
  );
}
