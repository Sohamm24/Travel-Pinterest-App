import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY } from '../../../../constants/theme';

// In a real app, replace these with actual image assets
const CATEGORIES = [
  { key: 'Travel',    label: 'Travel',      emoji: '🗺️' },
  { key: 'Beach',     label: 'Beach',       emoji: '🏖️' },
  { key: 'Hill',      label: 'Hill',        emoji: '⛰️' },
  { key: 'Trekking',  label: 'Trekking',    emoji: '🥾' },
  { key: 'Bikeriders',label: 'Bike Riders', emoji: '🏍️' },
  { key: 'Heritage',  label: 'Heritage',    emoji: '🏛️' },
  { key: 'Wildlife',  label: 'Wildlife',    emoji: '🦁' },
  { key: 'Citytour',  label: 'City tour',   emoji: '🏙️' },
];

export default function Step5Audience({ formData, setFormData }: any) {
  const { colors } = useTheme();
  const selected: string = formData.audience ?? '';

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
              onPress={() => setFormData({ ...formData, audience: cat.key })}
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

  // 4 items per row — two rows of 4
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  categoryItem: {
    // exactly 25% width so 4 fit per row, no gap needed (padding creates visual spacing)
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
  categoryIconBoxSelected: {
    borderWidth: 2,
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryLabel: {
    fontSize: 11,
    fontFamily: TYPOGRAPHY.fontFamilySemiBold,
    textAlign: 'center',
  },
});