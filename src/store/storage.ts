import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  THEME: 'ag_theme',
} as const;

// ─── Theme ───────────────────────────────────────────────────────────────────

export async function getStoredTheme(): Promise<'light' | 'dark' | null> {
  try {
    const val = await AsyncStorage.getItem(KEYS.THEME);
    if (val === 'light' || val === 'dark') return val;
    return null;
  } catch {
    return null;
  }
}

export async function saveTheme(theme: 'light' | 'dark'): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.THEME, theme);
  } catch {
    // silently ignore
  }
}
