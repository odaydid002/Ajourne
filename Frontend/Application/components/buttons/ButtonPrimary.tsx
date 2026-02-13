import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

interface para{
    text?: string,
    textSize?: string,
    w?: string,
    h?: string,
    className?: string,
    onPress?: () => void
}

const ButtonPrimary = ({
    text = "", 
    textSize = "text-lg", 
    w = "w-[100%]",
    h = "",
    className = "",
    onPress
} : para) => {
  return (
    <TouchableOpacity 
        activeOpacity={0.8}
        className={`bg-primary-100 ${w} ${h} justify-center items-center rounded-xl ${className}`}
        onPress={onPress}
    >
        <Text className={`text-white ${textSize}`}>{text}</Text>
    </TouchableOpacity>
  )
}

export default ButtonPrimary