import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from 'react-native-uuid'
import { clearDatabase } from '../database';

const getUsername = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('username');
}

const getAge = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('user-age');
}

const getUniv = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('user-university');
}

const getSpec = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('user-speciality');
}

const getLvl = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('user-level');
}

const getLang = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('user-language');
}

const getDeviceId = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('device-id');
}

const getPublisherId = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('publisher-id');
}

const clearAllData = async () => {
  try {
    await clearDatabase();
    await AsyncStorage.clear();
    AsyncStorage.setItem('device-id', uuid.v4().toString())
    console.log('All AsyncStorage and database data cleared!');
  } catch (e) {
    console.error('Failed to clear data:', e);
  }
};

export default { getUsername, getAge, getUniv, getLvl, getSpec, getLang, clearAllData, getDeviceId, getPublisherId };
