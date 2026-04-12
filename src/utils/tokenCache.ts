import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const tokenCache = {
  async getToken(key: string) {
    try {
      if (Platform.OS !== 'web') {
        const item = await SecureStore.getItemAsync(key);
        return item;
      }
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      if (Platform.OS !== 'web') {
        return SecureStore.setItemAsync(key, value);
      }
    } catch (err) {
      return;
    }
  },
};
