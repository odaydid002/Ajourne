import React from "react";
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';

async function checkOnboarding() {
  const username = await AsyncStorage.getItem('username');
  if (username) {
    router.replace('/home');
  } else {
    router.replace('/GetStarted');
  }
}

export default function Index() {
  React.useEffect(() => {
    checkOnboarding();
  }, [])

  return null;
}