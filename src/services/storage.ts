import AsyncStorage from '@react-native-async-storage/async-storage';
import type { HistoryEntry } from '../types/api';

const KEYS = {
  SEEN_IDS: 'ag_seen_ids',
  HISTORY: 'ag_feed_history',
  THEME: 'ag_theme',
} as const;

const MAX_SEEN = 100;
const MAX_HISTORY = 20;

// ─── Seen IDs ────────────────────────────────────────────────────────────────

export async function getSeenIds(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.SEEN_IDS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function addSeenId(id: string): Promise<void> {
  try {
    const ids = await getSeenIds();
    if (!ids.includes(id)) {
      ids.push(id);
      await AsyncStorage.setItem(
        KEYS.SEEN_IDS,
        JSON.stringify(ids.slice(-MAX_SEEN)),
      );
    }
  } catch {
    // silently ignore storage errors
  }
}

export async function addSeenIds(ids: string[]): Promise<void> {
  try {
    const existing = await getSeenIds();
    const merged = Array.from(new Set([...existing, ...ids]));
    await AsyncStorage.setItem(
      KEYS.SEEN_IDS,
      JSON.stringify(merged.slice(-MAX_SEEN)),
    );
  } catch {
    // silently ignore
  }
}

// ─── History ─────────────────────────────────────────────────────────────────

export async function getFeedHistory(): Promise<HistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveInteraction(
  imageId: string,
  action: HistoryEntry['action'],
): Promise<void> {
  try {
    const history = await getFeedHistory();
    history.push({ id: imageId, action, timestamp: Date.now() });
    await AsyncStorage.setItem(
      KEYS.HISTORY,
      JSON.stringify(history.slice(-MAX_HISTORY)),
    );
  } catch {
    // silently ignore
  }
}

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

// ─── Clear all ───────────────────────────────────────────────────────────────

export async function clearAll(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([KEYS.SEEN_IDS, KEYS.HISTORY]);
  } catch {
    // silently ignore
  }
}
