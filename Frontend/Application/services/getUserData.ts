import AsyncStorage from "@react-native-async-storage/async-storage";

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


const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    console.log('All AsyncStorage data cleared!');
  } catch (e) {
    console.error('Failed to clear AsyncStorage:', e);
  }
};

export default { getUsername, getAge, getUniv, getLvl, getSpec, getLang, clearAllData};
