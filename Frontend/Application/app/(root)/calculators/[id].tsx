import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const Calculator = () => {

    const { id } = useLocalSearchParams()

    return (
    <View>
        <Text>Calculator</Text>
    </View>
    )
}

export default Calculator