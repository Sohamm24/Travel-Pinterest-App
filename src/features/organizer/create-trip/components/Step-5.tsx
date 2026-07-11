import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY } from '../../../../constants/theme';
import type { CreateTripFormValues } from '../types';

interface Props {
  watch: UseFormWatch<CreateTripFormValues>;
  setValue: UseFormSetValue<CreateTripFormValues>;
}

const CATEGORIES = [
  { key: 'Travel',     label: 'Travel',      emoji: '🗺️' },
  { key: 'Beach',      label: 'Beach',       emoji: '🏖️' },
  { key: 'Hill',       label: 'Hill',        emoji: '⛰️' },
  { key: 'Trekking',   label: 'Trekking',    emoji: '🥾' },
  { key: 'Bikeriders', label: 'Bike Riders', emoji: '🏍️' },
  { key: 'Heritage',   label: 'Heritage',    emoji: '🏛️' },
  { key: 'Wildlife',   label: 'Wildlife',    emoji: '🦁' },
  { key: 'Citytour',   label: 'City tour',   emoji: '🏙️' },
];

export default function Step5Audience({ watch, setValue }: Props) {
  const { colors } = useTheme();
  const selected = watch('audience') ?? '';

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>
        SELECT ONE OF THE FOLLOWING CATEGORIES
      </Text>

      <View style={styles.grid}>
        {CATEGORIES.map((cat) => {
          const isSelected = selected === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              style={styles.categoryItem}
              onPress={() => setValue('audience', cat.key)}
              activeOpacity={0.75}
            >
              <View
                style={[
                  styles.categoryIconBox,
                  isSelected && styles.categoryIconBoxSelected,
                  {
                    backgroundColor: isSelected ? (colors.primaryLight ?? '#EDE9FA') : '#F3F4F6',
                    borderColor: isSelected ? colors.primary : 'transparent',
                  },
                ]}
              >
                <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              </View>
              <Text
                style={[
                  styles.categoryLabel,
                  { color: isSelected ? colors.primary : '#9CA3AF' },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 20 },
  sectionLabel: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.fontFamilyBold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  categoryItem: {
    width: '25%',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 6,
  },
  categoryIconBox: {
    width: 64,
    height: 64,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryIconBoxSelected: { borderWidth: 2 },
  categoryEmoji: { fontSize: 28 },
  categoryLabel: {
    fontSize: 11,
    fontFamily: TYPOGRAPHY.fontFamilySemiBold,
    textAlign: 'center',
  },
});