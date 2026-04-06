import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useStore } from '../store/useStore';
import type { TourismTypeFilter } from '../types';

const FILTERS: { label: string; value: TourismTypeFilter; emoji: string }[] = [
  { label: 'All', value: 'all', emoji: '🌍' },
  { label: 'Agro', value: 'agro', emoji: '🌾' },
  { label: 'Marine', value: 'marine', emoji: '🌊' },
  { label: 'History', value: 'history', emoji: '🏛️' },
  { label: 'Culture', value: 'culture', emoji: '🎭' },
];

export default function FilterTabs(): React.JSX.Element {
  const selectedType = useStore((s) => s.selectedType);
  const setSelectedType = useStore((s) => s.setSelectedType);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {FILTERS.map((f) => {
          const active = selectedType === f.value;
          return (
            <TouchableOpacity
              key={f.value}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => setSelectedType(f.value)}
              activeOpacity={0.75}
            >
              <Text style={styles.emoji}>{f.emoji}</Text>
              <Text style={[styles.label, active && styles.labelActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#0f0f1a',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1e1e30',
  },
  scroll: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: '#1e1e30',
    borderWidth: 1,
    borderColor: '#2a2a40',
  },
  tabActive: {
    backgroundColor: '#6C63FF',
    borderColor: '#6C63FF',
  },
  emoji: {
    fontSize: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#aaa',
  },
  labelActive: {
    color: '#fff',
  },
});
